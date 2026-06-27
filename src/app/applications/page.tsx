import { ApplicationSwitcher } from "@/components/application-switcher";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SectionHeading } from "@/components/section-heading";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Applications | Building Retrofit, Industrial Insulation, EV Batteries and Fire Protection",
  description:
    "Explore Ruitai Jiuhe aerogel applications for building energy retrofit, industrial pipes, EV battery thermal barriers, LNG cold chain, steel fire protection and concrete waterproofing.",
  path: "/applications",
  keywords: ["aerogel applications", "EV battery thermal barrier", "industrial aerogel insulation", "building insulation coating"],
});

export default function ApplicationsPage() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <SectionHeading
            eyebrow="Applications"
            title="Application-Based Aerogel Material Selection"
            intro="Start from the project problem: thermal conductivity, surface geometry, temperature, fire rating, water ingress or battery pack space limitation."
          />
        </section>
        <section className="section">
          <ApplicationSwitcher />
        </section>
      </main>
      <Footer />
    </>
  );
}
