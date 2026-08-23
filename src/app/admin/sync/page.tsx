import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPublishingOperations } from "@/lib/admin-operations";
import { runSitemapMaintenanceAction } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "运行与同步 | Cowin Materials 后台", robots: { index: false, follow: false } };

function displayTime(value?: Date | null) {
  return value ? new Date(value).toLocaleString("zh-CN") : "暂无记录";
}

export default async function AdminSyncPage({ searchParams }: { searchParams: Promise<{ run?: string }> }) {
  await requireAdminSession();
  const query = await searchParams;
  const { sitemapRuns, webhooks, newsJobs, syncJobs } = await getPublishingOperations();
  const hasFailures = [...sitemapRuns, ...syncJobs].some((job) => job.status === "failed") || webhooks.some((event) => event.outcome === "retryable_failure");
  const latestTime = [sitemapRuns[0]?.finished_at, webhooks[0]?.received_at, newsJobs[0]?.finished_at, syncJobs[0]?.finished_at].filter(Boolean).sort((a, b) => new Date(b!).getTime() - new Date(a!).getTime())[0] || null;

  return (
    <AdminShell title="运行与同步中心">
      {query.run === "success" ? <p className="admin-success" role="status">Sitemap 维护已完成，结果已写入运行记录。</p> : null}
      {query.run === "warning" ? <p className="admin-error" role="alert">Sitemap 维护已完成，但发现需要处理的公开 URL 或 robots 问题。请查看本页运行记录。</p> : null}
      {query.run === "failed" ? <p className="admin-error" role="alert">维护任务未能完成。请检查数据库连接与运行日志。</p> : null}
      <AdminNotice><strong>同步定义：</strong>产品、分类和受控图片由 Git 版本化资料直接构建官网；Blog、News、询盘和站点地图使用 PostgreSQL 真实记录。本页不会把同源内容伪装成额外复制任务。</AdminNotice>
      <AdminSyncStatus status={hasFailures ? "Failed" : "Up to date"} lastSyncedAt={latestTime?.toISOString() || null} label="后台运行状态" />
      <section className="admin-metric-grid" aria-label="运行摘要"><article className="admin-metric"><span>Sitemap 任务</span><strong>{sitemapRuns.length}</strong><small>最近真实运行记录</small></article><article className="admin-metric"><span>Blog Webhook</span><strong>{webhooks.length}</strong><small>最近接收事件</small></article><article className="admin-metric"><span>News 任务</span><strong>{newsJobs.length}</strong><small>自动发布记录</small></article><article className="admin-metric"><span>遗留同步任务</span><strong>{syncJobs.length}</strong><small>兼容历史任务表</small></article></section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><h2>站点地图维护</h2><p>运行将重新校验站点地图、robots 和公开 URL，并记录结果。不会强制向 Google 重复提交。</p></div><form action={runSitemapMaintenanceAction}><button className="admin-primary-button" type="submit">运行一次维护</button></form></div></section>
      <section className="admin-panel"><div className="admin-panel-heading"><div><h2>任务管道</h2><p>每条记录都来自数据库任务、Webhook 审计或自动发布作业。</p></div><Link href="/admin/seo">查看 SEO 详情</Link></div><div className="admin-task-grid"><Link href="/admin/blog"><strong>Blog 发布</strong><span>第三方 Webhook → PostgreSQL articles → 前台 Blog</span></Link><Link href="/admin/news"><strong>News 自动发布</strong><span>自动任务 → news_articles → 前台 News</span></Link><Link href="/admin/inquiries"><strong>客户表单</strong><span>官网表单 → inquiries → 邮件通知 / 销售工作台</span></Link></div></section>
      <section className="admin-panel"><h2>最近 Blog Webhook</h2>{webhooks.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>接收时间</th><th>类型</th><th>栏目</th><th>结果</th><th>HTTP</th><th>安全说明</th></tr></thead><tbody>{webhooks.map((event) => <tr key={event.id}><td>{displayTime(event.received_at)}</td><td>{event.event_type}</td><td>{event.class_id || "—"}</td><td><span className="admin-badge">{event.outcome}</span></td><td>{event.http_status}</td><td>{event.message}</td></tr>)}</tbody></table></div> : <AdminEmpty text="尚无 Blog Webhook 运行记录" />}</section>
      <section className="admin-panel"><h2>最近 News 自动任务</h2>{newsJobs.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>开始时间</th><th>状态</th><th>发布数量</th><th>说明</th></tr></thead><tbody>{newsJobs.map((job) => <tr key={job.id}><td>{displayTime(job.started_at)}</td><td><span className="admin-badge">{job.status}</span></td><td>{job.records_published}</td><td>{job.message || "—"}</td></tr>)}</tbody></table></div> : <AdminEmpty text="尚无 News 自动任务记录" />}</section>
      <section className="admin-panel"><h2>历史同步任务</h2>{syncJobs.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>来源</th><th>状态</th><th>影响记录</th><th>完成时间</th><th>说明</th></tr></thead><tbody>{syncJobs.map((job) => <tr key={job.id}><td>{job.source}</td><td><span className="admin-badge">{job.status}</span></td><td>{job.records_synced}</td><td>{displayTime(job.finished_at || job.started_at)}</td><td>{job.error_message || "—"}</td></tr>)}</tbody></table></div> : <AdminEmpty text="当前没有需要处理的历史同步任务" />}</section>
    </AdminShell>
  );
}
