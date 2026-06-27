import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, FileCheck2, Layers3, ShieldCheck } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { applications, proofItems, products, site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Silica Aerogel Insulation Coating, Fireproof Coating and Water Repellent | Cowin Materials",
  description:
    "Cowin Materials supplies silica aerogel insulation coatings, fireproof coatings, aerogel blankets, EV battery thermal barriers and penetrating water repellents for global B2B projects.",
  path: "/",
  keywords: [
    "silica aerogel insulation coating",
    "aerogel fireproof coating",
    "penetrating water repellent",
    "aerogel blanket supplier",
  ],
});

export default function Home() {
  const featuredProducts = products.filter((product) =>
    ["CW-AC-01/02", "CW-FTHL", "CW-WP-01", "CW-AT-H / CW-AT-L"].includes(product.code),
  );

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Silica Aerogel Material Systems</span>
            <h1>Advanced Aerogel Coatings and Insulation Materials for Global Engineering Projects</h1>
            <p>
              {site.legalName} supplies silica aerogel materials for thermal insulation,
              steel fire protection, penetrating waterproofing and battery thermal barriers.
              The portfolio is built for buyers who need technical data, installation guidance
              and project-ready material systems.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" href="/products">
                Explore Product Lines
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button" href="/technology">
                Review Test Data
              </Link>
            </div>
          </div>

          <div className="hero-media">
            <Image src="/images/fire-test-lab.jpg" alt="Aerogel coating thermal and fire test setup" width={1280} height={860} priority />
            <div className="hero-stat">
              <strong>0.040</strong>
              <span>W/(m·K) tested conductivity for building aerogel insulation coating</span>
            </div>
          </div>
        </section>

        <section className="section band">
          <div className="proof-strip">
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

        <section className="section">
          <SectionHeading
            eyebrow="Product Platform"
            title="A portfolio built around one aerogel core"
            intro="Cowin Materials is positioned as a practical aerogel system supplier: powder, slurry, blankets, thermal pads, coatings, fire protection and penetrating waterproofing."
          />
          <div className="feature-grid">
            {featuredProducts.map((product) => (
              <Link className="feature-card" href={`/products/${product.slug}`} key={product.code}>
                <span>{product.category}</span>
                <h2>{product.name}</h2>
                <p>{product.summary}</p>
                <strong>{product.code}</strong>
              </Link>
            ))}
          </div>
        </section>

        <section className="section muted">
          <SectionHeading
            eyebrow="Application Pathways"
            title="Let overseas buyers enter by use case"
            intro="The site architecture follows how engineers buy materials: substrate, temperature, geometry, fire rating, waterproofing problem and certification risk."
          />
          <div className="application-cards">
            {applications.slice(0, 6).map((item) => {
              const Icon = item.icon;
              return (
                <Link className="application-card" href={`/applications#${item.id}`} key={item.id}>
                  <Icon size={22} />
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="section split">
          <div>
            <SectionHeading
              eyebrow="Why Cowin Materials"
              title="A different position from Cabot, Aspen and JIOS"
              intro="Cabot is strong in aerogel particles, Aspen is strong in battery and blanket systems, and JIOS has a strong East Asian thermal-management supply chain. Cowin Materials should win overseas with system delivery, local engineering cost advantages and documented installation data."
            />
            <div className="evidence-list">
              <div>
                <Layers3 size={20} />
                <span>Powder, blankets, coatings, fire protection and water-repellent systems</span>
              </div>
              <div>
                <FileCheck2 size={20} />
                <span>Thermal, VOC, waterproofing and FTO documents available for qualification</span>
              </div>
              <div>
                <ShieldCheck size={20} />
                <span>Claims written with testing boundaries and market-entry risk in mind</span>
              </div>
              <div>
                <BadgeCheck size={20} />
                <span>Installation books define film thickness, dosage, curing and substrate preparation</span>
              </div>
            </div>
          </div>
          <div className="image-stack">
            <Image src="/images/fire-char-layer.jpg" alt="Expanded char layer from intumescent aerogel fireproof coating" width={900} height={1180} />
            <Image src="/images/waterproof-droplets.png" alt="Water droplets on silicon penetrating water repellent treated substrate" width={720} height={980} />
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span className="eyebrow">Technical Inquiry</span>
            <h2>Send your substrate, temperature, target thickness or fire rating for a first recommendation.</h2>
          </div>
          <Link className="primary-button" href="/contact">
            Request Technical Data
            <ArrowRight size={18} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
