import Image from "next/image";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { constructionSystems } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Coating Installation Systems | Primer, Film Thickness and Curing Guidance",
  description:
    "Installation guidance for Ruitai Jiuhe aerogel insulation coatings, industrial coatings, fireproof coatings and penetrating water repellents.",
  path: "/construction",
  keywords: ["aerogel coating installation", "aerogel coating film thickness", "fireproof coating curing", "industrial insulation coating system"],
});

export default function ConstructionPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Installation"
            title="From Material Supply to Project-Ready Coating Systems"
            intro="Overseas B2B buyers need repeatable installation rules: substrate preparation, primer, coating thickness, topcoat, dew-point control and curing time."
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
