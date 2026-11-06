import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy | Cowin Materials",
  description: "Privacy policy for Cowin Materials website enquiries and business communication.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy explains how Cowin Materials handles information submitted through this website."
      sections={[
        { id: "information-we-collect", label: "Information we collect", body: <><p>When you submit an enquiry, we may collect your name, company, business email, phone, country or region, project information and uploaded project files.</p></> },
        { id: "how-we-use-information", label: "How we use information", body: <><p>We use submitted information to respond to enquiries, recommend products, provide technical documents, prepare quotations and coordinate business communication.</p></> },
        { id: "contact-entry-measurement", label: "Contact-entry measurement", body: <><p>To understand website use and which pages generate contact interest, we record public page paths, event times, referral domains, campaign parameters and a pseudonymous first-party visitor identifier stored in browser local storage. A session identifier is renewed after 30 minutes without activity. Our hosting provider may provide a country-level location code for aggregate traffic reporting; we do not add a raw IP address to these analytics events. When a visitor selects the WhatsApp contact link, we also record its fixed entry placement. These events do not include WhatsApp account details, message content or enquiry text.</p>
          <p>If you submit an enquiry, the current pseudonymous visitor identifier may be linked to that business enquiry inside our protected administration system so that we can understand the pages and product information connected to the request. This information is not exposed on public pages.</p></> },
        { id: "sharing", label: "Sharing", body: <><p>Our Contact and Locations pages offer an optional Google map. It does not connect to Google until you choose to load the map or open the Google Maps link. Google may receive your IP address and browser information under its <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</p>
          <p>We do not sell enquiry information. Information may be shared with service providers only when needed to operate email, hosting or business communication systems.</p></> },
        { id: "contact", label: "Contact", body: <><p>For privacy questions, contact <a href={`mailto:${site.email}`}>{site.email}</a>.</p></> },
      ]}
    />
  );
}
