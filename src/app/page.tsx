import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ClipboardList, FileText, Layers3, Mail, MessagesSquare, PackageCheck, SearchCheck } from "lucide-react";
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

const applicationCardCopy: Record<string, { title: string; description: string }> = {
  "building-energy-retrofit": { title: "Building retrofit", description: "Energy efficiency for existing and new buildings" },
  "industrial-pipe-equipment-insulation": { title: "Industrial insulation", description: "Thermal management for process equipment and pipelines" },
  "ev-ess-thermal-barriers": { title: "EV & ESS barriers", description: "Thermal runaway mitigation and heat insulation" },
  "lng-cryogenic-insulation": { title: "LNG & cryogenic", description: "Insulation for low-temperature and cryogenic applications" },
  "steel-fire-protection": { title: "Steel fire protection", description: "Passive fire protection for structural steel" },
  "concrete-masonry-waterproofing": { title: "Concrete waterproofing", description: "Durable moisture control for infrastructure" },
};

const familyVisuals = [
  "/images/news/aerogel-insulation-editorial.jpg",
  "/images/home/industrial-insulation-editorial.jpg",
  "/images/fire-test-lab.jpg",
  "/images/waterproof-droplets.png",
];

const materialCardCopy: Record<string, { title: string; description: string }> = {
  "aerogel-powders-granules": { title: "Aerogel Powders & Granules", description: "For composites, coatings and advanced formulations" },
  "aerogel-blankets-felts-mats": { title: "Aerogel Blankets & Pads", description: "Flexible insulation for thermal and acoustic control" },
  "aerogel-slurries-coatings-paste": { title: "Aerogel Coatings & Paste", description: "Thin, conformal insulation and functional coatings" },
  "fireproof-waterproof-solutions": { title: "Fireproof & Waterproof Systems", description: "Integrated solutions for fire safety and moisture control" },
};

const resourceRoutes = [
  { title: "Technical Data Sheets", text: "Product-specific information", href: "/resources#tds", icon: FileText },
  { title: "Test conditions", text: "Data scope and review context", href: "/quality", icon: BadgeCheck },
  { title: "Application guides", text: "Design and project pathways", href: "/applications", icon: Layers3 },
  { title: "Project support", text: "Discuss technical conditions", href: "/contact", icon: Mail },
];

const pathwayIcons = [ClipboardList, SearchCheck, MessagesSquare, BadgeCheck, PackageCheck];

const pathwayCardCopy = [
  { title: "Define conditions", text: "Share operating environment and project requirements." },
  { title: "Get material route", text: "Receive a tailored material recommendation." },
  { title: "Technical consultation", text: "Discuss design, samples and integration." },
  { title: "Validation & trial", text: "Confirm the next evaluation step for your application." },
  { title: "Supply & scale", text: "Move from pilot evaluation to long-term supply." },
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
              <p>Engineered silica aerogel solutions for thermal insulation, fire protection and moisture control across global industries.</p>
              <div className="home-hero-rule" aria-hidden="true" />
              <p className="home-hero-note">Lower energy<br />Safer assets<br />A clearer material route</p>
            </div>
            <HomeRouteFinder />
          </div>
        </section>

        <section className="home-section home-application-section" aria-labelledby="application-navigator-title">
          <div className="home-template-heading">
            <div>
              <span className="eyebrow">Application navigator</span>
              <h2 id="application-navigator-title">Explore key applications</h2>
            </div>
            <p>Different environments. A common need for controlled material performance.</p>
            <Link className="home-template-action" href="/applications">View all applications <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="home-application-grid">
            {applicationPages.map((application) => {
              const visual = applicationVisuals[application.slug];
              const copy = applicationCardCopy[application.slug];
              return (
                <Link className="home-application-card" href={`/applications/${application.slug}`} key={application.slug}>
                  <Image src={visual.src} alt={visual.alt} fill loading="eager" sizes="(max-width: 720px) 100vw, (max-width: 1120px) 50vw, 33vw" />
                  <span className="home-application-shade" aria-hidden="true" />
                  <span className="home-application-content">
                    <strong>{copy.title}</strong>
                    <span>{copy.description}</span>
                    <ArrowRight className="home-application-arrow" size={22} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="home-section home-material-section" aria-labelledby="material-families-title">
          <div className="home-template-heading home-template-heading-compact">
            <div>
              <span className="eyebrow">Material families</span>
              <h2 id="material-families-title" className="home-visually-hidden">Our material families</h2>
            </div>
            <p>Four platforms. Multiple forms. Tailored to your application.</p>
            <Link className="home-template-action" href="/products">View all products <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
          <div className="home-material-list">
            {productFamilies.map((family, index) => {
              const preview = getProductFamilyPreview(family.slug);
              const productCodes = getProductsForFamily(family.slug).map((product) => product.code).join(" / ");
              const copy = materialCardCopy[family.slug];
              return (
                <article className="home-material-item" key={family.slug}>
                  <div className="home-material-image"><Image src={familyVisuals[index]} alt="" fill loading="eager" sizes="(max-width: 900px) 100vw, 18vw" /></div>
                  <div className="home-material-copy">
                    <h3>{copy.title}</h3>
                    <p>{copy.description}</p>
                    {preview ? <small>{productCodes}</small> : null}
                  </div>
                  <Link className="home-material-link" href={getProductFamilyPath(family)} aria-label={`View ${family.title}`}><ArrowRight size={19} aria-hidden="true" /></Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="home-section home-resource-section" aria-labelledby="evidence-title">
          <div className="home-template-heading home-template-heading-compact">
            <div><span className="eyebrow">Resources and evidence</span><h2 id="evidence-title" className="home-visually-hidden">Resources and evidence</h2></div>
          </div>
          <div className="home-resource-grid">
            {resourceRoutes.map((route) => {
              const Icon = route.icon;
              return <Link href={route.href} className="home-resource-card" key={route.title}><Icon size={25} aria-hidden="true" /><span><h3>{route.title}</h3><p>{route.text}</p></span><ArrowRight size={18} aria-hidden="true" /></Link>;
            })}
          </div>
        </section>

        <section className="home-section home-pathway-section" aria-labelledby="pathway-title">
          <div className="home-template-heading home-template-heading-compact">
            <span className="eyebrow">Project pathway</span>
            <h2 id="pathway-title" className="home-visually-hidden">Your project pathway</h2>
          </div>
          <ol className="home-pathway-list">
            {evaluationSteps.map((step, index) => {
              const Icon = pathwayIcons[index];
              const copy = pathwayCardCopy[index];
              return <li key={step.title}><Icon size={28} aria-hidden="true" /><div><span>{String(index + 1).padStart(2, "0")}</span><h3>{copy.title}</h3><p>{copy.text}</p></div></li>;
            })}
          </ol>
        </section>

        <section className="home-material-banner" aria-label="Cowin Materials project support">
          <Image src="/images/home/material-ridgeline-footer.jpg" alt="Blue mountain ridgeline used as a Cowin Materials project-support banner" fill loading="eager" sizes="100vw" />
          <div className="home-material-banner-content">
            <div className="home-material-banner-brand"><strong>Cowin</strong><span>Materials</span></div>
            <p>Material systems<br />for technical projects</p>
            <small>Insulate&nbsp;&nbsp;|&nbsp;&nbsp; Protect&nbsp;&nbsp;|&nbsp;&nbsp; Evaluate by project conditions</small>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
