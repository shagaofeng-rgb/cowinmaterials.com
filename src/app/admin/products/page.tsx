import type { Metadata } from "next";
import Link from "next/link";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { getAdminProducts } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";
import { getProductPath } from "@/lib/data";

export const metadata: Metadata = {
  title: "产品管理 | Cowin Materials 后台",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; pageSize?: string }>;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const result = getAdminProducts(params);

  return (
    <AdminShell title="产品管理">
      <AdminNotice>
        <strong>数据来源：Git 版本化技术资料。</strong> 产品官网与后台读取同一份受版本控制的正式目录；为避免“保存成功但官网不变”，当前不提供脱离发布流程的在线编辑。
      </AdminNotice>
      <AdminSyncStatus status="Up to date" label="产品官网内容" />

      <section className="admin-panel">
        <form className="admin-toolbar">
          <input name="q" placeholder="搜索产品名称、SKU、分类或SEO标题" defaultValue={params.q || ""} />
          <select name="pageSize" defaultValue={String(result.pageSize)}>
            <option value="10">10条</option>
            <option value="20">20条</option>
            <option value="50">50条</option>
            <option value="100">100条</option>
          </select>
          <button type="submit">筛选</button>
          <Link href="/admin/products">重置</Link>
        </form>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>产品名称</th>
                <th>SKU</th>
                <th>分类</th>
                <th>关联应用</th>
                <th>状态</th>
                <th>数据来源</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((product) => (
                <tr key={product.slug}>
                  <td>
                    <strong>{product.name}</strong>
                    <small>{product.summary}</small>
                  </td>
                  <td>{product.code}</td>
                  <td>{product.category}</td>
                  <td>{product.applications.length}</td>
                  <td>
                    <span className="admin-badge">{product.status}</span>
                  </td>
                  <td><small>Git 版本化技术资料</small></td>
                  <td>
                    <div className="admin-inline-links"><Link href={`/admin/products/${product.slug}`}>详情</Link><Link href={getProductPath(product)} target="_blank">官网预览</Link></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-pagination">
          <span>
            共 {result.total} 条，第 {result.page} / {result.pages} 页
          </span>
          <div>
            <Link
              aria-disabled={result.page <= 1}
              href={`/admin/products?page=${Math.max(1, result.page - 1)}&pageSize=${result.pageSize}&q=${encodeURIComponent(params.q || "")}`}
            >
              上一页
            </Link>
            <Link
              aria-disabled={result.page >= result.pages}
              href={`/admin/products?page=${Math.min(result.pages, result.page + 1)}&pageSize=${result.pageSize}&q=${encodeURIComponent(params.q || "")}`}
            >
              下一页
            </Link>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
