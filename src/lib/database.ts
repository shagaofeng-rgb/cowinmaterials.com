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
      product, application, message, page_url, utm, created_at, updated_at
    ) values (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12::jsonb, $13, $13
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
  createdAt: string;
  updatedAt: string;
};

export async function getAdminInquiry(id: string): Promise<AdminInquiry | null> {
  const activePool = getPool();
  if (!activePool) return null;
  const result = await activePool.query<{
    id: string; name: string; company: string | null; email: string; phone: string | null; country: string | null;
    customer_type: string | null; request_type: string | null; product: string | null; application: string | null;
    message: string | null; page_url: string | null; status: string; created_at: Date; updated_at: Date;
  }>(
    `select id, name, company, email, phone, country, customer_type, request_type, product, application,
      message, page_url, status, created_at, updated_at
     from inquiries where id = $1 and deleted_at is null limit 1`,
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    id: row.id, name: row.name, company: row.company, email: row.email, phone: row.phone, country: row.country,
    customerType: row.customer_type, requestType: row.request_type, product: row.product, application: row.application,
    message: row.message, pageUrl: row.page_url, status: row.status, createdAt: row.created_at.toISOString(), updatedAt: row.updated_at.toISOString(),
  };
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
