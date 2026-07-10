import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Project References | Cowin Materials",
  description:
    "Selected Cowin Materials project information is available during technical and commercial evaluation when sufficient project details can be shared.",
  path: "/case-studies",
  keywords: ["aerogel project references", "aerogel coating applications", "Cowin Materials case studies"],
});

export default function CaseStudiesPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            level={1}
            eyebrow="Case Studies"
            title="Project References"
            intro="Selected project information is available during technical and commercial evaluation. Contact us with your application requirements."
          />
        </section>
        <section className="section">
          <div className="qualification-panel">
            <h2>No public case studies are displayed without confirmed project permission.</h2>
            <p>
              Cowin Materials does not publish customer names, project locations, photos,
              energy-saving results or performance claims unless they are verified and
              cleared for public use.
            </p>
            <Link className="primary-button" href="/contact?request=Ask%20for%20Product%20Selection">
              Discuss Your Application
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
