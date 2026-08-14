import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminNotice, AdminShell } from "@/components/admin-shell";
import { AdminSyncStatus } from "@/components/admin-sync-status";
import { getAdminProduct } from "@/lib/admin-data";
import { getProductPath, productTechnicalProfiles } from "@/lib/data";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "产品详情 | Cowin Materials 后台", robots: { index: false, follow: false } };

export default async function AdminProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdminSession();
  const { slug } = await params;
  const product = getAdminProduct(slug);
  if (!product) notFound();
  const profile = productTechnicalProfiles[product.slug];
  const publicPath = getProductPath(product);

  return (
    <AdminShell title={product.name}>
      <div className="admin-page-actions"><Link href="/admin/products">返回产品列表</Link><Link className="admin-action-button" href={publicPath} target="_blank">官网预览</Link></div>
      <AdminNotice><strong>权威来源：</strong>Git 版本化技术资料。此页面用于核对官网资料、SEO 和数据边界；产品内容变更须经过代码审查与 Vercel 发布，避免产生影子数据源。</AdminNotice>
      <AdminSyncStatus status="Up to date" websiteHref={publicPath} label="官网发布状态" />
      <section className="admin-panel"><h2>基本信息</h2><dl className="admin-definition-list"><div><dt>型号 / SKU</dt><dd>{product.code}</dd></div><div><dt>分类</dt><dd>{product.category}</dd></div><div><dt>官网 URL</dt><dd>{publicPath}</dd></div><div><dt>状态</dt><dd><span className="admin-badge">已发布</span></dd></div><div><dt>简介</dt><dd>{product.summary}</dd></div></dl></section>
      <section className="admin-panel"><h2>官网展示与应用</h2><div className="admin-chip-list">{product.applications.map((item) => <span key={item}>{item}</span>)}</div><h3>关键卖点</h3><div className="admin-chip-list">{product.metrics.map((item) => <span key={item}>{item}</span>)}</div></section>
      <section className="admin-panel"><h2>SEO 与内容边界</h2><dl className="admin-definition-list"><div><dt>SEO 标题</dt><dd>{product.seoTitle}</dd></div><div><dt>SEO 描述</dt><dd>{product.seoDescription}</dd></div><div><dt>Canonical</dt><dd>{publicPath}</dd></div><div><dt>技术数据范围</dt><dd>{profile?.testScope || "请以对应产品资料与实际项目工况确认。"}</dd></div></dl></section>
      <section className="admin-panel"><h2>技术资料与关联</h2>{profile ? <><ul className="admin-check-list">{profile.sourceDocuments.map((item) => <li key={item}>{item}</li>)}</ul><h3>选择限制</h3><ul className="admin-check-list">{profile.selectionLimits.map((item) => <li key={item}>{item}</li>)}</ul></> : <p className="admin-muted">该产品尚无单独技术资料配置。</p>}</section>
    </AdminShell>
  );
}
