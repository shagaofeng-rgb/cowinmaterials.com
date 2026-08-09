import Link from "next/link";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Thank You | Cowin Materials", description: "Your enquiry has been submitted to Cowin Materials.", path: "/thank-you", index: false });

export default function ThankYouPage() {
  return <><Header /><main><section className="page-hero compact"><div className="section-heading"><span className="eyebrow">Enquiry submitted</span><h1>Thank you for your enquiry</h1><p>Your information has been submitted. Our team will review the stated product and project conditions before responding.</p><Link className="primary-button" href="/products">Browse products</Link></div></section></main><Footer /></>;
}
