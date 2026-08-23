import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { getNewsOperations } from "@/lib/admin-operations";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "News运营 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminNewsPage() {
  await requireAdminSession();
  const { totals, jobs, articles } = await getNewsOperations();
  return <AdminShell title="News运营中心">
    <AdminNotice><strong>数据来源：PostgreSQL news_articles / news_jobs。</strong> News 自动任务仅在来源、新鲜度、产品关联和重复校验通过后直接发布；此页展示真实发布和拒绝记录，不提供伪审核动作。</AdminNotice>
    <AdminSyncStatus status={jobs.some((job) => job.status === "failed") ? "Failed" : "Up to date"} lastSyncedAt={totals.latest?.toISOString() || null} label="News 自动发布" websiteHref="/news" />
    <section className="admin-metric-grid"><article className="admin-metric"><span>已发布</span><strong>{Number(totals.published)}</strong><small>公开 News</small></article><article className="admin-metric"><span>待处理</span><strong>{Number(totals.review)}</strong><small>草稿 / 审核状态</small></article><article className="admin-metric"><span>未采用</span><strong>{Number(totals.failed)}</strong><small>已拒绝 / 已归档</small></article><article className="admin-metric"><span>最近更新</span><strong>{totals.latest ? new Date(totals.latest).toLocaleDateString("zh-CN") : "—"}</strong><small>真实数据库记录</small></article></section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>最近自动任务</h2><p>采集、相关性筛选、去重和直接发布的运行结果。</p></div></div>{jobs.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>开始时间</th><th>状态</th><th>采集 / 拒绝 / 发布</th><th>结果</th></tr></thead><tbody>{jobs.map((job) => <tr key={job.id}><td>{new Date(job.started_at).toLocaleString("zh-CN")}</td><td><span className="admin-badge">{job.status}</span></td><td>{job.records_collected} / {job.records_rejected} / {job.records_published}</td><td>{job.message || "—"}</td></tr>)}</tbody></table></div> : <AdminEmpty text="尚无 News 自动任务记录" />}</section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>最近 News 内容</h2><p>前台仅展示已发布、可索引且封面验证完整的文章。</p></div><Link href="/news" target="_blank">查看前台</Link></div>{articles.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>标题</th><th>来源</th><th>状态</th><th>发布时间</th></tr></thead><tbody>{articles.map((article) => <tr key={article.id}><td><strong>{article.title}</strong><small>/news/{article.slug}</small></td><td>{article.source_publisher}</td><td><span className="admin-badge">{article.status}</span></td><td>{article.published_at ? new Date(article.published_at).toLocaleString("zh-CN") : "未发布"}</td></tr>)}</tbody></table></div> : <AdminEmpty text="尚无 News 内容" />}</section>
  </AdminShell>;
}
