import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { adminModules } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";

type ModuleKey = keyof typeof adminModules;

export const metadata: Metadata = {
  title: "管理模块 | Cowin Materials 后台",
  robots: { index: false, follow: false },
};

export function generateStaticParams() {
  return Object.keys(adminModules).map((module) => ({ module }));
}

export default async function AdminModulePage({ params }: { params: Promise<{ module: string }> }) {
  await requireAdminSession();
  const { module } = await params;

  if (!(module in adminModules)) {
    notFound();
  }

  const page = adminModules[module as ModuleKey];

  return (
    <AdminShell title={page.title}>
      <AdminNotice>{page.description}</AdminNotice>
      <section className="admin-panel">
        {page.rows.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>名称</th>
                  <th>状态</th>
                  <th>信息</th>
                </tr>
              </thead>
              <tbody>
                {page.rows.map((row, index) => {
                  const info = "value" in row ? row.value : "count" in row ? row.count : "sort" in row ? row.sort : "-";

                  return (
                  <tr key={`${row.name}-${index}`}>
                    <td>
                      <strong>{row.name}</strong>
                    </td>
                    <td>
                      <span className="admin-badge">{row.status}</span>
                    </td>
                    <td>{info}</td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmpty text="暂无真实数据。请先配置数据库和相应数据源，系统不会用演示数据冒充生产数据。" />
        )}
      </section>
    </AdminShell>
  );
}
