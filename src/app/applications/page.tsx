import Link from "next/link";
import { ArrowRight, Layers3 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { applicationPages } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Application Solutions | Cowin Materials",
  description:
    "Explore Cowin Materials aerogel applications for building retrofit, industrial insulation, EV and ESS thermal barriers, LNG insulation, steel fire protection and concrete waterproofing.",
  path: "/applications",
  keywords: ["aerogel applications", "industrial aerogel insulation", "building insulation coating", "battery thermal barrier"],
});

export default function ApplicationsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            level={1}
            eyebrow="Applications"
            title="Choose Aerogel Materials by Application"
            intro="Start with the project condition, then evaluate product grade, thickness, substrate compatibility and applicable technical documents."
          />
        </section>
        <section className="section">
          <div className="application-cards">
            {applicationPages.map((item) => (
              <Link className="application-card" href={`/applications/${item.slug}`} key={item.slug}>
                <Layers3 size={22} />
                <h2>{item.shortTitle}</h2>
                <p>{item.intro}</p>
                <span className="text-link">
                  View Application
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
