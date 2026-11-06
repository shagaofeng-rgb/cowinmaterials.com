import { CircleHelp, ClipboardCheck, FileText, HardHat, ListFilter, ShieldCheck } from "lucide-react";
import { EvidenceTable, InteriorCTA, InteriorFaq, InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { commonFaqs, publicDataHighlights, resourceSections } from "@/lib/data";
import { quoteHref } from "@/lib/interior-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Technical Resources and Product Documentation | Cowin Materials", description: "Review Cowin Materials technical-data requests, safety-information scope, installation guidance and selected traceable material data.", path: "/resources", keywords: ["aerogel technical resources", "aerogel TDS", "aerogel SDS", "material application guide"] });

const documentIcons = {
  tds: FileText,
  sds: ShieldCheck,
  "test-data": ClipboardCheck,
  "installation-guides": HardHat,
  "selection-guide": ListFilter,
  faq: CircleHelp,
};

export default function ResourcesPage() {
  return (
    <InteriorPage>
      <InteriorHeading title="Technical resources" description="Find the technical data, safety information and installation guidance for the material you are evaluating." />
      <div className="cw-shell">
        <section aria-label="Document types" className="cw-resource-list">
          {resourceSections.map((resource) => {
            const Icon = documentIcons[resource.id as keyof typeof documentIcons] || FileText;
            return (
              <article className="cw-resource-row" id={resource.id} key={resource.id}>
                <Icon size={23} aria-hidden="true" />
                <div><h2>{resource.title}</h2><p>{resource.text}</p></div>
                <InteriorLink href={resource.id === "faq" ? "#documentation-faq" : quoteHref(resource.action)}>{resource.action}</InteriorLink>
              </article>
            );
          })}
        </section>
        <section className="cw-section cw-stack">
          <h2>Selected material data</h2>
          <p>These values apply to the named grade or tested sample. Review the complete document before using a result in a project specification.</p>
          <EvidenceTable caption="Selected product data and applicable conditions" columns={["Material", "Reported result", "Source and scope"]} rows={publicDataHighlights.map(({ label, value, scope }) => [label, value, scope])} />
        </section>
        <section className="cw-section cw-stack" id="documentation-faq">
          <h2>Documentation FAQ</h2>
          <InteriorFaq items={commonFaqs.map(([question, answer]) => [question, answer] as const)} />
        </section>
      </div>
      <InteriorCTA title="Request documents for a specific grade" description="Include the product name, project conditions and required standard." href={quoteHref("Request Technical Data")} label="Request technical data" />
    </InteriorPage>
  );
}
