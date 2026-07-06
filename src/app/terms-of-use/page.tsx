import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Use | Cowin Materials",
  description: "Terms of use for the Cowin Materials website and technical information.",
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading eyebrow="Terms" title="Terms of Use" intro="Please review these terms before using the Cowin Materials website." />
        </section>
        <section className="section legal-copy">
          <h2>Website information</h2>
          <p>Product information is provided for initial business and technical evaluation. It is not a project guarantee or final specification.</p>
          <h2>Technical values</h2>
          <p>Technical values depend on product grade, test method, sample configuration and operating conditions. Confirm applicable documents before project use.</p>
          <h2>Intellectual property</h2>
          <p>Website text, images and materials belong to Cowin Materials or are used for Cowin Materials website communication. Do not reproduce them without permission.</p>
          <h2>Contact</h2>
          <p>For questions about these terms, contact {site.email}.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
