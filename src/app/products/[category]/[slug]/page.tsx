import { notFound } from "next/navigation";
import { ContentPanel, ContentPanels } from "@/components/content-panels";
import { EvidenceTable, InteriorBreadcrumb, InteriorCTA, InteriorFaq, InteriorLink, InteriorPage, MaterialFigure, ScopeNote } from "@/components/interior";
import { applicationPages, getProductFamily, getProductFamilyPath, getProductPath, getProductsForFamily, productTechnicalProfiles, products } from "@/lib/data";
import { productPresentations, quoteHref } from "@/lib/interior-content";
import { getProductFamilyPreview } from "@/lib/product-family-content";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

type ProductPageProps = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return products.flatMap((product) => {
    const path = getProductPath(product).split("/").filter(Boolean);
    return path.length === 3 ? [{ category: path[1], slug: path[2] }] : [];
  });
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const family = getProductFamily(category);
  const product = products.find((item) => item.slug === slug && family?.productSlugs.includes(item.slug));
  if (!product) return createPageMetadata({ title: "Aerogel Product Not Found | Cowin Materials", description: "The requested aerogel product profile was not found.", path: "/products", index: false });
  return createPageMetadata({ title: `${product.seoTitle} | Cowin Materials`, description: product.seoDescription, path: getProductPath(product), keywords: [product.name, family!.title, product.code, "silica aerogel materials"] });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const family = getProductFamily(category);
  const product = products.find((item) => item.slug === slug && family?.productSlugs.includes(item.slug));
  const profile = product ? productTechnicalProfiles[product.slug] : undefined;
  const presentation = product ? productPresentations[product.slug] : undefined;
  if (!product || !profile || !family || !presentation) notFound();

  const relatedApplications = applicationPages.filter((item) => profile.relatedApplicationSlugs.includes(item.slug));
  const relatedProducts = getProductsForFamily(family.slug).filter((item) => item.slug !== slug);
  const productUrl = getProductPath(product);
  const image = product.image === presentation.visual.src ? product.image : undefined;
  const productJsonLd = { "@context": "https://schema.org", "@type": "Product", name: product.name, sku: profile.model, category: family.title, description: product.seoDescription, ...(image ? { image: absoluteUrl(image) } : {}), brand: { "@type": "Brand", name: "Cowin Materials" }, additionalProperty: profile.facts.map((fact) => ({ "@type": "PropertyValue", name: fact.label, value: fact.value, description: fact.scope })) };
  const breadcrumbJsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: "Products", item: absoluteUrl("/products") }, { "@type": "ListItem", position: 3, name: family.title, item: absoluteUrl(`/products/${family.slug}`) }, { "@type": "ListItem", position: 4, name: product.name, item: absoluteUrl(productUrl) }] };
  const productContext = { product: product.name };
  const documentsHref = quoteHref("Request Technical Data", productContext);
  const groups = presentation.groups ?? [{ title: "", facts: profile.facts.map((_, index) => index) }];
  const blanketComparison = slug === "aerogel-blanket-and-thermal-pads" ? getProductFamilyPreview(category)?.comparison : undefined;

  return (
    <InteriorPage className="cw-product-detail">
      <div className="cw-shell cw-detail">
        <InteriorBreadcrumb includeHome={false} items={[{ label: "Products", href: "/products" }, { label: family.title, href: getProductFamilyPath(family) }, { label: profile.model }]} />
        <div className="cw-detail-hero">
          <div className="cw-detail-copy">
            <p className="cw-label"><span>{profile.model}</span><span>{presentation.formPrefix && <span className="cw-hero-note">{presentation.formPrefix} </span>}{presentation.form}</span></p>
            <h1>{product.name}</h1>
            <p>{presentation.intro ?? product.summary}{presentation.introNote && <span className="cw-hero-note"> {presentation.introNote}</span>}</p>
            <div className="cw-actions">
              <InteriorLink href={documentsHref} variant="primary">Request technical data</InteriorLink>
              <InteriorLink href={quoteHref("Request a Sample", productContext)} variant="secondary">Request a sample</InteriorLink>
            </div>
          </div>
          <MaterialFigure visual={presentation.visual} eager />
        </div>
        <dl className="cw-facts" aria-label="Key product data">
          {presentation.quickFacts.map(({ index, label, note, value }) => {
            const fact = profile.facts[index];
            const displayValue = value ?? fact.value;
            return (
              <div key={fact.label} className={`cw-fact${displayValue.length > 25 ? " cw-fact--long" : ""}`}>
                <dt>{label ?? fact.label}{note && <small>{note}</small>}</dt>
                <dd>{displayValue}</dd>
              </div>
            );
          })}
        </dl>

        <ContentPanels label="Product sections" initialId="specifications">
          <ContentPanel id="overview" label="Overview">
            <h2>Overview</h2>
            {profile.overview.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            <dl className="cw-check-list">
              {presentation.checks.map((check) => <div key={check.label}><dt>{check.label}</dt><dd>{check.detail}</dd></div>)}
            </dl>
            <p className="cw-muted">Typical applications: {product.applications.join(", ")}.</p>
          </ContentPanel>
          <ContentPanel id="specifications" label="Specifications">
            <h2>Specifications and test basis</h2>
            <div className="cw-panel-grid">
              <div>
                {blanketComparison && (
                  <div className="cw-spec-group">
                    <h3>High-temperature and cryogenic grades</h3>
                    <EvidenceTable caption={blanketComparison.title} columns={["Evaluation point", "CW-AT-H", "CW-AT-L", "Basis"]} rows={blanketComparison.rows.map((row) => [row.label, row.highTemperature, row.cryogenic, row.scope])} />
                  </div>
                )}
                {groups.map((group) => (
                  <div className="cw-spec-group" key={group.title}>
                    {group.title && <h3>{group.title}</h3>}
                    <EvidenceTable
                      caption={group.title || `${profile.model} specifications`}
                      columns={["Property", "Value", "Basis"]}
                      rows={group.facts.map((index) => {
                        const { label, value, scope } = profile.facts[index];
                        return [label, value, scope];
                      })}
                    />
                  </div>
                ))}
              </div>
              <aside className="cw-panel-aside">
                <h3>Applicable documents</h3>
                {slug === "aerogel-fireproof-coating" ? <p>Coating work instructions</p> : <ul>{profile.sourceDocuments.map((source) => <li key={source}>{source}</li>)}</ul>}
                <p>Technical and safety data on request</p>
                <InteriorLink href={documentsHref}>Request documentation</InteriorLink>
              </aside>
            </div>
            <ScopeNote>{presentation.boundary || profile.testScope}</ScopeNote>
            {presentation.boundary && !presentation.handlingFacts && <p className="cw-scope-detail">{profile.testScope}</p>}
          </ContentPanel>
          <ContentPanel id="handling" label="Handling & limits">
            <h2>Handling and selection limits</h2>
            <div className="cw-pair">
              <div className="cw-stack"><h3>Handling / storage</h3><ul className="cw-text-list">{profile.handling.map((item) => <li key={item}>{item}</li>)}</ul></div>
              <div className="cw-stack"><h3>Selection limits</h3><ul className="cw-text-list">{profile.selectionLimits.map((item) => <li key={item}>{item}</li>)}</ul></div>
            </div>
            {presentation.handlingFacts && (
              <div className="cw-handling-data">
                <EvidenceTable caption="Handling data and test basis" columns={["Property", "Value", "Basis"]} rows={presentation.handlingFacts.map((index) => {
                  const { label, value, scope } = profile.facts[index];
                  return [label, value, scope];
                })} />
                <p className="cw-scope-detail">{profile.testScope}</p>
              </div>
            )}
          </ContentPanel>
          <ContentPanel id="documents" label="Documents">
            <h2>Source documents</h2>
            <EvidenceTable caption="Applicable source documents" columns={["Document", "Applicable grade", "Availability"]} rows={profile.sourceDocuments.map((item) => [item, profile.model, "Request documentation"])} />
            <div className="cw-inline-links">
              <InteriorLink href={documentsHref}>Request applicable documentation</InteriorLink>
              <InteriorLink href="/resources#tds">Technical resources</InteriorLink>
            </div>
            <p className="cw-muted">Last reviewed: {profile.lastReviewed}.</p>
          </ContentPanel>
          <ContentPanel id="faq" label="FAQ">
            <h2>Product FAQ</h2>
            <InteriorFaq items={profile.faq} />
          </ContentPanel>
        </ContentPanels>

        {(relatedApplications.length > 0 || relatedProducts.length > 0) && (
          <section className="cw-related cw-pair" aria-label="Related materials and applications">
            {relatedApplications.length > 0 && <div><h2>Related applications</h2><div className="cw-inline-links">{relatedApplications.map((item) => <InteriorLink href={`/applications/${item.slug}`} key={item.slug}>{item.shortTitle}</InteriorLink>)}</div></div>}
            {relatedProducts.length > 0 && <div><h2>Related products</h2><div className="cw-inline-links">{relatedProducts.map((item) => <InteriorLink href={getProductPath(item)} key={item.slug}>{item.name}</InteriorLink>)}</div></div>}
          </section>
        )}
      </div>
      <InteriorCTA title="Discuss your application" description="Share the substrate, temperature and required test standard for a grade-specific review." href={quoteHref("Request a Quote", productContext)} label="Request a quote" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
    </InteriorPage>
  );
}
