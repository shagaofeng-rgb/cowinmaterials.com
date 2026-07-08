import type { Metadata } from "next";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
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

      <AdminNotice>
        <strong>数据库状态：</strong>
        {dashboard.database.message}
        <br />
        <small>检查时间：{dashboard.database.checkedAt}</small>
      </AdminNotice>

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

      <section className="admin-panel">
        <h2>第一阶段上线范围</h2>
        <ul className="admin-check-list">
          <li>中文后台登录入口、服务端会话校验和退出登录。</li>
          <li>产品、分类、询盘、SEO、媒体、用户、日志、设置、同步模块框架。</li>
          <li>PostgreSQL 数据库 schema、环境变量说明和部署文档。</li>
          <li>未配置外部凭证的数据模块只显示真实状态，不伪造访问量或SEO表现。</li>
        </ul>
      </section>
    </AdminShell>
  );
}
