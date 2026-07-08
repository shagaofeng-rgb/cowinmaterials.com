import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";

const cookieName = "cowin_admin_session";
const defaultMaxAge = 60 * 60 * 8;

type SessionPayload = {
  sub: string;
  role: "super_admin";
  exp: number;
};

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.CRON_SECRET || "";
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

  if (!getSecret() || !password) {
    return false;
  }

  if (hash) {
    return verifyScryptHash(password, hash);
  }

  return Boolean(plain) && safeEqual(password, plain || "");
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
    path: "/admin",
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

  const [body, signature] = token.split(".");
  if (!body || !signature || !safeEqual(signature, sign(body))) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as SessionPayload;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
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
