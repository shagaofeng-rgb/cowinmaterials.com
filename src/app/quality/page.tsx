import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Quality and Technical Documentation | Cowin Materials", description: "Learn how Cowin Materials presents applicable technical documentation and test-information scope for project evaluation.", path: "/quality", keywords: ["technical documentation", "material quality review", "aerogel test information"] });

export default function QualityPage() {
  return <><Header /><main><section className="page-hero compact"><SectionHeading level={1} eyebrow="Quality" title="Technical documentation in project context" intro="Published information is kept within its stated grade, sample configuration and test conditions. Project decisions require the applicable document set and evaluation plan." /></section><section className="section quality-grid"><article><FileCheck2 size={24} /><h2>Document review</h2><p>Request the technical data, safety information, installation guidance and available test information that apply to the named product form.</p></article><article><FileCheck2 size={24} /><h2>Scope before claims</h2><p>Values are not transferred between products, sample builds or project assemblies. Service conditions, substrate and standards remain part of the review.</p></article><article><FileCheck2 size={24} /><h2>Project validation</h2><p>Use representative samples and the applicable project method to confirm a material route before specification or installation.</p></article></section><section className="section muted"><div className="qualification-panel"><h2>Technical documentation available upon request</h2><p>No certificates, ratings or test conclusions are displayed here unless the corresponding product, method, configuration and scope can be verified.</p><Link className="primary-button" href="/request-quote?request=Request%20Technical%20Data">Request technical data <ArrowRight size={18} /></Link></div></section></main><Footer /></>;
}
