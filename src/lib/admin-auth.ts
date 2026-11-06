import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { isIP } from "node:net";
import { getPool } from "@/lib/database";

const cookieName = "cowin_admin_session";
const defaultMaxAge = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  role: "super_admin";
  exp: number;
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || "";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

function toBase64Url(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function verifyScryptHash(password: string, encodedHash: string) {
  const [scheme, nValue, rValue, pValue, salt, expected] = encodedHash.split(":");
  if (scheme !== "scrypt" || !nValue || !rValue || !pValue || !salt || !expected) {
    return false;
  }

  const hash = crypto.scryptSync(password, salt, Buffer.from(expected, "base64url").length, {
    N: Number(nValue),
    r: Number(rValue),
    p: Number(pValue),
  });

  return safeEqual(hash.toString("base64url"), expected);
}

export function isAdminConfigured() {
  return Boolean(getSecret() && (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD));
}

export function verifyAdminPassword(password: string) {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  if (!getSecret() || !password || password.length > 1024) {
    return false;
  }

  if (hash) {
    try { return verifyScryptHash(password, hash); } catch { return false; }
  }

  return Boolean(plain) && safeEqual(password, plain || "");
}

export async function allowAdminLoginAttempt() {
  const pool = getPool();
  if (!pool || !getSecret()) return false;
  const requestHeaders = await headers();
  const value = requestHeaders.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "";
  const address = process.env.VERCEL === "1" && isIP(value) ? value : "unidentified";
  const fingerprint = crypto.createHmac("sha256", getSecret()).update(`login-rate:${address}`).digest("hex");
  const { rows } = await pool.query<{ allowed: boolean }>(
    `insert into admin_login_limits (fingerprint, attempts, reset_at)
     values ($1, 1, now() + interval '10 minutes')
     on conflict (fingerprint) do update set
       attempts = case when admin_login_limits.reset_at <= now() then 1 else least(admin_login_limits.attempts + 1, 9) end,
       reset_at = case when admin_login_limits.reset_at <= now() then excluded.reset_at else admin_login_limits.reset_at end
     returning attempts <= 8 as allowed`, [fingerprint],
  );
  return Boolean(rows[0]?.allowed);
}

export async function createAdminSession(remember: boolean) {
  const maxAge = remember ? 60 * 60 * 24 * 30 : defaultMaxAge;
  const payload: SessionPayload = {
    sub: process.env.ADMIN_USERNAME || "admin",
    role: "super_admin",
    exp: Math.floor(Date.now() / 1000) + maxAge,
  };
  const body = toBase64Url(JSON.stringify(payload));
  const token = `${body}.${sign(body)}`;
  const cookieStore = await cookies();

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    // Admin pages call protected /api/admin routes, so the session must cover both trees.
    path: "/",
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(cookieName);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token || !getSecret()) {
    return null;
  }

  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra !== undefined || !safeEqual(signature, sign(body))) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as SessionPayload;
    if (payload.sub !== (process.env.ADMIN_USERNAME || "admin") || payload.role !== "super_admin" ||
        !Number.isSafeInteger(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) {
    const headerStore = await headers();
    const nextPath = headerStore.get("x-pathname") || "/admin";
    redirect(`/admin/login?next=${encodeURIComponent(nextPath)}`);
  }

  return session;
}
