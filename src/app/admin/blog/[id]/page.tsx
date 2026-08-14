import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminBlogArticle } from "@/lib/blog/store";
import { saveBlogArticleAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Blog文章详情 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminBlogDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const query = await searchParams;
  const article = await getAdminBlogArticle(id);
  if (!article) notFound();
  const isPublished = article.status === "published";

  return (
    <AdminShell title="Blog文章详情">
      <div className="admin-page-actions"><Link href="/admin/blog">返回文章列表</Link>{isPublished ? <Link className="admin-action-button" href={`/blog/${article.slug}`} target="_blank">查看官网</Link> : null}</div>
      {query.saved ? <p className="admin-success" role="status">已保存。服务端已写入 PostgreSQL，并已触发 Blog、详情页和 Sitemap 的缓存重验证。</p> : null}
      {query.error ? <p className="admin-error" role="alert">保存未完成。请确认必填字段与数据库连接后重试。</p> : null}
      <AdminNotice><strong>数据来源：PostgreSQL articles。</strong> 保存后会重新读取文章、写入脱敏操作日志并按发布状态更新官网缓存。草稿与归档内容不会进入公开 Blog 列表或站点地图。</AdminNotice>
      <AdminSyncStatus status={isPublished ? "Up to date" : "Pending"} websiteHref={isPublished ? `/blog/${article.slug}` : undefined} lastSyncedAt={article.updatedAt} label="官网发布状态" />
      <form action={saveBlogArticleAction} className="admin-editor-form">
        <input type="hidden" name="id" value={article.id} />
        <section className="admin-panel"><h2>基本信息</h2><div className="admin-form-grid"><label>文章标题<input name="title" defaultValue={article.title} maxLength={220} required /></label><label>作者<input name="authorId" defaultValue={article.authorId} maxLength={120} required /></label><label>Slug<input value={article.slug} readOnly aria-readonly="true" /><small>Webhook 与现有 SEO URL 使用固定 slug；如需迁移 URL，应单独建立 301 策略。</small></label><label>发布状态<select name="status" defaultValue={article.status}><option value="draft">草稿</option><option value="published">已发布</option><option value="archived">已归档</option></select></label><label className="admin-form-wide">封面图 URL<input name="imageUrl" defaultValue={article.imageUrl || ""} inputMode="url" placeholder="https://" /><small>仅接受 HTTPS URL；未填写则不显示封面。</small></label></div></section>
        <section className="admin-panel"><h2>正文编辑</h2><label className="admin-form-wide">HTML 正文<textarea name="content" defaultValue={article.contentHtml} rows={20} required /><small>保存时仅保留安全的文章标签和 HTTPS 媒体链接。</small></label></section>
        <section className="admin-panel"><h2>SEO 与发布核对</h2><dl className="admin-definition-list"><div><dt>Canonical</dt><dd>/blog/{article.slug}</dd></div><div><dt>摘要</dt><dd>{article.excerpt || "将由正文自动生成"}</dd></div><div><dt>最后更新</dt><dd>{new Date(article.updatedAt).toLocaleString("zh-CN")}</dd></div><div><dt>分类</dt><dd>{article.categoryName}</dd></div></dl></section>
        <div className="admin-save-bar"><span>保存前会在服务器校验并净化文章内容；只在数据库写入成功后显示保存结果。</span><button className="admin-primary-button" type="submit">保存文章资料</button></div>
      </form>
    </AdminShell>
  );
}
