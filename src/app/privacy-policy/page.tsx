import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy | Cowin Materials",
  description: "Privacy policy for Cowin Materials website enquiries and business communication.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading level={1} eyebrow="Privacy" title="Privacy Policy" intro="This policy explains how Cowin Materials handles information submitted through this website." />
        </section>
        <section className="section legal-copy">
          <h2>Information we collect</h2>
          <p>When you submit an enquiry, we may collect your name, company, business email, phone, country or region, project information and uploaded project files.</p>
          <h2>How we use information</h2>
          <p>We use submitted information to respond to enquiries, recommend products, provide technical documents, prepare quotations and coordinate business communication.</p>
          <h2>Contact-entry measurement</h2>
          <p>To understand website use and which pages generate contact interest, we record public page paths, event times and a pseudonymous first-party visitor identifier stored in browser local storage. A session identifier is renewed after 30 minutes without activity. When a visitor selects the WhatsApp contact link, we also record its fixed entry placement. These events do not include WhatsApp account details, message content or enquiry text.</p>
          <p>If you submit an enquiry, the current pseudonymous visitor identifier may be linked to that business enquiry inside our protected administration system so that we can understand the pages and product information connected to the request. This information is not exposed on public pages.</p>
          <h2>Sharing</h2>
          <p>We do not sell enquiry information. Information may be shared with service providers only when needed to operate email, hosting or business communication systems.</p>
          <h2>Contact</h2>
          <p>For privacy questions, contact {site.email}.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
