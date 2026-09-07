import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductFilter } from "@/components/product-filter";
import { SectionHeading } from "@/components/section-heading";
import { productListJsonLd, createPageMetadata } from "@/lib/seo";

type ProductsPageProps = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: ProductsPageProps) {
  const page = Math.max(1, Number((await searchParams).page) || 1);
  return createPageMetadata({
    title: page > 1 ? `Aerogel Products - Page ${page} | Cowin Materials` : "Aerogel Products and Functional Coating Systems | Cowin Materials",
    description: "Explore aerogel powder, blankets, insulation coatings, battery thermal barriers, fire protection coatings and waterproofing materials from Cowin Materials.",
    path: page > 1 ? `/products?page=${page}` : "/products",
    keywords: ["silica aerogel products", "aerogel coating supplier", "aerogel blanket", "aerogel thermal pad"],
  });
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const page = Number((await searchParams).page) || 1;
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            level={1}
            eyebrow="Products"
            title="Explore aerogel material categories"
            intro="Start with a product form, then review the named grade, its documented scope and the conditions that matter for your application."
          />
        </section>
        <section className="section">
          <ProductFilter page={page} />
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }} />
      </main>
      <Footer />
    </>
  );
}
