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
