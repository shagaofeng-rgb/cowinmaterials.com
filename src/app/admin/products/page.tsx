import type { Metadata } from "next";
import Link from "next/link";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { getAdminProducts } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";

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
        数据来源：官网已发布产品目录。列表仅显示当前对外可见的正式产品信息。
      </AdminNotice>

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
                <th>状态</th>
                <th>语言</th>
                <th>SEO标题</th>
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
                  <td>
                    <span className="admin-badge">{product.status}</span>
                  </td>
                  <td>{product.language}</td>
                  <td>{product.seoTitle}</td>
                  <td>
                    <Link href={`/products/${product.slug}`} target="_blank">
                      预览
                    </Link>
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
