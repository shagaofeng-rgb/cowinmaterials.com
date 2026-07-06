import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileCheck2, Layers3, PackageCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { applicationPages, capabilityItems, evaluationSteps, productGroups, site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Materials, Insulation and Coating Systems | Cowin Materials",
  description:
    "Cowin Materials supplies silica aerogel powder, insulation blankets, thermal barrier materials and functional coating systems for industrial and construction applications.",
  path: "/",
  keywords: [
    "silica aerogel materials",
    "aerogel insulation coating",
    "aerogel fireproof coating",
    "battery thermal barrier materials",
  ],
});

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">AEROGEL MATERIALS & ENGINEERED COATING SYSTEMS</span>
            <h1>Silica Aerogel Materials and Coating Systems for Demanding Thermal, Fire and Waterproofing Applications</h1>
            <p>
              Cowin Materials supplies aerogel powder, insulation blankets, thermal
              barrier materials and functional coating systems for industrial equipment,
              building retrofit, fire protection and specialty applications.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/products">
                Explore Products
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button" href="/contact?request=Request%20a%20Quote">
                Submit Your Project
              </Link>
            </div>
            <p className="microcopy">
              Share your operating temperature, substrate, target thickness and required standard.
              Our team will help identify a suitable product or system.
            </p>
          </div>

          <div className="hero-media">
            <Image src="/images/fire-test-lab.jpg" alt="Aerogel coating test setup for thermal and fire performance evaluation" width={1280} height={860} priority />
          </div>
        </section>

        <section className="section band">
          <div className="proof-strip">
            {capabilityItems.map((item) => (
              <div className="proof-item" key={item}>
                <PackageCheck size={24} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="Product Families"
            title="Materials and Systems for Thermal Management, Fire Protection and Surface Performance"
            intro="Explore core product families for industrial insulation, building energy retrofit, battery thermal protection, steel fire protection and concrete waterproofing."
          />
          <div className="feature-grid">
            {productGroups.map((group) => (
              <Link className="feature-card" href={group.href} key={group.title}>
                <span>{group.title}</span>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
                <strong>{group.cta}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="section muted">
          <SectionHeading
            eyebrow="Applications"
            title="Choose a Solution by Application"
            intro="Product selection should be based on operating temperature, substrate, installation conditions, required thickness and applicable test standards."
          />
          <div className="application-cards">
            {applicationPages.map((item) => (
              <Link className="application-card" href={`/applications/${item.slug}`} key={item.slug}>
                <Layers3 size={22} />
                <h2>{item.shortTitle}</h2>
                <p>{item.intro}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="section split">
          <div>
            <SectionHeading
              eyebrow="Technical Context"
              title="Technical Data Must Be Evaluated in Context"
              intro="Thermal conductivity, adhesion, fire performance, water resistance and service temperature can vary with product grade, test method, sample thickness and operating conditions. Cowin Materials provides applicable technical documents and test information during product evaluation."
            />
            <div className="evidence-list">
              <div>
                <FileCheck2 size={20} />
                <span>Values are reviewed with applicable product grade and test conditions.</span>
              </div>
              <div>
                <BadgeCheck size={20} />
                <span>TDS, SDS, installation guidance and available test information can be requested.</span>
              </div>
            </div>
          </div>
          <div className="qualification-panel">
            <h2>Need documents for evaluation?</h2>
            <p>
              Tell us the product, substrate, operating temperature and required standard.
              We will identify the applicable document or next evaluation step.
            </p>
            <Link className="primary-button" href="/technical-resources">
              View Technical Resources
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="Evaluation Process"
            title="From Project Conditions to Product Evaluation"
          />
          <div className="positioning-table">
            {evaluationSteps.map((step) => (
              <div key={step.title}>
                <span>{step.title}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section split muted">
          <div>
            <SectionHeading
              eyebrow="About"
              title="About Cowin Materials"
              intro="Cowin Materials supplies silica aerogel materials, insulation products and functional coating systems for industrial and construction applications. We support product evaluation with technical information, application guidance, samples and export documentation."
            />
            {site.legalRelationshipText ? <p className="relationship-note">{site.legalRelationshipText}</p> : null}
            <Link className="secondary-button" href="/about">
              About Cowin Materials
            </Link>
          </div>
          <div className="image-stack">
            <Image src="/images/fire-char-layer.jpg" alt="Aerogel fire protection coating char layer after fire exposure" width={900} height={1180} />
            <Image src="/images/waterproof-droplets.png" alt="Water droplets on treated mineral substrate" width={720} height={980} />
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span className="eyebrow">Project Review</span>
            <h2>Have a thermal, fire protection or waterproofing project?</h2>
            <p>Send us your operating conditions, substrate information, target performance and required standards.</p>
          </div>
          <div className="hero-actions">
            <Link className="primary-button" href="/contact?request=Request%20a%20Quote">
              Submit Your Project
              <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href="/contact?request=Request%20a%20Sample">
              Request a Sample
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
