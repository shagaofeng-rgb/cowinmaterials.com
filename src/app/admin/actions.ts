"use server";

import { redirect } from "next/navigation";
import { allowAdminLoginAttempt, createAdminSession, destroyAdminSession, isAdminConfigured, verifyAdminPassword } from "@/lib/admin-auth";

export type LoginState = {
  error?: string;
};

export async function loginAction(_state: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAdminConfigured()) {
    return { error: "后台登录服务当前不可用，请联系管理员。" };
  }

  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");
  const remember = formData.get("remember") === "on";
  const next = String(formData.get("next") || "/admin");
  const expectedUsername = process.env.ADMIN_USERNAME || "admin";

  try {
    if (!await allowAdminLoginAttempt()) return { error: "登录尝试次数过多，请 10 分钟后重试。" };
  } catch {
    return { error: "后台登录服务暂不可用，请稍后重试。" };
  }

  if (username !== expectedUsername || !verifyAdminPassword(password)) {
    return { error: "账号或密码不正确，请检查后重试。" };
  }

  await createAdminSession(remember);
  redirect(/^\/admin(?:\/[^\\\s]*|\?[^\\\s]*)?$/.test(next) ? next : "/admin");
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
