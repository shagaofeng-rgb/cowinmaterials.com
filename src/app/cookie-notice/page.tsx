import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Cookie Notice | Cowin Materials",
  description: "Cookie notice for the Cowin Materials website.",
  path: "/cookie-notice",
});

export default function CookieNoticePage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading level={1} eyebrow="Cookies" title="Cookie Notice" intro="This website keeps cookies and tracking simple." />
        </section>
        <section className="section legal-copy">
          <h2>Current cookie use</h2>
          <p>This website does not use a complex cookie consent system because non-essential advertising cookies are not currently configured in the codebase.</p>
          <h2>Basic operation</h2>
          <p>Hosting, security and form submission systems may process standard technical information such as browser, device and request data.</p>
          <h2>Future analytics</h2>
          <p>If analytics or advertising tracking is added later, this notice should be updated according to the target market and applicable legal requirements.</p>
          <h2>Contact</h2>
          <p>For cookie questions, contact {site.email}.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
