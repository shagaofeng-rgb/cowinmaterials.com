import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductFilter } from "@/components/product-filter";
import { getProductFamily } from "@/lib/data";
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

  return (
    <>
      <Header />
      <main>
        <div className="detail-breadcrumb-wrap"><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Products", href: "/products" }, { label: family.title }]} /></div>
        <section className="page-hero compact"><div className="section-heading"><span className="eyebrow">Product category</span><h1>{family.title}</h1><p>{family.description} Review the named product and supporting documentation before applying any value to a project.</p></div></section>
        <section className="section"><ProductFilter familySlug={family.slug} includeFamilyOverview={false} /></section>
      </main>
      <Footer />
    </>
  );
}
