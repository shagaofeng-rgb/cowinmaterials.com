import Link from "next/link";
import { ArrowRight, FileCheck2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { commonFaqs, resourceSections } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Technical Resources and Product Documentation | Cowin Materials",
  description:
    "Access Cowin Materials product data sheets, safety information, installation guidance and available test information for aerogel and functional coating products.",
  path: "/technical-resources",
  keywords: ["aerogel technical resources", "aerogel TDS", "aerogel SDS", "aerogel installation guide"],
});

export default function TechnicalResourcesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Technical Resources"
            title="Technical Resources and Product Documentation"
            intro="Access product data sheets, safety information, installation guidance and available test information. Document availability may vary by product grade and project requirement."
          />
        </section>

        <section className="section">
          <div className="resource-grid">
            {resourceSections.map((resource) => (
              <article className="resource-card" id={resource.id} key={resource.id}>
                <FileCheck2 size={22} />
                <span>{resource.title}</span>
                <h2>{resource.title}</h2>
                <p>{resource.text}</p>
                <Link className="text-link" href={`/contact?request=${encodeURIComponent(resource.action)}`}>
                  {resource.action}
                  <ArrowRight size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section muted">
          <div className="qualification-panel">
            <h2>Technical values need context</h2>
            <p>
              Technical values are based on the applicable product grade and test
              conditions. They should not be used as a project guarantee without reviewing
              the complete test method, sample configuration and operating conditions.
            </p>
          </div>
        </section>

        <section className="section">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
          <div className="faq-list">
            {commonFaqs.map(([question, answer]) => (
              <article key={question}>
                <h2>{question}</h2>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
