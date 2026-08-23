import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { adminNav, formatAdminDate, getAdminModuleData } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "管理模块 | Cowin Materials 后台",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return adminNav.filter((item) => item.href !== "/admin" && item.href !== "/admin/products" && item.href !== "/admin/blog").map((item) => ({ module: item.href.replace("/admin/", "") }));
}

export default async function AdminModulePage({ params }: { params: Promise<{ module: string }> }) {
  await requireAdminSession();
  const { module } = await params;

  const page = await getAdminModuleData(module);
  if (!page) notFound();

  return (
    <AdminShell title={page.title}>
      <AdminNotice>
        <strong>数据来源：</strong>{page.source}<br />
        {page.description}
      </AdminNotice>
      <AdminSyncStatus status={page.status} lastSyncedAt={page.lastSyncedAt} />
      {page.metrics?.length ? (
        <section className="admin-metric-grid" aria-label={`${page.title} 摘要`}>
          {page.metrics.map((metric) => (
            <article className="admin-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
              <small>{metric.note}</small>
            </article>
          ))}
        </section>
      ) : null}
      <section className="admin-panel">
        {page.rows.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>状态</th>
                  <th>信息</th>
                  <th>最近更新</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((row, index) => (
                  <tr key={`${row.name}-${index}`}>
                    <td><strong>{row.name}</strong><small>{row.source}</small></td>
                    <td>
                      <span className="admin-badge">{row.status}</span>
                    </td>
                    <td>{row.value}</td>
                    <td>{formatAdminDate(row.updatedAt)}</td>
                    <td>{row.href ? <Link href={row.href}>查看详情</Link> : <span className="admin-muted">仅供查看</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmpty text="暂无记录" />
        )}
      </section>
    </AdminShell>
  );
}
