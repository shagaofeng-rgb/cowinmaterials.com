import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDateRangeFields, AdminPagination } from "@/components/admin-list-controls";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { adminNav, formatAdminDate, getAdminModuleData } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "管理模块 | Cowin Materials 后台",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  const dedicatedRoutes = new Set(["/admin", "/admin/products", "/admin/blog", "/admin/inquiries", "/admin/analytics", "/admin/news", "/admin/documents", "/admin/seo", "/admin/sync"]);
  return adminNav.filter((item) => !dedicatedRoutes.has(item.href)).map((item) => ({ module: item.href.replace("/admin/", "") }));
}

export default async function AdminModulePage({ params, searchParams }: { params: Promise<{ module: string }>; searchParams: Promise<{ q?: string; page?: string; pageSize?: string; range?: string; from?: string; to?: string }> }) {
  await requireAdminSession();
  const { module } = await params;
  const query = await searchParams;

  const page = await getAdminModuleData(module, query);
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
        {page.pagination && page.range ? <form className="admin-filter-grid admin-filter-grid-wide"><label className="admin-filter-field"><span>搜索</span><input name="q" defaultValue={query.q || ""} placeholder="模块、动作或记录 ID" /></label><AdminDateRangeFields range={page.range} /><label className="admin-filter-field"><span>每页显示</span><select name="pageSize" defaultValue={String(page.pagination.pageSize)}><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option><option value="100">100条</option></select></label><button className="admin-primary-button" type="submit">查询记录</button><Link href={`/admin/${module}`}>重置</Link></form> : null}
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
        {page.pagination ? <AdminPagination pathname={`/admin/${module}`} page={page.pagination.page} pages={page.pagination.pages} pageSize={page.pagination.pageSize} total={page.pagination.total} query={{ q: query.q || undefined, range: page.range?.key, from: query.from || undefined, to: query.to || undefined }} /> : null}
      </section>
    </AdminShell>
  );
}
