import { MapPin } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Office Location and Contact | Cowin Materials", description: "Office location and contact details for Quzhou Qiying Import & Export Co., Ltd. and Cowin Materials.", path: "/locations", keywords: ["Quzhou Qiying address", "Cowin Materials office", "Cowin Materials contact"] });

export default function LocationsPage() {
  return <><Header /><main><section className="page-hero compact"><SectionHeading level={1} eyebrow="Locations" title="Office location and contact" intro="Use the Quzhou office details for project correspondence, document requests and commercial communication." /></section><section className="section location-grid"><article className="location-card"><MapPin size={24} /><span className="eyebrow">Office</span><h2>Quzhou office</h2><p>{site.officeAddress}</p><p>Telephone: <a href={`tel:${site.phoneHref}`}>{site.phone}</a><br />Email: <a href={`mailto:${site.email}`}>{site.email}</a></p></article></section></main><Footer /></>;
}
