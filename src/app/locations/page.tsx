import { InteriorHeading, InteriorPage } from "@/components/interior";
import { ContactDetails } from "@/components/interior-contact";
import { OfficeMap } from "@/components/office-map";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Office Location and Contact | Cowin Materials", description: "Office location and contact details for Quzhou Qiying Import & Export Co., Ltd. and Cowin Materials.", path: "/locations", keywords: ["Quzhou Qiying address", "Cowin Materials office", "Cowin Materials contact"] });

export default function LocationsPage() {
  return (
    <InteriorPage>
      <InteriorHeading title="Office location and contact" crumbs={[{ label: "Office location" }]} description="Quzhou office for project correspondence, document requests and commercial enquiries." />
      <div className="cw-shell cw-contact-layout">
        <ContactDetails title="Office contact" placement="location_phone" />
        <div className="cw-map-slot"><OfficeMap /></div>
      </div>
    </InteriorPage>
  );
}
