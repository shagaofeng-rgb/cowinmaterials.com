import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { applicationPages, applicationTechnicalProfiles, getProductPath, products } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Application Solutions | Cowin Materials",
  description:
    "Explore Cowin Materials aerogel applications for building retrofit, industrial insulation, EV and ESS thermal barriers, LNG insulation, steel fire protection and concrete waterproofing.",
  path: "/applications",
  keywords: ["aerogel applications", "industrial aerogel insulation", "building insulation coating", "battery thermal barrier"],
});

export default function ApplicationsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            level={1}
            eyebrow="Applications"
            title="Start with the engineering conditions"
            intro="Each solution path identifies the project challenge, material families to consider and the conditions needed for a responsible evaluation."
          />
        </section>
        <section className="section">
          <div className="application-cards">
            {applicationPages.map((item) => {
              const profile = applicationTechnicalProfiles[item.slug];
              const productRoutes = products.filter((product) => profile?.recommendedProductSlugs.includes(product.slug));
              return (
              <article className="application-card" key={item.slug}>
                <Layers3 size={22} aria-hidden="true" />
                <h2>{item.shortTitle}</h2>
                <p>{item.challenges.slice(0, 3).join(" · ")}</p>
                <div className="application-card-routes"><strong>Relevant products</strong>{productRoutes.map((product) => <Link href={getProductPath(product)} key={product.slug}>{product.code}</Link>)}</div>
                <small className="application-card-requirements">Start with: {item.requiredInfo.slice(0, 2).join(" · ")}</small>
                <span className="text-link">
                  <Link href={`/applications/${item.slug}`}>Explore solution</Link>
                  <ArrowRight size={16} />
                </span>
              </article>
            )})}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
