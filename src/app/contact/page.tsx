import { Mail, MapPin, Phone } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Request a Quote or Technical Information | Cowin Materials",
  description:
    "Contact Cowin Materials for product selection, technical documents, samples and quotations for aerogel and functional coating products.",
  path: "/contact",
  keywords: ["contact aerogel supplier", "request aerogel coating data sheet", "aerogel product selection"],
});

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Contact"
            title="Tell Us About Your Project"
            intro="Provide as much technical information as possible. This helps us identify the appropriate product, document or next evaluation step."
          />
        </section>

        <section className="section contact-layout">
          <div className="contact-panel">
            <h2>Global Project Contact</h2>
            <ul className="contact-list large">
              <li>
                <Phone size={18} />
                <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
              </li>
              <li>
                <Mail size={18} />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <MapPin size={18} />
                <span>{site.address}</span>
              </li>
            </ul>
            <div className="contact-note">
              <strong>Useful information to include</strong>
              <p>
                Application, substrate, temperature, target thickness, area, indoor/outdoor
                exposure, required test standard, delivery schedule and target market.
              </p>
            </div>
          </div>
          <InquiryForm />
        </section>
      </main>
      <Footer />
    </>
  );
}
