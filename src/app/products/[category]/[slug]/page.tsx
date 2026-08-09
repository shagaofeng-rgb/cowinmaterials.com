import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DetailPageNav } from "@/components/detail-page-nav";
import { applicationPages, getProductFamily, getProductPath, productTechnicalProfiles, products } from "@/lib/data";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

type ProductPageProps = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return products.flatMap((product) => {
    const path = getProductPath(product).split("/").filter(Boolean);
    return path.length === 3 ? [{ category: path[1], slug: path[2] }] : [];
  });
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const family = getProductFamily(category);
  const product = products.find((item) => item.slug === slug && family?.productSlugs.includes(item.slug));
  if (!product) return createPageMetadata({ title: "Aerogel Product Not Found | Cowin Materials", description: "The requested aerogel product profile was not found.", path: "/products", index: false });
  return createPageMetadata({ title: `${product.seoTitle} | Cowin Materials`, description: product.seoDescription, path: getProductPath(product), keywords: [product.name, family!.title, product.code, "silica aerogel materials"] });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const family = getProductFamily(category);
  const product = products.find((item) => item.slug === slug && family?.productSlugs.includes(item.slug));
  const profile = product ? productTechnicalProfiles[product.slug] : undefined;
  if (!product || !profile || !family) notFound();

  const relatedApplications = applicationPages.filter((item) => profile.relatedApplicationSlugs.includes(item.slug));
  const productUrl = getProductPath(product);
  const productJsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.name, sku: profile.model, category: family.title, description: product.seoDescription, ...(product.image ? { image: absoluteUrl(product.image) } : {}), brand: { "@type": "Brand", name: "Cowin Materials" }, additionalProperty: profile.facts.map((fact) => ({ "@type": "PropertyValue", name: fact.label, value: fact.value, description: fact.scope })) };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") }, { "@type": "ListItem", position: 3, name: family.title, item: absoluteUrl(`/products/${family.slug}`) }, { "@type": "ListItem", position: 4, name: product.name, item: absoluteUrl(productUrl) }] };

  return <><Header /><main>
    <div className="detail-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: family.title, href: `/products/${family.slug}` }, { label: product.name }]} /></div>
    <section className="product-hero"><div className="product-hero-copy"><Link className="back-link" href={`/products/${family.slug}`}><ArrowLeft size={16} />Back to category</Link><span className="product-code">{profile.model}</span><h1>{product.name}</h1><p>{product.summary}</p><div className="hero-actions"><Link className="primary-button" href={`/request-quote?request=Request%20Technical%20Data&product=${encodeURIComponent(product.name)}`}>Request technical data<ArrowRight size={18} /></Link><Link className="secondary-button" href={`/request-quote?request=Request%20a%20Sample&product=${encodeURIComponent(product.name)}`}>Request a sample</Link></div></div><div className="product-visual" aria-label={`${product.name} technical summary`}>{product.image ? <Image src={product.image} alt={product.imageAlt || product.name} width={1100} height={760} priority /> : <div className="technical-visual"><span>{family.title}</span><strong>{profile.model}</strong><p>Material profile for project evaluation</p><div className="technical-visual-facts">{profile.facts.slice(0, 2).map((fact) => <div key={fact.label}><small>{fact.label}</small><b>{fact.value}</b></div>)}</div></div>}</div></section>
    <DetailPageNav items={[{ href: "#overview", label: "Overview" }, { href: "#specifications", label: "Specifications" }, { href: "#handling", label: "Handling & limits" }, { href: "#faq", label: "FAQ" }]} />
    <section className="section product-detail-grid" id="overview"><article><h2>Overview</h2>{profile.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</article><article><h2>Applications</h2><div className="chip-row">{product.applications.map((item) => <span className="chip" key={item}>{item}</span>)}</div></article><article><h2>Last reviewed</h2><p>{profile.lastReviewed}</p><p className="proof-note">Information is presented for technical evaluation, not as a project guarantee.</p></article></section>
    <section className="section muted" id="specifications"><div className="data-scope-heading"><span className="eyebrow">Technical evidence</span><h2>Key specifications</h2><p>{profile.testScope}</p></div><div className="technical-fact-grid">{profile.facts.map((fact) => <article key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong><p>{fact.scope}</p></article>)}</div></section>
    <section className="section product-detail-grid" id="handling"><article><h2>Handling / storage</h2><ul className="metric-list">{profile.handling.map((item) => <li key={item}><CheckCircle2 size={16} /><span>{item}</span></li>)}</ul></article><article><h2>Selection limits</h2><ul className="metric-list">{profile.selectionLimits.map((item) => <li key={item}><CheckCircle2 size={16} /><span>{item}</span></li>)}</ul></article><article><h2>Source documents</h2><ul className="metric-list">{profile.sourceDocuments.map((item) => <li key={item}><FileText size={16} /><span>{item}</span></li>)}</ul><Link className="text-link" href={`/request-quote?request=Request%20Technical%20Data&product=${encodeURIComponent(product.name)}`}>Request applicable documentation<ArrowRight size={16} /></Link></article></section>
    <section className="section muted"><h2>Related applications</h2><div className="chip-row">{relatedApplications.map((item) => <Link className="chip" href={`/applications/${item.slug}`} key={item.slug}>{item.shortTitle}</Link>)}</div></section>
    <section className="section" id="faq"><h2>Product FAQ</h2><div className="faq-list">{profile.faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section>
    <section className="cta-section"><div><span className="eyebrow">Technical review</span><h2>Need a match for your substrate, temperature or test standard?</h2></div><Link className="primary-button" href="/request-quote">Request a quote<ArrowRight size={18} /></Link></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
  </main><Footer /></>;
}
