import type { Metadata } from "next";
import Link from "next/link";
import { AdminDateRangeFields, AdminPagination } from "@/components/admin-list-controls";
import { AdminEmpty, AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminInquiryList } from "@/lib/database";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "客户线索 | Cowin Materials 后台", robots: { index: false, follow: false } };

const stageLabels: Record<string, string> = {
  new: "新线索", qualified: "已初筛", technical_review: "技术评估", quotation: "报价中",
  sample: "样品阶段", follow_up: "持续跟进", won: "已赢单", lost: "未成交",
};

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; priority?: string; stage?: string; followUp?: "overdue" | "today"; page?: string; pageSize?: string; range?: string; from?: string; to?: string }>;
}) {
  await requireAdminSession();
  const params = await searchParams;
  const result = await getAdminInquiryList(params);
  const { items } = result;
  const active = items.filter((item) => !["closed", "spam"].includes(item.status)).length;
  const highPriority = items.filter((item) => ["high", "urgent"].includes(item.priority)).length;
  const due = items.filter((item) => item.isOverdue).length;

  return (
    <AdminShell title="客户线索工作台">
      <AdminNotice><strong>权威来源：PostgreSQL inquiries。</strong> 官网表单、项目条件和 UTM 数据会写入同一条线索记录；内部跟进只在后台保存，不会改写客户原文或暴露到前台。</AdminNotice>
      <AdminSyncStatus status="Up to date" label="官网表单与销售线索" />
      <section className="admin-metric-grid" aria-label="客户线索摘要">
        <article className="admin-metric"><span>当前结果</span><strong>{result.total}</strong><small>{result.range.label}内的匹配线索</small></article>
        <article className="admin-metric"><span>进行中</span><strong>{active}</strong><small>未关闭或标记垃圾</small></article>
        <article className="admin-metric"><span>高优先级</span><strong>{highPriority}</strong><small>高 / 紧急</small></article>
        <article className="admin-metric"><span>逾期跟进</span><strong>{due}</strong><small>需立即处理</small></article>
      </section>
      <section className="admin-panel">
        <form className="admin-filter-grid admin-filter-grid-wide">
          <label className="admin-filter-field"><span>搜索</span><input name="q" placeholder="姓名、公司、邮箱或产品" defaultValue={params.q || ""} /></label>
          <label className="admin-filter-field"><span>线索状态</span><select name="status" defaultValue={params.status || ""}><option value="">全部状态</option><option value="new">新询盘</option><option value="in_progress">跟进中</option><option value="closed">已关闭</option><option value="spam">垃圾信息</option></select></label>
          <label className="admin-filter-field"><span>优先级</span><select name="priority" defaultValue={params.priority || ""}><option value="">全部优先级</option><option value="urgent">紧急</option><option value="high">高</option><option value="normal">常规</option><option value="low">低</option></select></label>
          <label className="admin-filter-field"><span>销售阶段</span><select name="stage" defaultValue={params.stage || ""}><option value="">全部阶段</option>{Object.entries(stageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="admin-filter-field"><span>跟进时间</span><select name="followUp" defaultValue={params.followUp || ""}><option value="">全部跟进时间</option><option value="overdue">已逾期</option><option value="today">今日跟进</option></select></label>
          <AdminDateRangeFields range={result.range} />
          <label className="admin-filter-field"><span>每页显示</span><select name="pageSize" defaultValue={String(result.pageSize)}><option value="10">10条</option><option value="20">20条</option><option value="50">50条</option><option value="100">100条</option></select></label>
          <button className="admin-primary-button" type="submit">筛选线索</button>
          <Link href="/admin/inquiries">重置</Link>
        </form>
        {items.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>客户 / 公司</th><th>需求</th><th>优先级</th><th>销售阶段</th><th>访问归属</th><th>下次跟进</th><th>提交时间</th><th>操作</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><strong>{item.name}</strong><small>{item.company || item.email} · {item.country || "未填写国家"}</small></td><td>{item.requestType || "未填写需求"}<small>{item.product || "未指定产品"}</small></td><td><span className={`admin-badge admin-badge-${item.priority}`}>{item.priority}</span></td><td><span className="admin-badge">{stageLabels[item.leadStage] || item.leadStage}</span></td><td>{item.visitorId ? <Link href={`/admin/visitors/${item.visitorId}`}>查看路径</Link> : <span className="admin-muted">历史记录未归属</span>}</td><td>{item.nextFollowUpAt ? new Date(item.nextFollowUpAt).toLocaleDateString("zh-CN") : "未安排"}</td><td>{new Date(item.createdAt).toLocaleString("zh-CN")}</td><td><Link href={`/admin/inquiries/${item.id}`}>打开线索</Link></td></tr>)}</tbody></table></div> : <AdminEmpty text="没有匹配的客户线索" />}
        <AdminPagination pathname="/admin/inquiries" page={result.page} pages={result.pages} pageSize={result.pageSize} total={result.total} query={{ q: params.q || undefined, status: params.status || undefined, priority: params.priority || undefined, stage: params.stage || undefined, followUp: params.followUp || undefined, range: result.range.key, from: params.from || undefined, to: params.to || undefined }} />
      </section>
    </AdminShell>
  );
}
