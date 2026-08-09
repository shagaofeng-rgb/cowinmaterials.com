import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileCheck2, Layers3, PackageCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { applicationPages, capabilityItems, evaluationSteps, getProductFamilyPath, getProductsForFamily, productFamilies, site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Materials, Insulation and Coating Systems | Cowin Materials",
  description: "Cowin Materials supplies silica aerogel powder, insulation blankets, thermal barrier materials and functional coating systems for industrial and construction applications.",
  path: "/",
  keywords: ["silica aerogel materials", "aerogel insulation coating", "aerogel fireproof coating", "battery thermal barrier materials"],
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Quzhou Qiying Import & Export Co., Ltd.</span>
            <h1>Aerogel materials for practical project evaluation</h1>
            <p>Technical material options for insulation, battery thermal control, fire-protection coatings and mineral-substrate waterproofing. Start with the operating conditions, then select the system.</p>
            <div className="hero-actions"><Link className="primary-button" href="/products">Browse products <ArrowRight size={18} aria-hidden="true" /></Link><Link className="secondary-button" href="/request-quote">Request a quote</Link></div>
            <p className="microcopy">Share temperature, substrate, available thickness and applicable standard to begin a technical review.</p>
          </div>
          <div className="hero-media"><Image src="/images/fire-test-lab.jpg" alt="Controlled aerogel coating thermal test setup" width={1280} height={860} priority /><div className="hero-media-caption"><span>Technical evaluation</span><strong>Material data, stated conditions and project fit</strong></div></div>
        </section>

        <section className="section proof-band"><div className="proof-strip">{capabilityItems.map((item) => <div className="proof-item" key={item}><PackageCheck size={20} aria-hidden="true" /><span>{item}</span></div>)}</div></section>

        <section className="section">
          <SectionHeading eyebrow="Product categories" title="Start with the material form" intro="Four documented categories help buyers compare individual grades and product forms without transferring data across systems." />
          <div className="product-family-grid home-family-grid">
            {productFamilies.map((family, index) => <article className="product-family-card" key={family.slug}><span className="family-index">{String(index + 1).padStart(2, "0")}</span><h2>{family.title}</h2><p>{family.description}</p><small>{getProductsForFamily(family.slug).map((product) => product.code).join(" · ")}</small><Link className="text-link" href={getProductFamilyPath(family)}>View category <ArrowRight size={16} aria-hidden="true" /></Link></article>)}
          </div>
          <div className="section-action"><Link className="secondary-button" href="/products">View all product families</Link></div>
        </section>

        <section className="section muted">
          <SectionHeading eyebrow="Applications" title="Navigate by project challenge" intro="Each application page begins with the conditions that determine whether a material route should be evaluated." />
          <div className="application-cards">
            {applicationPages.map((application) => <article className="application-card" key={application.slug}><Layers3 size={21} aria-hidden="true" /><h2>{application.shortTitle}</h2><p>{application.challenges.slice(0, 3).join(" · ")}</p><Link className="text-link" href={`/applications/${application.slug}`}>Explore solution <ArrowRight size={16} aria-hidden="true" /></Link></article>)}
          </div>
        </section>

        <section className="section technical-support-section">
          <div><SectionHeading eyebrow="Technical Support" title="Use data in the right project context" intro="Published values are tied to the named product form and stated test conditions. Request the applicable document set before a project decision." /><div className="evidence-list"><div><FileCheck2 size={20} aria-hidden="true" /><span>Product-specific TDS, SDS, installation guidance and available test information.</span></div><div><FileCheck2 size={20} aria-hidden="true" /><span>Selection support for substrate, service temperature, coating build and validation plan.</span></div></div></div>
          <aside className="qualification-panel"><span className="eyebrow">Resources</span><h2>Need technical documents?</h2><p>Tell us the product or project condition, and we will identify the applicable data scope and next evaluation step.</p><Link className="primary-button" href="/resources">View technical resources <ArrowRight size={18} aria-hidden="true" /></Link></aside>
        </section>

        <section className="section process-section"><SectionHeading eyebrow="Project Process" title="A practical route from conditions to evaluation" /><ol className="positioning-table">{evaluationSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol></section>

        <section className="section brand-proof-section muted"><div><SectionHeading eyebrow="Cowin Materials" title="Material systems presented with stated limits" intro="Cowin Materials supports international technical buyers with product information, application guidance, sample discussion and export documentation." />{site.legalRelationshipText ? <p className="relationship-note">{site.legalRelationshipText}</p> : null}</div><div className="about-evidence-panel"><span className="eyebrow">Evidence-led selection</span><h2>Clear product scope before project claims.</h2><p>Core pages identify the product form, technical evidence, conditions and limits relevant to an evaluation.</p><Link className="text-link" href="/about">About Cowin Materials <ArrowRight size={16} aria-hidden="true" /></Link></div></section>

        <section className="cta-section"><div><span className="eyebrow">Project review</span><h2>Bring us the conditions. We will help structure the material evaluation.</h2><p>Start with substrate, operating temperature, target performance and applicable standard.</p></div><div className="hero-actions"><Link className="primary-button" href="/request-quote">Request a quote <ArrowRight size={18} aria-hidden="true" /></Link><Link className="secondary-button" href="/contact">Contact our team</Link></div></section>
      </main>
      <Footer />
    </>
  );
}
