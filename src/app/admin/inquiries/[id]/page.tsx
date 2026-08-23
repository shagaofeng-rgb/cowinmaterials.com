import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminInquiry, getAdminInquiryNotes } from "@/lib/database";
import { addInquiryNoteAction, updateInquiryWorkflowAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "询盘详情 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminInquiryDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; noted?: string; error?: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const query = await searchParams;
  const inquiry = await getAdminInquiry(id);
  if (!inquiry) notFound();
  const notes = await getAdminInquiryNotes(id);
  const projectDetails = inquiry.projectDetails;

  return (
    <AdminShell title="客户询盘详情">
      <div className="admin-page-actions"><Link href="/admin/inquiries">返回客户线索</Link><a className="admin-action-button" href={`mailto:${inquiry.email}`}>联系客户</a></div>
      {query.saved ? <p className="admin-success" role="status">线索流程已保存，并已写入后台操作日志。</p> : null}
      {query.noted ? <p className="admin-success" role="status">内部备注已追加到线索时间线。</p> : null}
      {query.error ? <p className="admin-error" role="alert">操作未完成，请检查输入内容与数据库连接后重试。</p> : null}
      <AdminNotice><strong>隐私说明：</strong>此页面包含客户原始提交内容，仅限后台会话访问；不会出现在前台、sitemap、OG 或公开 API。</AdminNotice>
      <AdminSyncStatus status="Up to date" lastSyncedAt={inquiry.updatedAt} label="官网表单同步" />
      <section className="admin-panel"><h2>客户与公司信息</h2><dl className="admin-definition-list"><div><dt>姓名</dt><dd>{inquiry.name}</dd></div><div><dt>公司</dt><dd>{inquiry.company || "未填写"}</dd></div><div><dt>邮箱</dt><dd><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></dd></div><div><dt>电话</dt><dd>{inquiry.phone || "未填写"}</dd></div><div><dt>国家/地区</dt><dd>{inquiry.country || "未填写"}</dd></div></dl></section>
      <section className="admin-panel"><h2>客户提交的项目参数</h2><dl className="admin-definition-list"><div><dt>请求类型</dt><dd>{inquiry.requestType || "未填写"}</dd></div><div><dt>产品</dt><dd>{inquiry.product || "未填写"}</dd></div><div><dt>应用</dt><dd>{inquiry.application || "未填写"}</dd></div><div><dt>基材</dt><dd>{projectDetails.substrate || "历史记录未提供"}</dd></div><div><dt>工作温度</dt><dd>{projectDetails.operatingTemperature || "历史记录未提供"}</dd></div><div><dt>目标性能</dt><dd>{projectDetails.targetPerformance || "历史记录未提供"}</dd></div><div><dt>数量 / 面积</dt><dd>{projectDetails.quantity || "历史记录未提供"}</dd></div><div><dt>所需标准</dt><dd>{projectDetails.requiredStandard || "历史记录未提供"}</dd></div><div><dt>采购计划</dt><dd>{projectDetails.purchaseTime || "历史记录未提供"}</dd></div><div><dt>来源页面</dt><dd>{inquiry.pageUrl || "未记录"}</dd></div><div><dt>原始说明</dt><dd className="admin-prewrap">{inquiry.message || "未填写"}</dd></div></dl></section>
      <section className="admin-panel"><h2>内部跟进</h2><form action={updateInquiryWorkflowAction} className="admin-editor-form"><input type="hidden" name="id" value={inquiry.id} /><div className="admin-form-grid"><label>当前状态<select name="status" defaultValue={inquiry.status}><option value="new">新询盘</option><option value="in_progress">跟进中</option><option value="closed">已关闭</option><option value="spam">垃圾信息</option></select></label><label>优先级<select name="priority" defaultValue={inquiry.priority}><option value="urgent">紧急</option><option value="high">高</option><option value="normal">常规</option><option value="low">低</option></select></label><label>销售阶段<select name="leadStage" defaultValue={inquiry.leadStage}><option value="new">新线索</option><option value="qualified">已初筛</option><option value="technical_review">技术评估</option><option value="quotation">报价中</option><option value="sample">样品阶段</option><option value="follow_up">持续跟进</option><option value="won">已赢单</option><option value="lost">未成交</option></select></label><label>下次跟进日期<input name="nextFollowUpAt" type="date" defaultValue={inquiry.nextFollowUpAt?.slice(0, 10) || ""} /></label><label className="admin-form-wide">内部摘要<textarea name="internalSummary" defaultValue={inquiry.internalSummary || ""} rows={5} maxLength={3000} placeholder="记录资格判断、报价条件、技术问题或下一步动作。客户原文不会被覆盖。" /></label></div><div className="admin-save-bar"><span>保存后会重新读取数据库并在操作日志中记录流程变化。</span><button className="admin-primary-button" type="submit">保存销售流程</button></div></form></section>
      <section className="admin-panel"><h2>内部备注与活动</h2><form action={addInquiryNoteAction} className="admin-editor-form"><input type="hidden" name="id" value={inquiry.id} /><label>新增备注<textarea name="note" rows={4} maxLength={3000} required placeholder="写下本次沟通、待补资料或下一步动作。" /></label><div className="admin-save-bar"><span>备注会追加到时间线，不能覆盖客户原文。</span><button className="admin-primary-button" type="submit">添加内部备注</button></div></form>{notes.length ? <div className="admin-note-list">{notes.map((note) => <article key={note.id}><strong>{note.authorLabel}</strong><small>{new Date(note.createdAt).toLocaleString("zh-CN")}</small><p className="admin-prewrap">{note.note}</p></article>)}</div> : <p className="admin-muted">尚无内部备注。</p>}</section>
      <section className="admin-panel"><h2>记录时间线</h2><dl className="admin-definition-list"><div><dt>提交时间</dt><dd>{new Date(inquiry.createdAt).toLocaleString("zh-CN")}</dd></div><div><dt>最近更新</dt><dd>{new Date(inquiry.updatedAt).toLocaleString("zh-CN")}</dd></div><div><dt>最近联系</dt><dd>{inquiry.lastContactedAt ? new Date(inquiry.lastContactedAt).toLocaleString("zh-CN") : "尚未记录"}</dd></div><div><dt>询盘 ID</dt><dd>{inquiry.id}</dd></div></dl></section>
    </AdminShell>
  );
}
