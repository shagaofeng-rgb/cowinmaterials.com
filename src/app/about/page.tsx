import Link from "next/link";
import { ArrowRight, FileCheck2, Globe2, Layers3, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { evaluationSteps, site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

const aboutModules = [
  {
    icon: Layers3,
    title: "Product portfolio",
    text: "Aerogel powder and slurry, flexible aerogel insulation, building and industrial insulation coatings, battery thermal barrier materials, fire protection coatings and penetrating water-repellent systems.",
  },
  {
    icon: FileCheck2,
    title: "Quality and document control",
    text: "Applicable technical information, safety documents, installation guidance and available test information can be provided during product evaluation.",
  },
  {
    icon: ShieldCheck,
    title: "Product evaluation process",
    text: "Product selection is based on operating conditions, substrate, target performance and applicable standards.",
  },
  {
    icon: Globe2,
    title: "Export support",
    text: "Packaging confirmation, shipping documents and commercial communication can be coordinated for international orders.",
  },
];

export const metadata = createPageMetadata({
  title: "About Cowin Materials | Silica Aerogel Material Systems",
  description:
    "Learn about Cowin Materials, an international materials brand operated by Quzhou Qiying Import & Export Co., Ltd. for aerogel materials and functional coating systems.",
  path: "/about",
  keywords: ["about Cowin Materials", "silica aerogel supplier", "functional coating systems"],
});

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="About"
            title="About Cowin Materials"
            intro="Cowin Materials supplies silica aerogel materials, insulation products, thermal barrier materials and functional coating systems for industrial and construction applications."
          />
        </section>

        <section className="section split">
          <div>
            <h2>Brand and company relationship</h2>
            <p>{site.legalRelationshipText}</p>
            <p>
              Our product portfolio includes aerogel powder and slurry, flexible aerogel
              insulation, building and industrial insulation coatings, battery thermal
              barrier materials, fire protection coatings and penetrating water-repellent systems.
            </p>
            <p>
              We support product evaluation by providing applicable technical information,
              samples, application guidance and export documentation.
            </p>
          </div>
          <div className="qualification-panel">
            <h2>Contact information</h2>
            <p>Email: {site.email}</p>
            <p>Phone: {site.phone}</p>
            <p>Country / Region: China</p>
          </div>
        </section>

        <section className="section muted">
          <div className="advantage-grid">
            {aboutModules.map((item) => {
              const Icon = item.icon;
              return (
                <article className="advantage-card" key={item.title}>
                  <Icon size={22} />
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section">
          <SectionHeading eyebrow="Process" title="Product Evaluation Process" />
          <div className="positioning-table">
            {evaluationSteps.map((step) => (
              <div key={step.title}>
                <span>{step.title}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span className="eyebrow">Contact</span>
            <h2>Send your project conditions for product evaluation support.</h2>
          </div>
          <Link className="primary-button" href="/contact">
            Contact Cowin Materials
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
