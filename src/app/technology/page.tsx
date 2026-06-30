import { BadgeCheck, CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { advantageCards, proofItems } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Performance Data | Cowin Materials",
  description:
    "Review concise performance highlights for Cowin Materials aerogel insulation coatings, fireproof coatings and penetrating water-repellent systems.",
  path: "/technology",
  keywords: ["aerogel coating performance data", "thermal conductivity aerogel coating", "water repellent data", "aerogel technical data"],
});

export default function TechnologyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Performance Data"
            title="Concise Technical Highlights for Supplier Qualification"
            intro="Global buyers can review the key performance indicators first, then request full data sheets and supporting documents for project qualification."
          />
        </section>

        <section className="section">
          <div className="proof-strip standalone">
            {proofItems.map((item) => (
              <div className="proof-item" key={item.label}>
                <strong>
                  {item.value}
                  {item.unit ? <small>{item.unit}</small> : null}
                </strong>
                <span>{item.label}</span>
                <em>{item.note}</em>
              </div>
            ))}
          </div>
        </section>

        <section className="section split">
          <div>
            <SectionHeading
              eyebrow="Key Indicators"
              title="Performance highlights for fast technical screening"
              intro="The values below are presented as quick screening references. Detailed documents can be provided during distributor, contractor or project review."
            />
            <div className="data-table">
              {[
                ["Thermal conductivity at 25C", "0.040 W/(m·K)"],
                ["Added thermal resistance", "0.26 m2·K/W"],
                ["Bond strength", "0.63 MPa"],
                ["Density", "0.5 g/mL"],
                ["VOC content", "Low-VOC waterborne system"],
                ["Water-repellent result", "Low absorption and 0 mm permeability"],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="qualification-panel">
            <h2>Documents available on request</h2>
            <p>
              Supporting reports, data sheets and application guidance are shared during
              project evaluation so buyers receive the right file for the target
              product, substrate and local standard.
            </p>
            <ul>
              <li>Thermal insulation coating data</li>
              <li>Water-repellent performance highlights</li>
              <li>Fire protection coating qualification notes</li>
              <li>Installation and curing guidance</li>
            </ul>
          </div>
        </section>

        <section className="section muted">
          <SectionHeading
            eyebrow="Material Platform"
            title="How the material platform supports project qualification"
            intro="Cowin Materials connects aerogel raw materials, composite formulation, application systems and documentation support for practical supplier evaluation."
          />
          <div className="advantage-grid">
            {advantageCards.map((item) => {
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
          <SectionHeading
            eyebrow="Qualification Notes"
            title="Clear technical boundaries for project use"
            intro="Final product selection depends on substrate condition, service temperature, target thickness, exposure environment, application method and applicable local standards."
          />
          <div className="qualification-grid">
            <article>
              <ShieldCheck size={22} />
              <h2>Data-based communication</h2>
              <p>Published values are presented with clear conditions and suitable application contexts.</p>
            </article>
            <article>
              <FileCheck2 size={22} />
              <h2>Strongest application routes</h2>
              <p>Building envelope retrofit, industrial pipe insulation, steel fire protection and porous substrate waterproofing.</p>
            </article>
            <article>
              <BadgeCheck size={22} />
              <h2>Project confirmation</h2>
              <p>Fire ratings, thermal targets and durability requirements are confirmed according to project specifications and local standards.</p>
            </article>
            <article>
              <CheckCircle2 size={22} />
              <h2>Documentation support</h2>
              <p>Technical data sheets, installation guidance and supporting documents can be prepared for distributor and project review.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
