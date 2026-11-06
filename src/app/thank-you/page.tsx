import { CircleCheck } from "lucide-react";
import { InteriorLink, InteriorPage } from "@/components/interior";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Thank You | Cowin Materials", description: "Your enquiry has been submitted to Cowin Materials.", path: "/thank-you", index: false });

export default function ThankYouPage() {
  return (
    <InteriorPage>
      <section className="cw-shell cw-message">
        <CircleCheck size={32} aria-hidden="true" />
        <h1>Thank you for your enquiry</h1>
        <p>Our team will review your product and project conditions before responding.</p>
        <div className="cw-actions"><InteriorLink href="/products" variant="primary">Browse products</InteriorLink><InteriorLink href="/resources" variant="secondary">Technical resources</InteriorLink></div>
      </section>
    </InteriorPage>
  );
}
