import { InteriorCTA, InteriorHeading, InteriorLink, InteriorPage, ProcessList, ScopeNote } from "@/components/interior";
import { quoteHref } from "@/lib/interior-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Quality and Technical Documentation | Cowin Materials", description: "Learn how Cowin Materials presents applicable technical documentation and test-information scope for project evaluation.", path: "/quality", keywords: ["technical documentation", "material quality review", "aerogel test information"] });

const reviewSteps = [
  { title: "Identify the grade and documents", text: "Request the technical data, safety information, installation guidance and available test information that apply to the named product form." },
  { title: "Check the sample and test scope", text: "Values are not transferred between products, sample builds or project assemblies. Service conditions, substrate and standards remain part of the review." },
  { title: "Verify against the project requirements", text: "Use representative samples and the applicable project method to confirm a material route before specification or installation." },
];

export default function QualityPage() {
  return (
    <InteriorPage>
      <InteriorHeading title="Quality and technical documentation" crumbs={[{ label: "Quality" }]} description="Review the applicable grade, sample configuration and test conditions before specifying a material." />
      <div className="cw-shell cw-pair cw-section">
        <section className="cw-stack">
          <h2>Material evaluation</h2>
          <ProcessList steps={reviewSteps} />
        </section>
        <aside className="cw-side-note cw-stack">
          <h2>Technical references</h2>
          <InteriorLink href="/resources#tds">Technical data sheets</InteriorLink>
          <InteriorLink href="/resources#test-data">Test information</InteriorLink>
          <InteriorLink href="/resources#installation-guides">Installation guides</InteriorLink>
          <ScopeNote>A material-level result does not establish compliance for a different grade, substrate or project assembly.</ScopeNote>
        </aside>
      </div>
      <InteriorCTA title="Review your material specification" href={quoteHref("Request Technical Data")} label="Request technical data" />
    </InteriorPage>
  );
}
