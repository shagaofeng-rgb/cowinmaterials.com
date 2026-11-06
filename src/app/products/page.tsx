import { InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { Pagination } from "@/components/pagination";
import { ProductCatalog, ProductFamilyCards } from "@/components/product-catalog";
import { notFound } from "next/navigation";
import { products } from "@/lib/data";
import { productListJsonLd, createPageMetadata } from "@/lib/seo";

type ProductsPageProps = { searchParams: Promise<{ page?: string }> };
const pageSize = 6;
const pageCount = Math.ceil(products.length / pageSize);

function validPage(value?: string) {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) notFound();
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page > pageCount) notFound();
  return page;
}

export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const page = validPage((await searchParams).page);
  return createPageMetadata({
    title: page > 1 ? `Aerogel Products - Page ${page} | Cowin Materials` : "Aerogel Products and Functional Coating Systems | Cowin Materials",
    description: "Explore aerogel powder, blankets, insulation coatings, battery thermal barriers, fire protection coatings and waterproofing materials from Cowin Materials.",
    path: page > 1 ? `/products?page=${page}` : "/products",
    keywords: ["silica aerogel products", "aerogel coating supplier", "aerogel blanket", "aerogel thermal pad"],
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = validPage((await searchParams).page);
  const offset = (page - 1) * pageSize;
  const entries = products.slice(offset, offset + pageSize);
  return (
    <InteriorPage>
      <InteriorHeading
        title="Aerogel products"
        crumbs={[{ label: "Products" }]}
        description="Silica aerogel materials and functional coatings by product form."
        action={<InteriorLink href="/applications">Browse applications</InteriorLink>}
      />
      <div className="cw-shell cw-catalog">
        <ProductFamilyCards />
        <section id="product-selection" aria-labelledby="product-grades">
          <div className="cw-section-heading">
            <h2 id="product-grades">All product grades</h2>
            <span className="cw-muted">{offset + 1}-{offset + entries.length} of {products.length} products</span>
          </div>
          <ProductCatalog products={entries} />
          <Pagination currentPage={page} totalItems={products.length} pageSize={pageSize} pathname="/products" label="Products" />
        </section>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }} />
    </InteriorPage>
  );
}
