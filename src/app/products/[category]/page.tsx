import Link from "next/link";
import { notFound } from "next/navigation";
import { EvidenceTable, InteriorCTA, InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { CategoryNavigation, ProductCatalog } from "@/components/product-catalog";
import { MaterialIcon } from "@/components/material-icons";
import { getProductFamily, getProductPath, getProductsForFamily, productFamilies, products } from "@/lib/data";
import { getProductFamilyPreview } from "@/lib/product-family-content";
import { quoteHref } from "@/lib/interior-content";
import { createPageMetadata } from "@/lib/seo";

type CategoryPageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return productFamilies.map(({ slug }) => ({ category: slug }));
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
  const grades = getProductsForFamily(family.slug);
  const powder = products.find((product) => product.slug === "aerogel-powder-and-slurry");
  const fireAndWater = category === "fireproof-waterproof-solutions";

  return (
    <InteriorPage>
      <InteriorHeading
        title={family.title}
        description={family.description}
        crumbs={[{ label: "Products", href: "/products" }, { label: family.title }]}
        action={<InteriorLink href="/products">All product categories</InteriorLink>}
      />
      <div className="cw-shell">
        <CategoryNavigation selected={family.slug} />
        <div className="cw-category-layout">
          {fireAndWater ? <>
            <section>
              <div className="cw-section-heading"><h2><MaterialIcon name="fire" size={21} /> Structural steel fire protection</h2></div>
              <ProductCatalog products={grades.filter((product) => product.category === "Fire Protection Coatings")} />
            </section>
            <section>
              <div className="cw-section-heading"><h2><MaterialIcon name="water" size={21} /> Mineral-substrate water repellents</h2></div>
              <ProductCatalog products={grades.filter((product) => product.category === "Waterproofing")} />
            </section>
          </> : <section>
            <div className="cw-section-heading"><h2>Product grades</h2></div>
            <ProductCatalog products={grades} />
            {category === "aerogel-slurries-coatings-paste" && powder && <p>For pre-dispersed raw material, see <Link className="cw-inline" href={getProductPath(powder)}>CW-AP-W waterborne slurry</Link>.</p>}
          </section>}
          {preview?.comparison ? <section>
            <h2>{preview.comparison.title}</h2>
            <p>{preview.comparison.intro}</p>
            <EvidenceTable caption={preview.comparison.title} columns={["Evaluation point", "CW-AT-H", "CW-AT-L", "Data scope"]} rows={preview.comparison.rows.map((row) => [row.label, row.highTemperature, row.cryogenic, row.scope])} />
          </section> : preview ? <section>
            <h2>Grade-specific reference data</h2>
            <p>{preview.sourceNote}</p>
            <EvidenceTable caption="Grade-specific reference data" columns={["Property", "Reported value"]} rows={preview.highlights.map(({ label, value }) => [label, value])} />
          </section> : null}
        </div>
      </div>
      <InteriorCTA title="Review a grade for your application" description="Share the operating conditions and required technical documents." href={quoteHref("Ask for Product Selection")} label="Request a product review" />
    </InteriorPage>
  );
}
