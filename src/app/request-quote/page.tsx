import { InquiryForm } from "@/components/inquiry-form";
import { InteriorHeading, InteriorPage } from "@/components/interior";
import { ContactDetails } from "@/components/interior-contact";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({ title: "Request a Quote | Cowin Materials", description: "Request a quotation, technical data or sample discussion from Quzhou Qiying Import & Export Co., Ltd.", path: "/request-quote", keywords: ["request aerogel quote", "technical data request", "aerogel sample request"] });

export default function RequestQuotePage() {
  return (
    <InteriorPage className="cw-quote">
      <InteriorHeading title="Request a Quote" description="For quotations, technical data, samples and project review." />
      <div className="cw-shell cw-contact-layout cw-contact-layout--form-first">
        <InquiryForm />
        <ContactDetails />
      </div>
    </InteriorPage>
  );
}
