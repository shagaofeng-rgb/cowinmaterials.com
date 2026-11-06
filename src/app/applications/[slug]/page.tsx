import { notFound } from "next/navigation";
import { ContentPanel, ContentPanels } from "@/components/content-panels";
import { EvidenceTable, InteriorBreadcrumb, InteriorCTA, InteriorFaq, InteriorLink, InteriorPage, MaterialFigure, ScopeNote } from "@/components/interior";
import { ProductCatalog } from "@/components/product-catalog";
import { applicationPages, applicationTechnicalProfiles, products } from "@/lib/data";
import { applicationDetailVisuals, quoteHref } from "@/lib/interior-content";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

type ApplicationPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() { return applicationPages.map((item) => ({ slug: item.slug })); }

export async function generateMetadata({ params }: ApplicationPageProps) {
  const { slug } = await params;
  const page = applicationPages.find((item) => item.slug === slug);
  if (!page) return createPageMetadata({ title: "Application Not Found | Cowin Materials", description: "The requested application page was not found.", path: "/applications", index: false });
  return createPageMetadata({ title: `${page.shortTitle} Solutions | Cowin Materials`, description: page.intro, path: `/applications/${page.slug}`, keywords: [page.shortTitle, "aerogel application", "Cowin Materials"] });
}

export default async function ApplicationDetailPage({ params }: ApplicationPageProps) {
  const { slug } = await params;
  const page = applicationPages.find((item) => item.slug === slug);
  const profile = page ? applicationTechnicalProfiles[page.slug] : undefined;
  if (!page || !profile) notFound();
  const recommendedProducts = products.filter((item) => profile.recommendedProductSlugs.includes(item.slug));
  const projectContext = { application: page.shortTitle };
  const reviewHref = quoteHref("Ask for Product Selection", projectContext);
  const breadcrumbJsonLd = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Applications", item: absoluteUrl("/applications") },
      { "@type": "ListItem", position: 3, name: page.shortTitle, item: absoluteUrl(`/applications/${page.slug}`) },
    ],
  };

  return (
    <InteriorPage className="cw-application-detail">
      <div className="cw-shell cw-detail">
        <InteriorBreadcrumb items={[{ label: "Applications", href: "/applications" }, { label: page.shortTitle }]} />
        <div className="cw-detail-hero">
          <div className="cw-detail-copy">
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            <div className="cw-actions">
              <InteriorLink href={reviewHref} variant="primary">Request a project review</InteriorLink>
              <InteriorLink href="/resources" variant="secondary">View resources</InteriorLink>
            </div>
          </div>
          <MaterialFigure visual={applicationDetailVisuals[page.slug]} eager />
        </div>
        <ContentPanels label="Application sections">
          <ContentPanel id="conditions" label="Project conditions">
            <div className="cw-pair">
              <section className="cw-stack"><h2>Project challenge</h2><p>{profile.projectChallenge}</p></section>
              <section className="cw-stack"><h2>Information to collect</h2><ul className="cw-text-list">{page.requiredInfo.map((item) => <li key={item}>{item}</li>)}</ul></section>
            </div>
            <section className="cw-related">
              <div className="cw-section-heading"><h2>Candidate materials</h2></div>
              <ProductCatalog products={recommendedProducts} />
            </section>
          </ContentPanel>
          <ContentPanel id="technical-data" label="Technical data">
            <h2>Applicable technical data</h2>
            <EvidenceTable caption={`${page.shortTitle} data and scope`} columns={["Property", "Reported value", "Basis"]} rows={profile.evidence.map(({ label, value, scope }) => [label, value, scope])} />
            <ScopeNote>Values apply to the stated grade and test conditions. They do not transfer across assemblies or operating environments.</ScopeNote>
          </ContentPanel>
          <ContentPanel id="systems" label="Systems & limits">
            <div className="cw-pair">
              <section className="cw-stack"><h2>Verification steps</h2><ol className="cw-text-list">{profile.validationSteps.map((item) => <li key={item}>{item}</li>)}</ol></section>
              <section className="cw-stack"><h2>System limits</h2><ul className="cw-text-list">{profile.systemLimits.map((item) => <li key={item}>{item}</li>)}</ul></section>
            </div>
          </ContentPanel>
          <ContentPanel id="documents" label="Documents">
            <h2>Documentation and project review</h2>
            <p>Match the document set to the selected grade, substrate, test method and complete system build.</p>
            <InteriorLink href={quoteHref("Request Technical Data", projectContext)}>Request applicable documentation</InteriorLink>
            <p className="cw-muted">Last reviewed: {profile.lastReviewed}.</p>
          </ContentPanel>
          <ContentPanel id="faq" label="FAQ">
            <h2>Application FAQ</h2>
            <InteriorFaq items={profile.faq} />
          </ContentPanel>
        </ContentPanels>
      </div>
      <InteriorCTA title="Review your operating conditions" href={reviewHref} label="Send project details" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </InteriorPage>
  );
}
