import { Pool } from "pg";
import type { InquiryPayload } from "@/lib/mail";

export type DatabaseHealth = {
  configured: boolean;
  connected: boolean;
  message: string;
  checkedAt: string;
};

let pool: Pool | null = null;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
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

  await activePool.query(
    `insert into inquiries (
      name, company, email, phone, country, customer_type, request_type,
      product, application, message, page_url, utm, created_at, updated_at
    ) values (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12::jsonb, $13, $13
    )`,
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

  return { saved: true };
}
