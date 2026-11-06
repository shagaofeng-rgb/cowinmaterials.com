import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Terms of Use | Cowin Materials",
  description: "Terms of use for the Cowin Materials website and technical information.",
  path: "/terms-of-use",
});

export default function TermsOfUsePage() {
  return (
    <LegalPage
      title="Terms of Use"
      description="Please review these terms before using the Cowin Materials website."
      sections={[
        { id: "website-information", label: "Website information", body: <><p>Product information is provided for initial business and technical evaluation. It is not a project guarantee or final specification.</p></> },
        { id: "technical-values", label: "Technical values", body: <><p>Technical values depend on product grade, test method, sample configuration and operating conditions. Confirm applicable documents before project use.</p></> },
        { id: "intellectual-property", label: "Intellectual property", body: <><p>Website text, images and materials belong to Cowin Materials or are used for Cowin Materials website communication. Do not reproduce them without permission.</p></> },
        { id: "contact", label: "Contact", body: <><p>For questions about these terms, contact <a href={`mailto:${site.email}`}>{site.email}</a>.</p></> },
      ]}
    />
  );
}
