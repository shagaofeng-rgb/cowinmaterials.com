import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import { LoginForm } from "@/app/admin/login/login-form";

export const metadata: Metadata = {
  title: "后台登录 | Cowin Materials",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getAdminSession();
  const params = await searchParams;
  const next = params.next?.startsWith("/admin") ? params.next : "/admin";

  if (session) {
    redirect(next);
  }

  return (
    <main className="admin-login-page">
      <LoginForm next={next} />
    </main>
  );
}
