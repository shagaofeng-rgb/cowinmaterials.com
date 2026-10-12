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
    <AdminNotice><strong>权威来源：Git 版本化技术资料与受控资源中心。</strong> 对外资料按产品与项目需求申请提供。</AdminNotice>
    <AdminSyncStatus status="Configured" label="官网资源入口" websiteHref="/resources" />
    <section className="admin-metric-grid"><article className="admin-metric"><span>资料入口</span><strong>{resourceSections.length}</strong><small>前台资源中心</small></article><article className="admin-metric"><span>下载策略</span><strong>申请制</strong><small>按产品与目的地核对</small></article><article className="admin-metric"><span>独立媒体资产</span><strong>未连接</strong><small>不会显示虚构文件</small></article><article className="admin-metric"><span>产品资料来源</span><strong>Git</strong><small>版本化技术目录</small></article></section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><h2>公开资料入口</h2><p>这些入口与前台 Resources 页面使用同一份版本化内容。</p></div><Link href="/resources" target="_blank">查看前台</Link></div><div className="admin-resource-grid">{resourceSections.map((resource) => <article key={resource.id}><strong>{resource.title}</strong><p>{resource.text}</p><span>{resource.action}</span></article>)}</div></section>
    <section className="admin-panel"><h2>资料提供方式</h2><p className="admin-muted">请根据产品、工况和使用目的核对适用版本，再提供对应技术资料。</p></section>
  </AdminShell>;
}
