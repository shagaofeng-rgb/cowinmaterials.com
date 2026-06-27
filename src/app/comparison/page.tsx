import Link from "next/link";
import { ArrowRight, BadgeCheck, FileCheck2, Globe2, Layers3, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { createPageMetadata } from "@/lib/seo";

const strengths = [
  {
    icon: Layers3,
    label: "Integrated product platform",
    title: "From raw aerogel materials to applied systems",
    text: "Cowin Materials supports powder, slurry, blankets, thermal pads, insulation coatings, fire protection coatings and penetrating water repellents.",
  },
  {
    icon: FileCheck2,
    label: "Qualification support",
    title: "Technical data for early supplier screening",
    text: "Report highlights, product parameters and installation guidance help buyers compare material fit before sampling or project testing.",
  },
  {
    icon: ShieldCheck,
    label: "Project-ready documentation",
    title: "Clear boundaries for standards and applications",
    text: "Performance information is presented with test conditions, recommended use cases and project-specific confirmation requirements.",
  },
];

const buyerNeeds = [
  {
    need: "Thin thermal insulation",
    title: "Coatings and blankets for limited-space construction",
    support: "Waterborne aerogel coatings and flexible blankets help reduce insulation thickness where conventional materials are difficult to install.",
  },
  {
    need: "Steel fire protection",
    title: "Coating systems with installation parameters",
    support: "Intumescent and non-intumescent options support steel structure projects that require defined application and curing guidance.",
  },
  {
    need: "Concrete or masonry waterproofing",
    title: "Penetrating treatment for porous substrates",
    support: "Silicon-based water repellent systems protect concrete, stone, mortar and masonry while keeping mineral substrates breathable.",
  },
  {
    need: "EV or ESS thermal barriers",
    title: "Thin aerogel components for thermal management",
    support: "Aerogel pads and compounds can support module-level thermal-management assemblies in battery and energy storage applications.",
  },
];

export const metadata = createPageMetadata({
  title: "Why Cowin Materials | Silica Aerogel System Supplier",
  description:
    "Learn why global buyers choose Cowin Materials for silica aerogel insulation coatings, fireproof coatings, aerogel blankets, thermal pads and water-repellent systems.",
  path: "/comparison",
  keywords: ["silica aerogel supplier", "aerogel coating manufacturer", "China aerogel material supplier", "aerogel insulation systems"],
});

export default function ComparisonPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Why Cowin Materials"
            title="A Practical Aerogel System Supplier for Global Projects"
            intro="Cowin Materials helps importers, distributors, contractors and engineering teams evaluate silica aerogel products with application-focused guidance and clear technical documentation."
          />
        </section>

        <section className="section">
          <div className="strength-grid">
            {strengths.map((item) => {
              const Icon = item.icon;
              return (
                <article className="strength-card" key={item.title}>
                  <Icon size={22} />
                  <span>{item.label}</span>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section muted">
          <SectionHeading
            eyebrow="Buyer Fit"
            title="Built around how technical buyers select materials"
            intro="The website and product documentation are organized around project conditions instead of only product names, making supplier evaluation faster for overseas buyers."
          />
          <div className="positioning-table">
            {buyerNeeds.map((item) => (
              <div key={item.need}>
                <span>{item.need}</span>
                <strong>{item.title}</strong>
                <p>{item.support}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section split">
          <div>
            <SectionHeading
              eyebrow="Supply Support"
              title="Product selection, sampling and project discussion"
              intro="Cowin Materials can provide product recommendations based on substrate, operating temperature, target thickness, fire rating, waterproofing requirement, application method and local standard needs."
            />
            <div className="evidence-list">
              <div>
                <BadgeCheck size={20} />
                <span>Application-first product selection for buildings, industry, batteries, LNG and waterproofing</span>
              </div>
              <div>
                <FileCheck2 size={20} />
                <span>Technical data sheets, report highlights and construction guidance for buyer review</span>
              </div>
              <div>
                <Globe2 size={20} />
                <span>Export-oriented communication for distributors, contractors and project owners</span>
              </div>
            </div>
          </div>
          <div className="contact-panel">
            <h2>Send a project condition for selection support.</h2>
            <p>
              Include the substrate, temperature range, target thickness, area, exposure
              condition and required standard so the team can recommend a suitable product route.
            </p>
            <Link className="primary-button" href="/contact">
              Request Support
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
