import Image from "next/image";
import { AlertTriangle, CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { advantageCards, proofItems } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Test Data and Technical Proof | Ruitai Jiuhe",
  description:
    "Review Ruitai Jiuhe aerogel coating test data, thermal conductivity, VOC, waterproofing report highlights, FTO notes and technical qualification boundaries.",
  path: "/technology",
  keywords: ["aerogel coating test data", "thermal conductivity aerogel coating", "aerogel FTO", "water repellent test report"],
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
            intro="Overseas buyers need more than slogans. This section turns existing reports, installation parameters and FTO notes into a clear technical proof layer."
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
            <Image src="/images/waterproof-report.png" alt="Water-repellent test report page preview" width={720} height={980} />
          </div>
        </section>

        <section className="section muted">
          <SectionHeading
            eyebrow="Material Platform"
            title="How the technology story should be framed"
            intro="The overseas site should connect ambient-pressure aerogel processing, composite formulation, application systems and IP risk boundaries."
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
            eyebrow="FTO Boundary"
            title="Make intellectual-property boundaries clear"
            intro="The FTO documents indicate low overall risk for the reviewed patent route, but battery-module structures and specialized encapsulation designs still need dedicated review before market entry."
          />
          <div className="risk-grid">
            <article>
              <ShieldCheck size={22} />
              <h2>Low-risk conclusion</h2>
              <p>The reviewed implementation route was assessed as low infringement risk against the selected comparison documents.</p>
            </article>
            <article>
              <FileCheck2 size={22} />
              <h2>Strongest route</h2>
              <p>Commodity silica powder modification and composite processes for building envelope and industrial pipe insulation.</p>
            </article>
            <article>
              <AlertTriangle size={22} />
              <h2>Use caution</h2>
              <p>Battery module support members, encapsulation layers, strict thickness deviation control and proprietary performance combinations.</p>
            </article>
            <article>
              <CheckCircle2 size={22} />
              <h2>Update before launch</h2>
              <p>Before entering the US, EU, Korea, battery storage or specialty marine markets, a market-specific FTO update is recommended.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
