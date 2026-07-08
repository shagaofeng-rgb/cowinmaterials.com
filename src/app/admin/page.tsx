import type { Metadata } from "next";
import { AdminShell } from "@/components/admin-shell";
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
          <div className="admin-metric-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <small>{card.note}</small>
          </div>
        ))}
      </div>

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
