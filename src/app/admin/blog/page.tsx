import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminBlogArticles } from "@/lib/blog/store";
import { updateBlogStatusAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog文章管理 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminBlogPage() {
  await requireAdminSession();
  const articles = await getAdminBlogArticles();
  return (
    <AdminShell title="Blog文章管理">
      <AdminNotice>这里直接读取 PostgreSQL 文章表。Webhook 发布、后台状态与前台 Blog 使用同一份真实数据。</AdminNotice>
      <section className="admin-panel">
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
      </section>
    </AdminShell>
  );
}
