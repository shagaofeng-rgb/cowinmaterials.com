import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DetailPageNav } from "@/components/detail-page-nav";
import { applicationPages, applicationTechnicalProfiles, getProductPath, products } from "@/lib/data";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

type ApplicationPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return applicationPages.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: ApplicationPageProps) {
  const { slug } = await params;
  const page = applicationPages.find((item) => item.slug === slug);
  if (!page) return createPageMetadata({ title: "Application Not Found | Cowin Materials", description: "The requested application page was not found.", path: "/applications", index: false });
  return createPageMetadata({ title: `${page.shortTitle} Solutions | Cowin Materials`, description: page.intro, path: `/applications/${page.slug}`, keywords: [page.shortTitle, "aerogel application", "Cowin Materials"] });
}

export default async function ApplicationDetailPage({ params }: ApplicationPageProps) {
  const { slug } = await params;
  const page = applicationPages.find((item) => item.slug === slug);
  const profile = page ? applicationTechnicalProfiles[page.slug] : undefined;
  if (!page || !profile) notFound();
  const recommendedProducts = products.filter((item) => profile.recommendedProductSlugs.includes(item.slug));
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Applications", item: absoluteUrl("/applications") },
      { "@type": "ListItem", position: 3, name: page.shortTitle, item: absoluteUrl(`/applications/${page.slug}`) },
    ],
  };

  return <><Header /><main>
    <div className="detail-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Applications", href: "/applications" }, { label: page.shortTitle }]} /></div>
    <section className="product-hero">
      <div className="product-hero-copy"><span className="eyebrow">Application Guide</span><h1>{page.title}</h1><p>{page.intro}</p><div className="hero-actions"><Link className="primary-button" href={`/request-quote?application=${encodeURIComponent(page.shortTitle)}`}>Request a project review<ArrowRight size={18} /></Link><Link className="secondary-button" href="/resources">View resources</Link></div></div>
      <div className="product-visual" aria-label={`${page.shortTitle} project context`}>
        {page.image ? <Image src={page.image} alt={`${page.shortTitle} material evaluation`} width={1100} height={760} priority /> : <div className="technical-visual"><span>Application</span><strong>{page.shortTitle}</strong><p>Selection begins with actual project conditions.</p><div className="technical-visual-facts">{profile.evidence.slice(0, 2).map((fact) => <div key={fact.label}><small>{fact.label}</small><b>{fact.value}</b></div>)}</div></div>}
      </div>
    </section>
    <DetailPageNav items={[{ href: "#conditions", label: "Project conditions" }, { href: "#technical-data", label: "Technical data" }, { href: "#systems", label: "Systems & limits" }, { href: "#faq", label: "FAQ" }]} />
    <section className="section product-detail-grid" id="conditions"><article><h2>Project Challenge</h2><p>{profile.projectChallenge}</p></article><article><h2>Information to Collect</h2><ul className="metric-list">{page.requiredInfo.map((item) => <li key={item}><CheckCircle2 size={16} /><span>{item}</span></li>)}</ul></article><article><h2>Last Reviewed</h2><p>{profile.lastReviewed}</p><p className="proof-note">Selection remains subject to the complete system and project validation.</p></article></section>
    <section className="section muted" id="technical-data"><div className="data-scope-heading"><span className="eyebrow">Evidence and Scope</span><h2>Applicable Technical Data</h2><p>Listed values are specific to the stated source and are not transferred between products, assemblies or field conditions.</p></div><div className="technical-fact-grid">{profile.evidence.map((fact) => <article key={fact.label}><span>{fact.label}</span><strong>{fact.value}</strong><p>{fact.scope}</p></article>)}</div></section>
    <section className="section product-detail-grid" id="systems"><article><h2>Suitable Products</h2><div className="chip-row">{recommendedProducts.map((product) => <Link className="chip" key={product.slug} href={getProductPath(product)}>{product.name}</Link>)}</div></article><article><h2>System Limits</h2><ul className="metric-list">{profile.systemLimits.map((item) => <li key={item}><CheckCircle2 size={16} /><span>{item}</span></li>)}</ul></article><article><h2>Verification Steps</h2><ol className="step-list">{profile.validationSteps.map((item) => <li key={item}>{item}</li>)}</ol></article></section>
    <section className="section muted"><div className="qualification-panel"><FileText size={22} /><h2>Documentation and project review</h2><p>Request the technical document set for the selected product grade, then verify it against the substrate, test method, system build and operating conditions.</p><Link className="text-link" href={`/request-quote?request=Request%20Technical%20Data&application=${encodeURIComponent(page.shortTitle)}`}>Request applicable documentation<ArrowRight size={16} /></Link></div></section>
    <section className="section" id="faq"><h2>Application FAQ</h2><div className="faq-list">{profile.faq.map(([question, answer]) => <article key={question}><h3>{question}</h3><p>{answer}</p></article>)}</div></section>
    <section className="cta-section"><div><span className="eyebrow">Technical Review</span><h2>Share the operating conditions before selecting a system.</h2></div><Link className="primary-button" href="/contact">Send Project Details<ArrowRight size={18} /></Link></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
  </main><Footer /></>;
}
