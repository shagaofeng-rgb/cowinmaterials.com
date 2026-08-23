import Link from "next/link";
import Image from "next/image";
import type { ComponentType } from "react";
import { BarChart3, BookOpenText, Boxes, ChartNoAxesCombined, ClipboardList, FileStack, FolderOpen, ImageIcon, Newspaper, RefreshCw, ScrollText, SearchCheck, Settings, ShieldCheck, UsersRound } from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { adminNavGroups } from "@/lib/admin-data";
import { site } from "@/lib/data";

const navIcons: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  "/admin": BarChart3, "/admin/inquiries": ClipboardList, "/admin/analytics": ChartNoAxesCombined,
  "/admin/products": Boxes, "/admin/categories": FolderOpen, "/admin/blog": BookOpenText,
  "/admin/news": Newspaper, "/admin/documents": FileStack, "/admin/media": ImageIcon,
  "/admin/seo": SearchCheck, "/admin/sync": RefreshCw, "/admin/logs": ScrollText,
  "/admin/users": UsersRound, "/admin/settings": Settings,
};

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
          <em>中文管理后台</em>
        </Link>
        <nav aria-label="后台主导航" className="admin-nav-groups">
          {adminNavGroups.map((group) => (
            <section key={group.label}>
              <p>{group.label}</p>
              {group.items.map((item) => {
                const Icon = navIcons[item.href] || ShieldCheck;
                return <Link href={item.href} key={item.href}><Icon size={16} strokeWidth={1.9} /><span>{item.label}</span></Link>;
              })}
            </section>
          ))}
        </nav>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <div>
            <p>{site.domain}</p>
            <h1>{title}</h1>
          </div>
          <div className="admin-top-actions">
            <Link href="/" target="_blank">
              查看前台
            </Link>
            <form action={logoutAction}>
              <button type="submit">退出登录</button>
            </form>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function AdminNotice({ children }: { children: React.ReactNode }) {
  return <div className="admin-notice">{children}</div>;
}

export function AdminEmpty({ text }: { text: string }) {
  return <div className="admin-empty">{text}</div>;
}
