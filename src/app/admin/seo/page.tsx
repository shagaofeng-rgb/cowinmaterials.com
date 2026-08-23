import type { Metadata } from "next";
import Link from "next/link";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { getPublishingOperations } from "@/lib/admin-operations";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "SEO中心 | Cowin Materials 后台", robots: { index: false, follow: false } };

function displayTime(value?: Date | null) {
  return value ? new Date(value).toLocaleString("zh-CN") : "暂无记录";
}

export default async function AdminSeoPage() {
  await requireAdminSession();
  const { sitemapRuns } = await getPublishingOperations();
  const latest = sitemapRuns[0];
  const searchConsoleEnabled = process.env.GOOGLE_SEARCH_CONSOLE_ENABLED === "true";
  const failed = sitemapRuns.filter((run) => run.status === "failed" || run.urls_failed > 0).length;
  const lastSuccessful = sitemapRuns.find((run) => run.status === "completed");

  return (
    <AdminShell title="SEO中心">
      <AdminNotice><strong>数据边界：</strong>这里仅展示站点实际产生的 Sitemap 维护记录和服务器配置状态。Google Search Console 未完成正式授权或未启用时，不显示虚构的排名、点击或收录数据。</AdminNotice>
      <AdminSyncStatus status={failed ? "Failed" : latest ? "Up to date" : "Not connected"} lastSyncedAt={latest?.finished_at?.toISOString() || null} label="Sitemap 与抓取准备" websiteHref="/sitemap.xml" />
      <section className="admin-metric-grid" aria-label="SEO 运行摘要">
        <article className="admin-metric"><span>Sitemap 维护记录</span><strong>{sitemapRuns.length}</strong><small>已落库的最近运行</small></article>
        <article className="admin-metric"><span>最近有效 URL</span><strong>{lastSuccessful?.urls_successful ?? "—"}</strong><small>最近一次成功维护</small></article>
        <article className="admin-metric"><span>需处理错误</span><strong>{failed}</strong><small>运行失败或 URL 验证失败</small></article>
        <article className="admin-metric"><span>Search Console</span><strong>{searchConsoleEnabled ? "已启用" : "未启用"}</strong><small>只显示服务器实际配置</small></article>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>公开 SEO 端点</h2><p>核心页面由 Next.js 路由生成，产品与内容 URL 只在实际公开且可索引时进入 Sitemap。</p></div></div>
        <div className="admin-task-grid"><Link href="/sitemap.xml" target="_blank"><strong>Sitemap Index</strong><span>/sitemap.xml</span></Link><Link href="/robots.txt" target="_blank"><strong>Robots</strong><span>/robots.txt</span></Link><Link href="/llms.txt" target="_blank"><strong>AI discovery</strong><span>/llms.txt</span></Link></div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel-heading"><div><h2>最近 Sitemap 维护</h2><p>每次运行校验站点地图、robots 声明和公开 URL；提交状态仅代表 API 响应，不承诺搜索引擎收录。</p></div></div>
        {sitemapRuns.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>时间</th><th>触发方式</th><th>状态</th><th>URL 结果</th><th>Search Console</th><th>说明</th></tr></thead><tbody>{sitemapRuns.map((run) => <tr key={run.id}><td>{displayTime(run.started_at)}</td><td>{run.trigger_type}</td><td><span className="admin-badge">{run.status}</span></td><td>{run.urls_successful} 成功 / {run.urls_failed} 失败</td><td>{run.search_console_submitted ? run.search_console_status || "已提交" : "本次未提交"}</td><td>{run.message || "—"}</td></tr>)}</tbody></table></div> : <AdminEmpty text="尚无 Sitemap 维护记录。可在“运行与同步”中发起一次受保护的维护。" />}
      </section>
    </AdminShell>
  );
}
