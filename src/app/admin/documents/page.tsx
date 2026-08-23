import type { Metadata } from "next";
import Link from "next/link";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { requireAdminSession } from "@/lib/admin-auth";
import { resourceSections } from "@/lib/data";

export const metadata: Metadata = { title: "技术资料 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminDocumentsPage() {
  await requireAdminSession();
  return <AdminShell title="技术资料中心">
    <AdminNotice><strong>权威来源：Git 版本化技术资料与受控资源中心。</strong> 当前对外资料按项目申请提供，未建立独立上传存储前，此页不会伪造“在线文件库”或下载次数。</AdminNotice>
    <AdminSyncStatus status="Up to date" label="官网资源入口" websiteHref="/resources" />
    <section className="admin-metric-grid"><article className="admin-metric"><span>资料入口</span><strong>{resourceSections.length}</strong><small>前台资源中心</small></article><article className="admin-metric"><span>下载策略</span><strong>申请制</strong><small>按产品与目的地核对</small></article><article className="admin-metric"><span>独立媒体资产</span><strong>未连接</strong><small>不会显示虚构文件</small></article><article className="admin-metric"><span>产品资料来源</span><strong>Git</strong><small>版本化技术目录</small></article></section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>公开资料入口</h2><p>这些入口与前台 Resources 页面使用同一份版本化内容。</p></div><Link href="/resources" target="_blank">查看前台</Link></div><div className="admin-resource-grid">{resourceSections.map((resource) => <article key={resource.id}><strong>{resource.title}</strong><p>{resource.text}</p><span>{resource.action}</span></article>)}</div></section>
    <section className="admin-panel"><h2>下一步资料治理</h2><p className="admin-muted">需要上线独立文件上传、版本替换或下载权限时，再接入已授权的对象存储，并记录资料版本、适用产品、来源、许可与替换影响。当前不创建与官网内容脱节的空媒体库。</p></section>
  </AdminShell>;
}
