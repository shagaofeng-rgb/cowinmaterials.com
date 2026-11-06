import { InteriorCTA, InteriorHeading, InteriorLink, InteriorPage, ProcessList } from "@/components/interior";
import { evaluationSteps } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Project References | Cowin Materials",
  description:
    "Selected Cowin Materials project information is available during technical and commercial evaluation when sufficient project details can be shared.",
  path: "/case-studies",
  keywords: ["aerogel project references", "aerogel coating applications", "Cowin Materials case studies"],
  index: false,
});

export default function CaseStudiesPage() {
  return (
    <InteriorPage>
      <InteriorHeading title="Technical references and project evaluation" crumbs={[{ label: "Technical references" }]} description="Project-specific references can be discussed when their documentation and disclosure scope are clear." />
      <div className="cw-shell cw-pair cw-section">
        <section className="cw-stack"><h2>Evaluate a material for your project</h2><ProcessList steps={evaluationSteps.slice(0, 4)} /></section>
        <aside className="cw-side-note cw-stack">
          <h2>Available references</h2>
          <p>Customer names, project locations, photos and results are shared only when verified and cleared for public use.</p>
          <InteriorLink href="/applications">Find an application</InteriorLink>
          <InteriorLink href="/resources">Explore technical resources</InteriorLink>
        </aside>
      </div>
      <InteriorCTA title="Review your application" href="/contact?request=Ask%20for%20Product%20Selection" label="Discuss your application" />
    </InteriorPage>
  );
}
