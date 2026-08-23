import { Pool } from "pg";
import type { InquiryPayload } from "@/lib/mail";

export type DatabaseHealth = {
  configured: boolean;
  connected: boolean;
  message: string;
  checkedAt: string;
};

let pool: Pool | null = null;

function normalizedConnectionString(value: string) {
  const url = new URL(value);
  url.searchParams.delete("sslmode");
  url.searchParams.delete("channel_binding");
  return url.toString();
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: normalizedConnectionString(process.env.DATABASE_URL),
      connectionTimeoutMillis: 3000,
      max: 5,
      ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
    });
  }

  return pool;
}

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  const checkedAt = new Date().toISOString();
  const activePool = getPool();

  if (!activePool) {
    return {
      configured: false,
      connected: false,
      message: "当前使用官网内容目录和邮箱通知作为数据来源。",
      checkedAt,
    };
  }

  try {
    await activePool.query("select 1 as ok");
    return {
      configured: true,
      connected: true,
      message: "PostgreSQL 连接正常。",
      checkedAt,
    };
  } catch {
    return {
      configured: true,
      connected: false,
      message: "数据库连接需要检查。",
      checkedAt,
    };
  }
}

export async function saveInquiryRecord(payload: InquiryPayload) {
  const activePool = getPool();
  if (!activePool) {
    return { saved: false, reason: "database_not_configured" };
  }

  const client = await activePool.connect();
  try {
    await client.query("begin");
    const result = await client.query<{ id: string }>(
    `insert into inquiries (
      name, company, email, phone, country, customer_type, request_type,
      product, application, message, page_url, utm, project_details, created_at, updated_at
    ) values (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12::jsonb, $13::jsonb, $14, $14
    ) returning id`,
    [
      payload.name,
      payload.company || null,
      payload.email,
      payload.phone || null,
      payload.country || null,
      payload.customerType || null,
      payload.requestType || null,
      payload.product || null,
      payload.application || null,
      payload.message || null,
      payload.page || null,
      JSON.stringify(payload.utm || {}),
      JSON.stringify({
        substrate: payload.substrate || null,
        operatingTemperature: payload.operatingTemperature || null,
        targetPerformance: payload.targetPerformance || null,
        quantity: payload.quantity || null,
        requiredStandard: payload.requiredStandard || null,
        purchaseTime: payload.purchaseTime || null,
      }),
      payload.submittedAt ? new Date(payload.submittedAt) : new Date(),
    ],
    );
    const id = result.rows[0]?.id;
    if (!id) throw new Error("Inquiry record was not created.");
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('create', 'inquiries', $1, $2::jsonb)`,
      [id, JSON.stringify({ source: "website_form" })],
    );
    await client.query("commit");
    return { saved: true, id };
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

type AnalyticsEventInput = {
  eventId: string;
  eventName: "page_view" | "whatsapp_click";
  pagePath: string;
  source: "website";
  placement?: "floating_whatsapp";
};

export async function recordAnalyticsEvent(input: AnalyticsEventInput) {
  const activePool = getPool();
  if (!activePool) return { recorded: false, duplicate: false };

  const result = await activePool.query<{ id: string }>(
    `insert into analytics_events (event_id, event_name, page_path, source, occurred_at, metadata)
     values ($1, $2, $3, $4, now(), $5::jsonb)
     on conflict (event_id) do nothing
     returning id`,
    [input.eventId, input.eventName, input.pagePath, input.source, JSON.stringify(input.placement ? { placement: input.placement } : {})],
  );

  return { recorded: Boolean(result.rows[0]?.id), duplicate: result.rowCount === 0 };
}

export type AdminInquiry = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  customerType: string | null;
  requestType: string | null;
  product: string | null;
  application: string | null;
  message: string | null;
  pageUrl: string | null;
  status: string;
  priority: string;
  leadStage: string;
  nextFollowUpAt: string | null;
  lastContactedAt: string | null;
  internalSummary: string | null;
  projectDetails: Record<string, string | null>;
  createdAt: string;
  updatedAt: string;
};

export type AdminInquiryNote = {
  id: string;
  note: string;
  authorLabel: string;
  createdAt: string;
};

export type AdminInquiryListItem = {
  id: string;
  name: string;
  company: string | null;
  email: string;
  country: string | null;
  requestType: string | null;
  product: string | null;
  status: string;
  priority: string;
  leadStage: string;
  nextFollowUpAt: string | null;
  isOverdue: boolean;
  createdAt: string;
};

export type AdminInquiryFilters = {
  q?: string;
  status?: string;
  priority?: string;
  stage?: string;
  followUp?: "overdue" | "today";
};

export async function getAdminInquiryList(filters: AdminInquiryFilters = {}) {
  const activePool = getPool();
  if (!activePool) return [] as AdminInquiryListItem[];
  const clauses = ["deleted_at is null"];
  const values: unknown[] = [];
  const bind = (value: unknown) => {
    values.push(value);
    return `$${values.length}`;
  };
  const query = filters.q?.trim();
  if (query) {
    const value = `%${query}%`;
    const placeholder = bind(value);
    clauses.push(`(name ilike ${placeholder} or company ilike ${placeholder} or email ilike ${placeholder} or product ilike ${placeholder})`);
  }
  if (["new", "in_progress", "closed", "spam"].includes(filters.status || "")) clauses.push(`status = ${bind(filters.status)}`);
  if (["low", "normal", "high", "urgent"].includes(filters.priority || "")) clauses.push(`priority = ${bind(filters.priority)}`);
  if (["new", "qualified", "technical_review", "quotation", "sample", "follow_up", "won", "lost"].includes(filters.stage || "")) clauses.push(`lead_stage = ${bind(filters.stage)}`);
  if (filters.followUp === "overdue") clauses.push("next_follow_up_at < now() and status not in ('closed', 'spam')");
  if (filters.followUp === "today") clauses.push("next_follow_up_at >= date_trunc('day', now()) and next_follow_up_at < date_trunc('day', now()) + interval '1 day'");

  const result = await activePool.query<{
    id: string; name: string; company: string | null; email: string; country: string | null; request_type: string | null;
    product: string | null; status: string; priority: string; lead_stage: string; next_follow_up_at: Date | null; is_overdue: boolean; created_at: Date;
  }>(
    `select id, name, company, email, country, request_type, product, status, priority, lead_stage, next_follow_up_at,
       (next_follow_up_at < now() and status not in ('closed', 'spam')) as is_overdue, created_at
     from inquiries where ${clauses.join(" and ")} order by
       case priority when 'urgent' then 1 when 'high' then 2 when 'normal' then 3 else 4 end,
       next_follow_up_at asc nulls last, created_at desc limit 200`,
    values,
  );
  return result.rows.map((row) => ({
    id: row.id, name: row.name, company: row.company, email: row.email, country: row.country,
    requestType: row.request_type, product: row.product, status: row.status, priority: row.priority,
    leadStage: row.lead_stage, nextFollowUpAt: row.next_follow_up_at?.toISOString() || null, isOverdue: row.is_overdue, createdAt: row.created_at.toISOString(),
  }));
}

export async function getAdminInquiry(id: string): Promise<AdminInquiry | null> {
  const activePool = getPool();
  if (!activePool) return null;
  const result = await activePool.query<{
    id: string; name: string; company: string | null; email: string; phone: string | null; country: string | null;
    customer_type: string | null; request_type: string | null; product: string | null; application: string | null;
    message: string | null; page_url: string | null; status: string; priority: string; lead_stage: string;
    next_follow_up_at: Date | null; last_contacted_at: Date | null; internal_summary: string | null;
    project_details: Record<string, string | null> | null; created_at: Date; updated_at: Date;
  }>(
    `select id, name, company, email, phone, country, customer_type, request_type, product, application,
      message, page_url, status, priority, lead_stage, next_follow_up_at, last_contacted_at, internal_summary,
      project_details, created_at, updated_at
     from inquiries where id = $1 and deleted_at is null limit 1`,
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id, name: row.name, company: row.company, email: row.email, phone: row.phone, country: row.country,
    customerType: row.customer_type, requestType: row.request_type, product: row.product, application: row.application,
    message: row.message, pageUrl: row.page_url, status: row.status, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(),
    priority: row.priority, leadStage: row.lead_stage, nextFollowUpAt: row.next_follow_up_at?.toISOString() || null,
    lastContactedAt: row.last_contacted_at?.toISOString() || null, internalSummary: row.internal_summary,
    projectDetails: row.project_details || {},
  };
}

export async function getAdminInquiryNotes(inquiryId: string): Promise<AdminInquiryNote[]> {
  const activePool = getPool();
  if (!activePool) return [];
  const result = await activePool.query<{ id: string; note: string; author_label: string; created_at: Date }>(
    "select id, note, author_label, created_at from inquiry_notes where inquiry_id = $1 order by created_at desc limit 100",
    [inquiryId],
  );
  return result.rows.map((row) => ({ id: row.id, note: row.note, authorLabel: row.author_label, createdAt: row.created_at.toISOString() }));
}

export async function updateAdminInquiryWorkflow(input: {
  id: string;
  status: "new" | "in_progress" | "closed" | "spam";
  priority: "low" | "normal" | "high" | "urgent";
  leadStage: "new" | "qualified" | "technical_review" | "quotation" | "sample" | "follow_up" | "won" | "lost";
  nextFollowUpAt: string | null;
  internalSummary: string | null;
  actor: string;
}) {
  const activePool = getPool();
  if (!activePool) throw new Error("Inquiry database is not configured.");
  const client = await activePool.connect();
  try {
    await client.query("begin");
    const result = await client.query(
      `update inquiries
       set status = $2, priority = $3, lead_stage = $4, next_follow_up_at = $5,
           internal_summary = $6, last_contacted_at = case when $2 = 'in_progress' then now() else last_contacted_at end,
           is_spam = $2 = 'spam', updated_at = now()
       where id = $1 and deleted_at is null`,
      [input.id, input.status, input.priority, input.leadStage, input.nextFollowUpAt, input.internalSummary],
    );
    if (result.rowCount !== 1) throw new Error("Inquiry was not found.");
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('update_workflow', 'inquiries', $1, $2::jsonb)`,
      [input.id, JSON.stringify({ actor: input.actor, status: input.status, priority: input.priority, leadStage: input.leadStage, nextFollowUpAt: input.nextFollowUpAt })],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function addAdminInquiryNote(input: { inquiryId: string; note: string; actor: string }) {
  const activePool = getPool();
  if (!activePool) throw new Error("Inquiry database is not configured.");
  const client = await activePool.connect();
  try {
    await client.query("begin");
    const inquiry = await client.query("select id from inquiries where id = $1 and deleted_at is null", [input.inquiryId]);
    if (inquiry.rowCount !== 1) throw new Error("Inquiry was not found.");
    await client.query("insert into inquiry_notes (inquiry_id, note, author_label) values ($1, $2, $3)", [input.inquiryId, input.note, input.actor]);
    await client.query("update inquiries set updated_at = now() where id = $1", [input.inquiryId]);
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('add_note', 'inquiries', $1, $2::jsonb)`,
      [input.inquiryId, JSON.stringify({ actor: input.actor, length: input.note.length })],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}

export async function updateAdminInquiryStatus(id: string, status: "new" | "in_progress" | "closed" | "spam", actor: string) {
  const activePool = getPool();
  if (!activePool) throw new Error("Inquiry database is not configured.");
  const client = await activePool.connect();
  try {
    await client.query("begin");
    const result = await client.query(
      `update inquiries set status = $2, is_spam = $2 = 'spam', updated_at = now()
       where id = $1 and deleted_at is null`,
      [id, status],
    );
    if (result.rowCount !== 1) throw new Error("Inquiry was not found.");
    await client.query(
      `insert into audit_logs (action, module, target_id, metadata)
       values ('update_status', 'inquiries', $1, $2::jsonb)`,
      [id, JSON.stringify({ actor, status })],
    );
    await client.query("commit");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    client.release();
  }
}
