import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { getAdminInquiry } from "@/lib/database";
import { updateInquiryStatusAction } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "询盘详情 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminInquiryDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  await requireAdminSession();
  const { id } = await params;
  const query = await searchParams;
  const inquiry = await getAdminInquiry(id);
  if (!inquiry) notFound();

  return (
    <AdminShell title="客户询盘详情">
      <div className="admin-page-actions"><Link href="/admin/inquiries">返回客户表单</Link><a href={`mailto:${inquiry.email}`}>联系客户</a></div>
      {query.saved ? <p className="admin-success" role="status">跟进状态已保存，并已写入后台操作日志。</p> : null}
      {query.error ? <p className="admin-error" role="alert">状态更新失败，请检查数据库连接后重试。</p> : null}
      <AdminNotice><strong>隐私说明：</strong>此页面包含客户原始提交内容，仅限后台会话访问；不会出现在前台、sitemap、OG 或公开 API。</AdminNotice>
      <AdminSyncStatus status="Up to date" lastSyncedAt={inquiry.updatedAt} label="官网表单同步" />
      <section className="admin-panel"><h2>客户与公司信息</h2><dl className="admin-definition-list"><div><dt>姓名</dt><dd>{inquiry.name}</dd></div><div><dt>公司</dt><dd>{inquiry.company || "未填写"}</dd></div><div><dt>邮箱</dt><dd><a href={`mailto:${inquiry.email}`}>{inquiry.email}</a></dd></div><div><dt>电话</dt><dd>{inquiry.phone || "未填写"}</dd></div><div><dt>国家/地区</dt><dd>{inquiry.country || "未填写"}</dd></div></dl></section>
      <section className="admin-panel"><h2>客户提交的项目参数</h2><dl className="admin-definition-list"><div><dt>请求类型</dt><dd>{inquiry.requestType || "未填写"}</dd></div><div><dt>产品</dt><dd>{inquiry.product || "未填写"}</dd></div><div><dt>应用</dt><dd>{inquiry.application || "未填写"}</dd></div><div><dt>来源页面</dt><dd>{inquiry.pageUrl || "未记录"}</dd></div><div><dt>原始说明</dt><dd className="admin-prewrap">{inquiry.message || "未填写"}</dd></div></dl></section>
      <section className="admin-panel"><h2>内部跟进</h2><form action={updateInquiryStatusAction} className="admin-inline-form"><input type="hidden" name="id" value={inquiry.id} /><label>当前状态<select name="status" defaultValue={inquiry.status}><option value="new">新询盘</option><option value="in_progress">跟进中</option><option value="closed">已关闭</option><option value="spam">垃圾信息</option></select></label><button className="admin-primary-button" type="submit">保存跟进状态</button></form><p className="admin-muted">内部备注、负责人和提醒功能需要现有 CRM 或数据模型支持；不会在没有权威字段的情况下写入隐藏数据。</p></section>
      <section className="admin-panel"><h2>记录时间线</h2><dl className="admin-definition-list"><div><dt>提交时间</dt><dd>{new Date(inquiry.createdAt).toLocaleString("zh-CN")}</dd></div><div><dt>最近更新</dt><dd>{new Date(inquiry.updatedAt).toLocaleString("zh-CN")}</dd></div><div><dt>询盘 ID</dt><dd>{inquiry.id}</dd></div></dl></section>
    </AdminShell>
  );
}
