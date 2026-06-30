import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ProductFilter } from "@/components/product-filter";
import { SectionHeading } from "@/components/section-heading";
import { productListJsonLd, createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Silica Aerogel Products | Insulation Coatings, Fireproof Coatings, Blankets and Water Repellent",
  description:
    "Browse Cowin Materials silica aerogel powder, aerogel blankets, thermal pads, insulation coatings, fireproof coatings, penetrating water repellents and aerogel paste.",
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
            eyebrow="Products"
            title="Silica Aerogel Product Portfolio"
            intro="Filter by material form and engineering use. Each product profile gives overseas buyers a concise view of fit, performance and typical applications."
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
