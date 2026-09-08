import type { Metadata } from "next";
import Link from "next/link";
import { AdminDateRangeFields, AdminPagination } from "@/components/admin-list-controls";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { getAdminAnalyticsOverview } from "@/lib/database";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "访问与转化 | Cowin Materials 后台", robots: { index: false, follow: false } };

type Query = { q?: string; page?: string; pageSize?: string; range?: string; from?: string; to?: string };

function displayTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Shanghai" }).format(new Date(value));
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<Query> }) {
  await requireAdminSession();
  const params = await searchParams;
  const data = await getAdminAnalyticsOverview(params);
  const query = { q: params.q || undefined, range: data.range.key, from: params.from || undefined, to: params.to || undefined };
  const conversionRate = data.metrics.pageViews ? `${((data.metrics.contactActions / data.metrics.pageViews) * 100).toFixed(1)}%` : "—";

  return <AdminShell title="访问与转化">
    <AdminNotice><strong>数据范围：</strong>记录第一方匿名访客和会话 ID、访问路径、来源域名及站内转化事件；只有客户主动提交表单后，才在受保护后台将该访客与线索关联。不会把姓名、邮箱、聊天内容或完整外部来源 URL 写入公开页面。</AdminNotice>
    <AdminSyncStatus status="Up to date" lastSyncedAt={data.metrics.latest} label={`访问数据 · ${data.range.label}`} />
    <section className="admin-metric-grid" aria-label="访问数据摘要">
      <article className="admin-metric"><span>页面访问</span><strong>{data.metrics.pageViews}</strong><small>{data.range.label}内已记录事件</small></article>
      <article className="admin-metric"><span>已识别访客</span><strong>{data.metrics.visitors}</strong><small>第一方匿名访客 ID</small></article>
      <article className="admin-metric"><span>访问会话</span><strong>{data.metrics.sessions}</strong><small>30 分钟无操作后新会话</small></article>
      <article className="admin-metric"><span>WhatsApp 点击</span><strong>{data.metrics.whatsappClicks}</strong><small>右侧浮动入口</small></article>
      <article className="admin-metric"><span>表单提交</span><strong>{data.metrics.formSubmits}</strong><small>服务端确认保存后计入</small></article>
      <article className="admin-metric"><span>联系意向率</span><strong>{conversionRate}</strong><small>联系事件 / 页面访问</small></article>
    </section>
    <section className="admin-panel">
      <div className="admin-panel-heading"><div><h2>访客路径与归属</h2><p>同一浏览器的访问会归属到同一个匿名访客；提交表单后可从线索和访客两端回看完整路径。</p></div></div>
      <form className="admin-filter-grid admin-filter-grid-wide">
        <label className="admin-filter-field"><span>搜索</span><input name="q" placeholder="姓名、公司、邮箱或访客 ID" defaultValue={params.q || ""} /></label>
        <AdminDateRangeFields range={data.range} />
        <label className="admin-filter-field"><span>每页显示</span><select name="pageSize" defaultValue={String(data.pageSize)}><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option><option value="100">100条</option></select></label>
        <button className="admin-primary-button" type="submit">查询数据</button>
        <Link href="/admin/analytics">重置</Link>
      </form>
      {data.visitors.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>访客归属</th><th>首次入口 / 最近页面</th><th>来源</th><th>会话 / 事件</th><th>联系行为</th><th>最近访问</th><th>操作</th></tr></thead><tbody>{data.visitors.map((visitor) => <tr key={visitor.id}><td><strong>{visitor.label}</strong><small>{visitor.company || "匿名访客"}{visitor.email ? ` · ${visitor.email}` : ""}</small></td><td>{visitor.landingPath || "未记录"}<small>{visitor.lastPath || "未记录"}</small></td><td>{visitor.referrerHost || "直接访问或站内跳转"}</td><td>{visitor.sessions} / {visitor.events}</td><td>{visitor.contactActions}</td><td>{displayTime(visitor.lastSeenAt)}</td><td><Link href={`/admin/visitors/${visitor.id}?range=${data.range.key}`}>查看路径</Link></td></tr>)}</tbody></table></div> : <AdminEmpty text="当前时间范围内还没有可归属的访客。历史匿名事件仍保留在数据库中，但不会被虚构关联。" />}
      <AdminPagination pathname="/admin/analytics" page={data.page} pages={data.pages} pageSize={data.pageSize} total={data.total} query={query} />
    </section>
  </AdminShell>;
}
