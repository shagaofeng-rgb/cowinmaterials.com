import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";
import { adminNav } from "@/lib/admin-data";
import { site } from "@/lib/data";

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <Link className="admin-brand" href="/admin">
          <span className="admin-brand-logo">
            <span className="brand-mark">CM</span>
            <span>
              <strong>{site.name}</strong>
              <small>{site.tagline}</small>
            </span>
          </span>
          <em>中文管理后台</em>
        </Link>
        <nav>
          {adminNav.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
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
