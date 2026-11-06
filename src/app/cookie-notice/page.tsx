import { LegalPage } from "@/components/legal-page";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Cookie Notice | Cowin Materials",
  description: "Cookie notice for the Cowin Materials website.",
  path: "/cookie-notice",
});

export default function CookieNoticePage() {
  return (
    <LegalPage
      title="Cookie Notice"
      description="This website keeps cookies and tracking simple."
      sections={[
        { id: "current-cookie-use", label: "Current cookie use", body: <><p>We use essential browser storage for protected sessions. Website measurement is disabled when your browser sends a Global Privacy Control or Do Not Track signal.</p></> },
        { id: "basic-operation", label: "Basic operation", body: <><p>Hosting, security and form submission systems may process standard technical information such as browser, device and request data.</p></> },
        { id: "contact-entry-measurement", label: "Contact-entry measurement", body: <><p>To measure website use, the website records public page paths and event times with a pseudonymous first-party visitor identifier stored in browser local storage. A separate session identifier is renewed after 30 minutes without activity. When a visitor selects the WhatsApp contact entry, it also records the page path and entry placement. These events do not store a visitor&apos;s WhatsApp account, message content or enquiry text.</p>
          <p>If a visitor submits an enquiry, the current pseudonymous identifier can be associated with that business enquiry in the protected administration system. It is not disclosed on public pages or in public APIs.</p></> },
        { id: "future-analytics", label: "Future analytics", body: <><p>If additional analytics or advertising tracking is added later, this notice will be updated according to the target market and applicable legal requirements.</p></> },
        { id: "contact", label: "Contact", body: <><p>For cookie questions, contact <a href={`mailto:${site.email}`}>{site.email}</a>.</p></> },
      ]}
    />
  );
}
