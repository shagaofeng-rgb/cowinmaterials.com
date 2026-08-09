import { MapPin } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Office and Manufacturing Facility Address | Cowin Materials", description: "Office and manufacturing facility address information for Quzhou Qiying Import & Export Co., Ltd. and Cowin Materials.", path: "/locations", keywords: ["Quzhou Qiying address", "Cowin Materials office", "manufacturing facility address"] });

export default function LocationsPage() {
  return <><Header /><main><section className="page-hero compact"><SectionHeading level={1} eyebrow="Locations" title="Office and manufacturing facility address" intro="Our office and manufacturing facility address are shown separately so project correspondence and production-location references remain clear." /></section><section className="section location-grid"><article className="location-card"><MapPin size={24} /><span className="eyebrow">Office</span><h2>Quzhou office</h2><p>{site.officeAddress}</p><p>Telephone: <a href={`tel:${site.phoneHref}`}>{site.phone}</a><br />Email: <a href={`mailto:${site.email}`}>{site.email}</a></p></article><article className="location-card"><MapPin size={24} /><span className="eyebrow">Manufacturing facility address</span><h2>Shanghai production location</h2><p>{site.manufacturingFacilityAddress}</p><p className="proof-note">This address is presented as a manufacturing facility address. It is not described as a headquarters, owned factory or certified facility.</p></article></section></main><Footer /></>;
}
