import { Mail, MapPin, Phone } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { InquiryForm } from "@/components/inquiry-form";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Request a Quote | Cowin Materials", description: "Request a quotation, technical data or sample discussion from Quzhou Qiying Import & Export Co., Ltd.", path: "/request-quote", keywords: ["request aerogel quote", "technical data request", "aerogel sample request"] });

export default function RequestQuotePage() {
  return <><Header /><main><section className="page-hero compact"><SectionHeading level={1} eyebrow="Request a quote" title="Tell us the product and project conditions" intro="Use this form for quotations, technical-data requests, samples and application review. Required fields help our team route the enquiry responsibly." /></section><section className="section contact-layout"><aside className="contact-panel"><h2>Contact details</h2><ul className="contact-list large"><li><Phone size={18} /><a href={`tel:${site.phoneHref}`}>{site.phone}</a></li><li><Mail size={18} /><a href={`mailto:${site.email}`}>{site.email}</a></li><li><MapPin size={18} /><span><strong>Office:</strong> {site.officeAddress}</span></li></ul></aside><InquiryForm /></section></main><Footer /></>;
}
