import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, FlaskConical, Layers3, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HomeRouteFinder } from "@/components/home-route-finder";
import { applicationPages, evaluationSteps, getProductFamilyPath, getProductsForFamily, productFamilies } from "@/lib/data";
import { getProductFamilyPreview } from "@/lib/product-family-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Materials, Insulation and Coating Systems | Cowin Materials",
  description: "Cowin Materials supplies silica aerogel powder, insulation blankets, thermal barrier materials and functional coating systems for industrial and construction applications.",
  path: "/",
  keywords: ["silica aerogel materials", "aerogel insulation coating", "aerogel fireproof coating", "battery thermal barrier materials"],
});

const applicationVisuals: Record<string, { src: string; alt: string }> = {
  "building-energy-retrofit": {
    src: "/images/home/building-retrofit-editorial.jpg",
    alt: "Building-envelope retrofit context with layered facade materials",
  },
  "industrial-pipe-equipment-insulation": {
    src: "/images/home/industrial-insulation-editorial.jpg",
    alt: "Insulated industrial pipe and valve assembly",
  },
  "ev-ess-thermal-barriers": {
    src: "/images/home/ev-ess-thermal-barrier-editorial.jpg",
    alt: "Battery-module engineering context with a thin thermal barrier layer",
  },
  "lng-cryogenic-insulation": {
    src: "/images/home/lng-cryogenic-editorial.jpg",
    alt: "Cryogenic pipework and insulated valve assembly",
  },
  "steel-fire-protection": {
    src: "/images/fire-char-layer.jpg",
    alt: "Coating char layer from a controlled steel fire-protection test",
  },
  "concrete-masonry-waterproofing": {
    src: "/images/waterproof-droplets.png",
    alt: "Water droplets on a treated mineral substrate",
  },
};

const familyVisuals = [
  "/images/news/aerogel-insulation-editorial.jpg",
  "/images/home/industrial-insulation-editorial.jpg",
  "/images/fire-test-lab.jpg",
  "/images/waterproof-droplets.png",
];

const resourceRoutes = [
  { title: "Technical data", text: "Request the document set that applies to a named grade and evaluation stage.", href: "/resources", icon: FileText },
  { title: "Data scope", text: "Read how product values, test conditions and project limits are presented.", href: "/quality", icon: ShieldCheck },
  { title: "Application guides", text: "Start with the engineering conditions that shape a material route.", href: "/applications", icon: Layers3 },
  { title: "Material evaluation", text: "Compare product families before moving to a sample or supply discussion.", href: "/products", icon: FlaskConical },
];

export default function Home() {
  return (
    <>
      <Header />
      <main className="home-navigator">
        <section className="home-hero">
          <div className="home-hero-media" aria-hidden="true">
            <Image src="/images/fire-test-lab.jpg" alt="" fill priority sizes="100vw" />
          </div>
          <div className="home-hero-shell">
            <div className="home-hero-copy">
              <span className="eyebrow">Silica aerogel material systems</span>
              <h1>Specify by condition. Select by material.</h1>
              <p>Product routes for thermal insulation, battery barriers, steel fire-protection evaluation and mineral-substrate waterproofing.</p>
              <div className="home-hero-links">
                <Link className="home-hero-primary" href="/request-quote?request=Ask%20for%20Product%20Selection">Discuss project conditions <ArrowRight size={18} aria-hidden="true" /></Link>
                <Link className="home-hero-secondary" href="/applications">Explore applications</Link>
              </div>
              <p className="home-hero-note">Begin with service temperature, substrate, available thickness and the relevant specification or validation plan.</p>
            </div>
            <HomeRouteFinder />
          </div>
        </section>

        <section className="home-section home-application-section" aria-labelledby="application-navigator-title">
          <div className="home-section-heading home-section-heading-split">
            <div>
              <span className="eyebrow">Application navigator</span>
              <h2 id="application-navigator-title">Start with the project challenge</h2>
            </div>
            <p>Each route connects the engineering context with the relevant material families, conditions to collect and evaluation boundaries.</p>
          </div>
          <div className="home-application-grid">
            {applicationPages.map((application) => {
              const visual = applicationVisuals[application.slug];
              return (
                <Link className="home-application-card" href={`/applications/${application.slug}`} key={application.slug}>
                  <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw" />
                  <span className="home-application-shade" aria-hidden="true" />
                  <span className="home-application-content">
                    <small>{application.challenges.slice(0, 2).join(" / ")}</small>
                    <strong>{application.shortTitle}</strong>
                    <span>Review application route <ArrowRight size={16} aria-hidden="true" /></span>
                  </span>
                </Link>
              );
            })}
          </div>
          <div className="home-section-action"><Link className="home-text-action" href="/applications">View all application routes <ArrowRight size={16} aria-hidden="true" /></Link></div>
        </section>

        <section className="home-section home-material-section" aria-labelledby="material-families-title">
          <div className="home-section-heading home-section-heading-split">
            <div>
              <span className="eyebrow">Material families</span>
              <h2 id="material-families-title">Compare documented product forms</h2>
            </div>
            <p>Product pages keep reported data tied to the named grade, stated method and intended application context.</p>
          </div>
          <div className="home-material-list">
            {productFamilies.map((family, index) => {
              const preview = getProductFamilyPreview(family.slug);
              const productCodes = getProductsForFamily(family.slug).map((product) => product.code).join(" / ");
              return (
                <article className="home-material-item" key={family.slug}>
                  <div className="home-material-image"><Image src={familyVisuals[index]} alt="" fill sizes="(max-width: 900px) 100vw, 18vw" /></div>
                  <div className="home-material-copy">
                    <span>{productCodes}</span>
                    <h3>{family.title}</h3>
                    <p>{family.intent}</p>
                    {preview ? <small>{preview.highlights.map((highlight) => `${highlight.label}: ${highlight.value}`).join(" | ")}</small> : null}
                  </div>
                  <Link className="home-material-link" href={getProductFamilyPath(family)} aria-label={`View ${family.title}`}><ArrowRight size={19} aria-hidden="true" /></Link>
                </article>
              );
            })}
          </div>
          <p className="home-data-boundary">Published figures remain product- and condition-specific. Confirm the complete method, configuration and operating conditions before project use.</p>
        </section>

        <section className="home-section home-resource-section" aria-labelledby="evidence-title">
          <div className="home-resource-intro">
            <span className="eyebrow">Resources and evidence</span>
            <h2 id="evidence-title">Information for a controlled material review</h2>
            <p>Use product-specific documents, application guidance and available test information in the context of the project decision.</p>
            <Link className="home-text-action" href="/resources">Open technical resources <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="home-resource-grid">
            {resourceRoutes.map((route) => {
              const Icon = route.icon;
              return <Link href={route.href} className="home-resource-card" key={route.title}><Icon size={22} aria-hidden="true" /><h3>{route.title}</h3><p>{route.text}</p><span>Open <ArrowRight size={15} aria-hidden="true" /></span></Link>;
            })}
          </div>
        </section>

        <section className="home-section home-pathway-section" aria-labelledby="pathway-title">
          <div className="home-section-heading">
            <span className="eyebrow">Project pathway</span>
            <h2 id="pathway-title">From conditions to a material evaluation</h2>
          </div>
          <ol className="home-pathway-list">
            {evaluationSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.text}</p></div></li>)}
          </ol>
        </section>

        <section className="home-final-cta">
          <div>
            <span className="eyebrow">Start a project review</span>
            <h2>Bring the conditions. We will help structure the next material decision.</h2>
          </div>
          <div className="home-final-actions">
            <Link className="home-hero-primary" href="/request-quote">Request a quote <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="home-hero-secondary" href="/contact">Contact Cowin Materials</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
