import type { Metadata } from "next";
import Link from "next/link";
import { UserRoundPlus, Clock3, FileText, TriangleAlert, ChevronRight } from "lucide-react";
import { AdminShell, AdminEmpty, AdminNotice } from "@/components/admin-shell";
import { AdminDateRangeFields } from "@/components/admin-list-controls";
import { getAdminDashboard, formatAdminDate } from "@/lib/admin-data";
import { requireAdminSession } from "@/lib/admin-auth";
import type { AdminListParams } from "@/lib/admin-listing";
import { isNewsAutomationEnabled } from "@/lib/news/policy";
import cron from "../../../vercel.json";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "数据概览 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminDashboardPage({ searchParams }: { searchParams: Promise<AdminListParams> }) {
  await requireAdminSession();
  const dashboard = await getAdminDashboard(await searchParams);
  const { range, primary } = dashboard;
  const query = new URLSearchParams({ range: range.key, from: range.from || "", to: range.to || "" }).toString();
  const metrics = [
    { label: "新客户线索", value: primary?.inquiriesNew, icon: UserRoundPlus, href: `/admin/inquiries?${query}&status=new`, note: "范围内创建 · 当前新线索" },
    { label: "逾期跟进", value: primary?.inquiriesOverdue, icon: Clock3, href: `/admin/inquiries?${query}&followUp=overdue`, note: "范围内创建 · 当前已逾期" },
    { label: "Blog 草稿", value: primary?.blogDraft, icon: FileText, href: `/admin/blog?${query}&status=draft`, note: "范围内创建 · 当前草稿" },
    { label: "同步失败", value: primary?.syncFailed, icon: TriangleAlert, href: `/admin/sync?${query}`, note: "范围内创建的失败同步任务" },
  ];
  const googleSchedule = cron.crons.find((item) => item.path === "/api/cron/sitemap-maintenance")?.schedule;
  return <AdminShell title="数据概览">
    <form className="admin-filter-grid"><AdminDateRangeFields range={range} /><button className="admin-primary-button" type="submit">查询数据</button></form>
    {!dashboard.database.connected ? <AdminNotice><strong>业务数据暂不可用。</strong>请检查数据连接后重新查询。下方不显示未读取的业务数量。</AdminNotice> : null}
    <section className="admin-kpi-band" aria-label="业务摘要">{metrics.map(({ label, value, icon: Icon, href, note }) => <Link href={href} key={label}><Icon size={26} /><div><span>{label}</span><strong>{value ?? "未读取"}</strong><small>{note}</small></div></Link>)}</section>
    <div className="admin-overview-work">
      <section><h2>待处理事项</h2><div className="admin-work-list">{dashboard.workItems.map((item) => <Link key={item.label} href={item.href}><div><strong>{item.label}</strong><br /><span>{item.value}</span></div><ChevronRight size={18} /></Link>)}</div></section>
      <section className="admin-policy"><h2>发布策略</h2>
        <Link href="/admin/news"><span>News 自动发布</span><b className="admin-stopped">{isNewsAutomationEnabled() ? "已启用" : "已停止"}</b></Link>
        <Link href="/admin/seo"><span>Google 提交</span><b>{googleSchedule === "30 2 * * 1" ? "每周一 10:30" : "查看调度配置"}</b></Link>
        <Link href="/admin/blog"><span>Blog 发布</span><b>第三方插件</b></Link>
        <small>发布策略不代表最近一次执行结果。</small>
      </section>
    </div>
    <section className="admin-panel"><div className="admin-panel-heading"><h2>最近活动</h2><Link href={`/admin/logs?${query}`}>查看全部日志</Link></div>
      {dashboard.activity.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>时间</th><th>模块 / 操作</th><th>记录</th><th>详情</th></tr></thead><tbody>{dashboard.activity.map((item) => <tr key={item.id}><td>{formatAdminDate(item.updatedAt)}</td><td>{item.name}</td><td>{item.value}</td><td><Link href={`/admin/logs?${query}`}>查看记录</Link></td></tr>)}</tbody></table></div> : <AdminEmpty text={dashboard.database.connected ? "所选时间范围内暂无操作记录。" : "操作记录尚未读取。"} />}
    </section>
    <section className="admin-panel"><h2>内容与访问</h2><p className="admin-muted">产品、应用、分类与资料入口为当前目录总量；Blog、询盘和事件为所选时间范围。</p><div className="admin-card-grid">{dashboard.cards.map((card) => <Link className="admin-metric-card" key={card.label} href={card.href.startsWith("/admin/") && !card.href.includes("?") ? `${card.href}?${query}` : card.href}><span>{card.label}</span><strong>{card.value}</strong><small>{card.note}</small></Link>)}</div></section>
    <section className="admin-panel"><h2>数据连接</h2><p>{dashboard.database.connected ? "数据库读取成功" : dashboard.database.message} · {formatAdminDate(dashboard.database.checkedAt)}</p><p className="admin-muted">业务记录来自 PostgreSQL；产品与技术目录来自已发布版本。</p></section>
    <details className="admin-panel"><summary>公司基础信息</summary><dl className="admin-definition-list">{dashboard.company.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></details>
  </AdminShell>;
}
