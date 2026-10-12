import Link from "next/link";
import Image from "next/image";
import { ExternalLink, LogOut, Inbox } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { adminNavGroups } from "@/lib/admin-data";
import { site } from "@/lib/data";
import { AdminNavigation } from "./admin-navigation";
import "./admin-workspace.css";

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <main className="admin-app" lang="zh-CN">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <span className="admin-brand-logo">
            <Image
              className="brand-logo"
              src="/brand/cowin-cy-logo.png"
              alt=""
              width={48}
              height={48}
              priority
            />
            <span>
              <strong>{site.name}</strong>
              <small>{site.tagline}</small>
            </span>
          </span>
        </Link>
        <AdminNavigation groups={adminNavGroups} />
        <div className="admin-sidebar-footer">Cowin Materials<small>业务管理工作台</small></div>
      </aside>
      <section className="admin-main">
        <div className="admin-workspace-bar"><strong>品牌工作台</strong><span>Asia/Shanghai</span></div>
        <header className="admin-topbar">
          <div>
            <p><Link href="/admin">后台</Link> / {title}</p>
            <h1>{title}</h1>
          </div>
          <div className="admin-top-actions">
            <Link href="/" target="_blank">
              <ExternalLink size={16} />查看前台
            </Link>
            <form action={logoutAction}>
              <button type="submit"><LogOut size={16} />退出登录</button>
            </form>
          </div>
        </header>
        {children}
        <footer className="admin-workspace-footer"><span>Cowin Materials · 运营管理</span><span>时间统一为北京时间</span></footer>
      </section>
    </main>
  );
}

export function AdminNotice({ children }: { children: React.ReactNode }) {
  return <div className="admin-notice">{children}</div>;
}

export function AdminEmpty({ text }: { text: string }) {
  return <div className="admin-empty"><Inbox size={30} aria-hidden="true" /><p>{text}</p></div>;
}
