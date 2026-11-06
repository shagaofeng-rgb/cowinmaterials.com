import { InquiryForm } from "@/components/inquiry-form";
import { InteriorHeading, InteriorPage } from "@/components/interior";
import { ContactDetails } from "@/components/interior-contact";
import { OfficeMap } from "@/components/office-map";
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
    <InteriorPage>
      <InteriorHeading title="Contact Cowin Materials" crumbs={[{ label: "Contact" }]} description="Talk to us about material selection, technical documents, samples or quotations." />
      <div className="cw-shell cw-contact-layout">
        <ContactDetails title="Project contact" />
        <section className="cw-contact-form" aria-labelledby="enquiry-heading">
          <h2 id="enquiry-heading">Send a project enquiry</h2>
          <InquiryForm />
        </section>
      </div>
      <div className="cw-shell cw-section"><OfficeMap /></div>
    </InteriorPage>
  );
}
