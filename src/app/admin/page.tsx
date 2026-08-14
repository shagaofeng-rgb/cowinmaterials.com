import type { Metadata } from "next";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { getAdminDashboard } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "数据概览 | Cowin Materials 后台",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  await requireAdminSession();
  const dashboard = await getAdminDashboard();

  return (
    <AdminShell title="数据概览">
      <div className="admin-card-grid">
        {dashboard.cards.map((card) => (
          <Link className="admin-metric-card" href={card.href} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </Link>
        ))}
      </div>

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>待处理事项</h2><p>仅显示权威数据源中的待办数量，不使用模拟统计。</p></div></div>
        <div className="admin-task-grid">
          {dashboard.workItems.map((item) => <Link href={item.href} key={item.label}><strong>{item.label}</strong><span>{item.value}</span></Link>)}
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>数据连接健康度</h2><p>后台读取、邮件通知和同步任务的实际连接边界。</p></div></div>
        <AdminSyncStatus status={dashboard.database.connected ? "Up to date" : "Not connected"} lastSyncedAt={dashboard.database.checkedAt} label="PostgreSQL" />
      </section>

      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>最近活动</h2><p>来自追加式操作日志。</p></div><Link href="/admin/logs">查看全部日志</Link></div>
        {dashboard.activity.length ? <div className="admin-activity-list">{dashboard.activity.map((item) => <Link href={item.href || "/admin/logs"} key={item.id}><strong>{item.name}</strong><span>{item.value}</span><small>{item.updatedAt ? new Date(item.updatedAt).toLocaleString("zh-CN") : ""}</small></Link>)}</div> : <p className="admin-muted">尚无已记录的后台操作。</p>}
      </section>

      <section className="admin-panel">
        <h2>运营状态</h2>
        <div className="admin-definition-list">
          {dashboard.systemStatus.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-panel">
        <h2>公司基础信息</h2>
        <div className="admin-definition-list">
          {dashboard.company.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
