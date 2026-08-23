import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductFilter } from "@/components/product-filter";
import { getProductFamily } from "@/lib/data";
import { getProductFamilyPreview } from "@/lib/product-family-content";
import { createPageMetadata } from "@/lib/seo";

type CategoryPageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return ["aerogel-powders-granules", "aerogel-blankets-felts-mats", "aerogel-slurries-coatings-paste", "fireproof-waterproof-solutions"].map((category) => ({ category }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const family = getProductFamily(category);
  if (!family) return createPageMetadata({ title: "Product Category Not Found | Cowin Materials", description: "The requested product category was not found.", path: "/products", index: false });
  return createPageMetadata({ title: `${family.title} | Cowin Materials`, description: family.description, path: `/products/${family.slug}`, keywords: [family.title, "silica aerogel materials", "technical product data"] });
}

export default async function ProductCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const family = getProductFamily(category);
  if (!family) notFound();
  const preview = getProductFamilyPreview(family.slug);

  return (
    <>
      <Header />
      <main>
        <div className="detail-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: family.title }]} /></div>
        <section className="page-hero compact"><div className="section-heading"><span className="eyebrow">Product category</span><h1>{family.title}</h1><p>{family.description} Review the named product and supporting documentation before applying any value to a project.</p></div></section>
        {preview ? <section className="section family-evaluation-section"><div className="family-evaluation-heading"><h2>What to confirm before selecting a grade</h2><p>{preview.sourceNote}</p></div><dl className="family-evaluation-facts">{preview.highlights.map((highlight) => <div key={highlight.label}><dt>{highlight.label}</dt><dd>{highlight.value}</dd></div>)}</dl></section> : null}
        {preview?.comparison ? <section className="section muted family-comparison-section"><div className="family-evaluation-heading"><h2>{preview.comparison.title}</h2><p>{preview.comparison.intro}</p></div><div className="family-comparison-table" role="region" aria-label={preview.comparison.title} tabIndex={0}><table><thead><tr><th scope="col">Evaluation point</th><th scope="col">CW-AT-H</th><th scope="col">CW-AT-L</th><th scope="col">Data scope</th></tr></thead><tbody>{preview.comparison.rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th><td>{row.highTemperature}</td><td>{row.cryogenic}</td><td>{row.scope}</td></tr>)}</tbody></table></div></section> : null}
        <section className="section"><ProductFilter familySlug={family.slug} includeFamilyOverview={false} /></section>
      </main>
      <Footer />
    </>
  );
}
