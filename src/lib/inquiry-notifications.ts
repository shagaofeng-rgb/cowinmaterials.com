import "server-only";
import { getPool } from "@/lib/database";
import { sendInquiryEmail, type InquiryPayload } from "@/lib/mail";
import { classifyNotificationFailure, maxNotificationAttempts, type NotificationStatus } from "@/lib/inquiry-notification-policy";

type NotificationRow = {
  status: NotificationStatus;
  attempts: number;
  retry_at: Date;
  accepted_at: Date | null;
  last_attempt_at: Date | null;
  failure_code: string | null;
};

type ClaimedNotification = {
  attempts: number;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  country: string | null;
  customer_type: string | null;
  request_type: string | null;
  product: string | null;
  application: string | null;
  message: string | null;
  page_url: string | null;
  utm: Record<string, string>;
  project_details: Partial<Pick<InquiryPayload, "substrate" | "operatingTemperature" | "targetPerformance" | "quantity" | "requiredStandard" | "purchaseTime">>;
  submitted_at: Date;
  attachment_name: string | null;
  attachment_type: string | null;
  attachment_content: Buffer | null;
};

function requirePool() {
  const pool = getPool();
  if (!pool) throw new Error("Inquiry notification storage is not configured.");
  return pool;
}

export async function getInquiryNotification(inquiryId: string) {
  const pool = requirePool();
  const { rows } = await pool.query<NotificationRow>(
    "select status, attempts, retry_at, accepted_at, last_attempt_at, failure_code from inquiry_notifications where inquiry_id = $1",
    [inquiryId],
  );
  if (rows[0]) return { notification: rows[0], legacy: null };
  const legacy = await pool.query<{ action: string; created_at: Date }>(
    "select action, created_at from audit_logs where module = 'inquiries' and target_id = $1 and action in ('notification_sent', 'notification_failed') order by created_at desc limit 1",
    [inquiryId],
  );
  return { notification: null, legacy: legacy.rows[0] || null };
}

export async function deliverInquiryNotification(inquiryId: string, actor?: string) {
  const pool = requirePool();
  const { rows } = await pool.query<ClaimedNotification>(
    `update inquiry_notifications n
     set status = 'sending', attempts = n.attempts + 1, last_attempt_at = now()
     from inquiries i
     where n.inquiry_id = $1 and i.id = n.inquiry_id and i.deleted_at is null and i.status <> 'spam'
       and n.attempts < $2
       and ((n.status in ('pending', 'retry') and n.retry_at <= now())
         or ($3::boolean and n.status in ('retry', 'failed')))
     returning n.attempts, n.attachment_name, n.attachment_type, n.attachment_content,
       i.name, i.email, i.company, i.phone, i.country, i.customer_type, i.request_type, i.product,
       i.application, i.message, i.page_url, i.utm, i.project_details, i.created_at as submitted_at`,
    [inquiryId, maxNotificationAttempts, Boolean(actor)],
  );
  const row = rows[0];
  if (!row) return null;

  const payload: InquiryPayload = {
    ...row.project_details,
    name: row.name,
    email: row.email,
    company: row.company || undefined,
    phone: row.phone || undefined,
    country: row.country || undefined,
    customerType: row.customer_type || undefined,
    requestType: row.request_type || undefined,
    product: row.product || undefined,
    application: row.application || undefined,
    message: row.message || undefined,
    page: row.page_url || undefined,
    utm: row.utm,
    submittedAt: row.submitted_at.toISOString(),
    attachment: row.attachment_content && row.attachment_name
      ? { filename: row.attachment_name, contentType: row.attachment_type || undefined, content: row.attachment_content }
      : undefined,
  };
  let status: NotificationStatus = "accepted";
  let code: string | null = null;
  try {
    const sent = await sendInquiryEmail(payload, inquiryId);
    if (sent === "partial") {
      status = "uncertain";
      code = "smtp_partial_acceptance";
    }
  } catch (error) {
    ({ status, code } = classifyNotificationFailure(error, row.attempts));
  }
  // Once SMTP might have accepted the message, a failed database update must never cause a resend.
  await pool.query(
    `with completed as (
       update inquiry_notifications
       set status = $2, failure_code = $3,
         retry_at = now() + case when attempts = 1 then interval '15 minutes' else interval '1 hour' end,
         accepted_at = case when $2 = 'accepted' then now() else null end,
         attachment_content = case when $2 = 'accepted' then null else attachment_content end
       where inquiry_id = $1 and status = 'sending' and attempts = $4
       returning inquiry_id
     )
     insert into audit_logs (action, module, target_id, metadata)
     select $5, 'inquiries', inquiry_id::text, $6::jsonb from completed`,
    [inquiryId, status, code, row.attempts, `notification_${status === "accepted" ? "sent" : status}`, JSON.stringify({
      channel: "email", status, attempt: row.attempts, failureCode: code, actor: actor || "system",
    })],
  );
  return status;
}

export async function retryDueInquiryNotifications() {
  const pool = requirePool();
  await pool.query("delete from admin_login_limits where reset_at < now() - interval '1 day'");
  const stale = await pool.query(
    `update inquiry_notifications
     set status = 'uncertain', failure_code = 'interrupted_smtp_attempt'
     where status = 'sending' and last_attempt_at < now() - interval '10 minutes'`,
  );
  const { rows } = await pool.query<{ inquiry_id: string }>(
    `select n.inquiry_id from inquiry_notifications n join inquiries i on i.id = n.inquiry_id
     where n.status in ('pending', 'retry') and n.retry_at <= now() and n.attempts < $1
       and i.deleted_at is null and i.status <> 'spam'
     order by n.retry_at limit 4`, [maxNotificationAttempts],
  );
  const results = await Promise.allSettled(rows.map(({ inquiry_id }) => deliverInquiryNotification(inquiry_id)));
  return {
    selected: rows.length,
    accepted: results.filter((result) => result.status === "fulfilled" && result.value === "accepted").length,
    failed: results.filter((result) => result.status === "rejected" || (result.status === "fulfilled" && ["failed", "uncertain"].includes(result.value || ""))).length,
    interrupted: stale.rowCount || 0,
  };
}
