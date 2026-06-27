import Image from "next/image";
import { BadgeCheck, CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { advantageCards, proofItems } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Test Data and Technical Proof | Cowin Materials",
  description:
    "Review Cowin Materials aerogel coating test data, thermal conductivity, VOC, waterproofing report highlights and technical qualification information.",
  path: "/technology",
  keywords: ["aerogel coating test data", "thermal conductivity aerogel coating", "water repellent test report", "aerogel technical data"],
});

export default function TechnologyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Testing & Data"
            title="Technical Evidence for Early Supplier Qualification"
            intro="Global buyers need more than slogans. This section presents report highlights, installation parameters and application boundaries in a clear technical proof layer."
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
              eyebrow="Inspection Report"
              title="Building insulation coating data can be cited clearly"
              intro="Shanghai Jianke report XT226-250016 shows the thermal-radiation barrier mid-coat passed evaluation under GB/T 25261-2018 and DG/TJ08-2200-2024."
            />
            <div className="data-table">
              {[
                ["Thermal conductivity at 25C", "0.040 W/(m·K)"],
                ["Added thermal resistance", "0.26 m2·K/W"],
                ["Bond strength", "0.63 MPa"],
                ["Density", "0.5 g/mL"],
                ["Vertical emissivity", "0.99"],
                ["VOC content", "35 g/L"],
                ["Formaldehyde / benzene / heavy metals", "Not detected"],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="report-frame">
            <Image src="/images/waterproof-report.png" alt="Water-repellent test report page excerpt" width={720} height={980} />
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
              <h2>Report-based communication</h2>
              <p>Published values are presented with referenced report conditions and suitable application contexts.</p>
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
              <p>Technical data sheets, installation guidance and report highlights can be prepared for distributor and project review.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
