import type { Metadata } from "next";
import Link from "next/link";
import { AdminDateRangeFields, AdminPagination } from "@/components/admin-list-controls";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminBlogArticles } from "@/lib/blog/store";
import { updateBlogStatusAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog文章管理 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string; pageSize?: string; range?: string; from?: string; to?: string }> }) {
  await requireAdminSession();
  const params = await searchParams;
  const result = await getAdminBlogArticles(params);
  const { articles } = result;
  return (
    <AdminShell title="Blog文章管理">
      <AdminNotice>这里直接读取 PostgreSQL 文章表。Webhook 发布、后台状态与前台 Blog 使用同一份真实数据。</AdminNotice>
      <section className="admin-panel">
        <form className="admin-filter-grid admin-filter-grid-wide">
          <label className="admin-filter-field"><span>搜索</span><input name="q" placeholder="标题、Slug、作者或分类" defaultValue={params.q || ""} /></label>
          <label className="admin-filter-field"><span>发布状态</span><select name="status" defaultValue={params.status || ""}><option value="">全部状态</option><option value="published">已发布</option><option value="draft">草稿</option><option value="archived">已归档</option></select></label>
          <AdminDateRangeFields range={result.range} />
          <label className="admin-filter-field"><span>每页显示</span><select name="pageSize" defaultValue={String(result.pageSize)}><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option><option value="100">100条</option></select></label>
          <button className="admin-primary-button" type="submit">筛选文章</button>
          <Link href="/admin/blog">重置</Link>
        </form>
        {articles.length ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead><tr><th>标题 / Slug</th><th>分类 / 作者</th><th>状态</th><th>发布时间</th><th>SEO / 同步</th><th>操作</th></tr></thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td><strong>{article.title}</strong><small>{article.slug}</small></td>
                    <td>{article.categoryName}<small>{article.authorId}</small></td>
                    <td><span className="admin-badge">{article.status}</span></td>
                    <td>{new Date(article.publishedAt).toLocaleString("zh-CN")}</td>
                    <td><small>详情页可核对 SEO 与官网发布状态</small></td>
                    <td>
                      <div className="admin-row-actions">
                        <Link href={`/admin/blog/${article.id}`}>详情</Link>
                        {article.status === "published" ? <Link href={`/blog/${article.slug}`} target="_blank">查看</Link> : null}
                        <form action={updateBlogStatusAction}>
                          <input type="hidden" name="id" value={article.id} />
                          <select name="status" defaultValue={article.status} aria-label={`${article.title} 状态`}>
                            <option value="published">已发布</option><option value="draft">草稿</option><option value="archived">已归档</option>
                          </select>
                          <button type="submit">更新</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <AdminEmpty text="暂无 Blog 文章" />}
        <AdminPagination pathname="/admin/blog" page={result.page} pages={result.pages} pageSize={result.pageSize} total={result.total} query={{ q: params.q || undefined, status: params.status || undefined, range: result.range.key, from: params.from || undefined, to: params.to || undefined }} />
      </section>
    </AdminShell>
  );
}
