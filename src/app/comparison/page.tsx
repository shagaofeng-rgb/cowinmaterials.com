import { ArrowRight, ExternalLink } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { competitors } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

const sources = [
  { label: "Cabot ENOVA aerogel particles", href: "https://www.cabotcorp.com/solutions/products-plus/aerogel/particles" },
  { label: "Aspen Aerogels PyroThin", href: "https://www.aerogel.com/product/pyrothin/" },
  { label: "JIOS Aerogel", href: "https://www.jiosaerogel.com/" },
];

export const metadata = createPageMetadata({
  title: "Aerogel Competitor Benchmark | Cabot, Aspen Aerogels, JIOS and Ruitai Jiuhe",
  description:
    "A practical overseas positioning benchmark comparing Cabot, Aspen Aerogels, JIOS and Ruitai Jiuhe across aerogel particles, blankets, EV thermal barriers and coating systems.",
  path: "/comparison",
  keywords: ["Cabot aerogel competitor", "Aspen Aerogels alternative", "JIOS Aerogel comparison", "China aerogel supplier"],
});

export default function ComparisonPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Competitive Benchmark"
            title="How Ruitai Jiuhe Should Position Against Cabot, Aspen and JIOS"
            intro="The overseas site should not copy a single leader. It should use competitor context to make Ruitai Jiuhe easier to understand, evaluate and contact."
          />
        </section>

        <section className="section">
          <div className="competitor-grid">
            {competitors.map((competitor) => (
              <article className="competitor-card" key={competitor.name}>
                <span>{competitor.position}</span>
                <h2>{competitor.name}</h2>
                <p>{competitor.focus}</p>
                <ul>
                  {competitor.strengths.map((strength) => (
                    <li key={strength}>
                      <ArrowRight size={15} />
                      {strength}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section muted">
          <SectionHeading
            eyebrow="Positioning Strategy"
            title="A more credible export story"
            intro="Ruitai Jiuhe should lead with system-level engineering, not only raw material supply. This is more convincing for global distributors, contractors and industrial buyers."
          />
          <div className="positioning-table">
            <div>
              <span>Cabot-like strength</span>
              <strong>Powder and particle technology</strong>
              <p>Keep the raw-material story, but connect it to coatings and project systems.</p>
            </div>
            <div>
              <span>Aspen-like strength</span>
              <strong>Application-specific product families</strong>
              <p>Use application pathways for battery, LNG and industrial insulation qualification.</p>
            </div>
            <div>
              <span>JIOS-like strength</span>
              <strong>Thermal-management supply chain</strong>
              <p>Show flexibility for East Asian and international engineered aerogel components.</p>
            </div>
            <div>
              <span>Ruitai Jiuhe angle</span>
              <strong>Aerogel engineering material systems</strong>
              <p>Combine coatings, construction guidance, third-party data and project-level support.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <SectionHeading eyebrow="Reference Sources" title="Public competitor pages reviewed" />
          <div className="source-links">
            {sources.map((source) => (
              <a href={source.href} key={source.href} target="_blank" rel="noreferrer">
                {source.label}
                <ExternalLink size={16} />
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
