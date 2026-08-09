import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductFilter } from "@/components/product-filter";
import { SectionHeading } from "@/components/section-heading";
import { productListJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Products and Functional Coating Systems | Cowin Materials",
  description:
    "Explore aerogel powder, blankets, insulation coatings, battery thermal barriers, fire protection coatings and waterproofing materials from Cowin Materials.",
  path: "/products",
  keywords: ["silica aerogel products", "aerogel coating supplier", "aerogel blanket", "aerogel thermal pad"],
});

export default function ProductsPage() {
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
          <ProductFilter />
        </section>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productListJsonLd) }} />
      </main>
      <Footer />
    </>
  );
}
