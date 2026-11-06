import { FileCheck2, Globe2, Layers3, ShieldCheck } from "lucide-react";
import { InteriorCTA, InteriorHeading, InteriorLink, InteriorPage, ProcessList } from "@/components/interior";
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
    <InteriorPage>
      <InteriorHeading title="About Cowin Materials" crumbs={[{ label: "About" }]} description="Silica aerogel materials, thermal barriers and functional coatings for industrial and construction projects." />
      <div className="cw-shell">
        <div className="cw-pair cw-section">
          <section className="cw-stack">
            <h2>Material selection and project support</h2>
            <p>We support product evaluation with applicable technical information, samples, application guidance and export documentation.</p>
            <div className="cw-inline-links"><InteriorLink href="/products">Browse products</InteriorLink><InteriorLink href="/applications">Explore applications</InteriorLink></div>
          </section>
          <section className="cw-side-note cw-stack">
            <h2>Brand and operating company</h2>
            <p>{site.legalRelationshipText}</p>
            <div className="cw-inline-links">
              <InteriorLink href="/locations">Quzhou office</InteriorLink>
              <a className="cw-text-link" href={site.whatsappUrl} target="_blank" rel="noopener noreferrer" data-analytics-whatsapp-placement="about_phone">WhatsApp {site.phone}</a>
            </div>
          </section>
        </div>
        <section className="cw-section cw-stack">
          <h2>Product and commercial support</h2>
          <div className="cw-capabilities">
            {aboutModules.map(({ icon: Icon, title, text }) => <div key={title}><Icon size={22} aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></div>)}
          </div>
        </section>
        <section className="cw-section cw-stack">
          <h2>Product evaluation process</h2>
          <ProcessList steps={evaluationSteps} />
        </section>
      </div>
      <InteriorCTA title="Discuss your project conditions" href="/contact" label="Contact Cowin Materials" />
    </InteriorPage>
  );
}
