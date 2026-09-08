import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminDateRangeFields, AdminPagination } from "@/components/admin-list-controls";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { getAdminVisitorJourney } from "@/lib/database";
import { requireAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "访客访问详情 | Cowin Materials 后台", robots: { index: false, follow: false } };

type Query = { page?: string; pageSize?: string; range?: string; from?: string; to?: string };
const eventLabels: Record<string, string> = { page_view: "页面访问", whatsapp_click: "WhatsApp 点击", form_submit: "表单提交", email_click: "邮箱点击", phone_click: "电话点击", request_tds: "TDS 请求", request_sample: "样品请求", request_quote: "报价请求" };

function displayTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Shanghai" }).format(new Date(value));
}

export default async function AdminVisitorDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Query> }) {
  await requireAdminSession();
  const { id } = await params;
  const query = await searchParams;
  const journey = await getAdminVisitorJourney(id, query);
  if (!journey) notFound();
  const paginationQuery = { range: journey.range.key, from: query.from || undefined, to: query.to || undefined };

  return <AdminShell title="访客访问详情">
    <div className="admin-page-actions"><Link href="/admin/analytics">返回访问与转化</Link>{journey.email ? <a className="admin-action-button" href={`mailto:${journey.email}`}>联系客户</a> : null}</div>
    <AdminNotice><strong>受保护数据：</strong>此页仅展示内部第一方会话与路径。访客跨浏览器或跨设备只有在再次提交相同业务邮箱后才会归属到同一客户；系统不会猜测或合并未知身份。</AdminNotice>
    <AdminSyncStatus status="Up to date" lastSyncedAt={journey.lastSeenAt} label={`访问路径 · ${journey.range.label}`} />
    <section className="admin-panel"><h2>{journey.label}</h2><dl className="admin-definition-list"><div><dt>公司</dt><dd>{journey.company || "未识别"}</dd></div><div><dt>业务邮箱</dt><dd>{journey.email || "尚未提交表单"}</dd></div><div><dt>首次访问</dt><dd>{displayTime(journey.firstSeenAt)}</dd></div><div><dt>最近访问</dt><dd>{displayTime(journey.lastSeenAt)}</dd></div><div><dt>首次入口</dt><dd>{journey.landingPath || "未记录"}</dd></div><div><dt>最近页面</dt><dd>{journey.lastPath || "未记录"}</dd></div><div><dt>外部来源</dt><dd>{journey.referrerHost || "直接访问或站内跳转"}</dd></div></dl></section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>会话概览</h2><p>单次会话在连续 30 分钟没有交互后结束。为避免内容堆叠，当前范围最多展示最近 20 次。</p></div></div>{journey.sessions.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>开始 / 结束</th><th>入口</th><th>最后页面</th><th>来源</th><th>事件数</th></tr></thead><tbody>{journey.sessions.map((session) => <tr key={session.id}><td>{displayTime(session.startedAt)}<small>{displayTime(session.lastSeenAt)}</small></td><td>{session.landingPath || "未记录"}</td><td>{session.exitPath || "未记录"}</td><td>{session.referrer || "直接访问或站内跳转"}</td><td>{session.events}</td></tr>)}</tbody></table></div> : <AdminEmpty text="当前时间范围内没有会话。" />}</section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>访问路径</h2><p>按发生时间倒序显示。历史未归属事件不会被补写到本访客。</p></div></div><form className="admin-filter-grid admin-filter-grid-wide"><AdminDateRangeFields range={journey.range} /><label className="admin-filter-field"><span>每页显示</span><select name="pageSize" defaultValue={String(journey.pageSize)}><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option><option value="100">100条</option></select></label><button className="admin-primary-button" type="submit">更新范围</button><Link href={`/admin/visitors/${id}`}>重置</Link></form>{journey.events.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>时间</th><th>事件</th><th>页面</th><th>来源</th></tr></thead><tbody>{journey.events.map((event) => <tr key={event.id}><td>{displayTime(event.occurredAt)}</td><td><span className="admin-badge">{eventLabels[event.name] || event.name}</span></td><td>{event.path || "未记录"}</td><td>{event.source || "website"}</td></tr>)}</tbody></table></div> : <AdminEmpty text="当前时间范围内没有路径事件。" />}<AdminPagination pathname={`/admin/visitors/${id}`} page={journey.page} pages={journey.pages} pageSize={journey.pageSize} total={journey.totalEvents} query={paginationQuery} /></section>
    <section className="admin-panel"><h2>关联客户线索</h2>{journey.inquiries.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>客户 / 公司</th><th>业务邮箱</th><th>提交时间</th><th>操作</th></tr></thead><tbody>{journey.inquiries.map((inquiry) => <tr key={inquiry.id}><td>{inquiry.name}<small>{inquiry.company || "未填写公司"}</small></td><td>{inquiry.email}</td><td>{displayTime(inquiry.createdAt)}</td><td><Link href={`/admin/inquiries/${inquiry.id}`}>打开线索</Link></td></tr>)}</tbody></table></div> : <AdminEmpty text="该访客尚未提交表单，因此未建立客户线索归属。" />}</section>
    {journey.relatedVisitors.length ? <section className="admin-panel"><h2>同一客户的其他访客</h2><div className="admin-inline-links">{journey.relatedVisitors.map((visitor) => <Link key={visitor.id} href={`/admin/visitors/${visitor.id}`}>{visitor.label} · {displayTime(visitor.lastSeenAt)}</Link>)}</div></section> : null}
  </AdminShell>;
}
