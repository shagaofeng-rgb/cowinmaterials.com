import Image from "next/image";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { constructionSystems } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Coating Application Systems | Cowin Materials",
  description:
    "Application system overview for Cowin Materials aerogel insulation coatings, fireproof coatings and penetrating water repellents.",
  path: "/construction",
  keywords: ["aerogel coating application", "aerogel coating system", "fireproof coating system", "industrial insulation coating"],
});

export default function ConstructionPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Application Systems"
            title="Clear Coating Systems Without Overloading the Page"
            intro="A simple overview of how each product is normally used. Detailed method statements can be prepared after the project substrate, climate and standard are confirmed."
          />
        </section>

        <section className="section">
          <div className="system-grid">
            {constructionSystems.map((system, index) => (
              <article className="system-card" key={system.code}>
                <div className="system-image">
                  <Image src={system.image} alt={system.title} width={900} height={620} priority={index === 0} />
                </div>
                <div className="system-content">
                  <span className="product-code">{system.code}</span>
                  <h2>{system.title}</h2>
                  <ol className="step-list">
                    {system.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <div className="chip-row">
                    {system.parameters.map((parameter) => (
                      <span className="chip" key={parameter}>
                        {parameter}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
