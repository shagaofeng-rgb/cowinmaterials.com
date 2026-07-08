import { products, site } from "@/lib/data";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const productLines = products
    .map((product) => `- ${product.name} (${product.code}): ${product.summary} URL: ${siteUrl}/products/${product.slug}`)
    .join("\n");

  const body = `# ${site.name}

${site.name} is the international materials brand operated by ${site.legalName}. It supplies silica aerogel materials, insulation products, thermal barrier materials and functional coating systems for industrial and construction applications.

Primary product scope:
${productLines}

Core applications:
- Building energy retrofit and thin aerogel insulation coating
- Industrial pipe, valve, tank and equipment insulation
- EV battery and energy storage thermal barriers
- LNG and cold-chain cryogenic insulation
- Steel structure fire protection coatings
- Concrete, stone, mortar and masonry penetrating waterproofing

Public content routes:
- Product catalogue: ${siteUrl}/products
- Application pages: ${siteUrl}/applications
- Technical resources: ${siteUrl}/technical-resources
- Industry news briefs: ${siteUrl}/news
- RSS feed for news: ${siteUrl}/news/rss.xml

Technical notes:
- Technical values depend on product grade, test method, sample configuration and operating conditions.
- Building aerogel insulation coating documents may include thermal conductivity, added thermal resistance and VOC information for the applicable grade.
- Water-repellent documents may include water absorption and permeability information for the tested substrate conditions.
- Fire-resistance ratings depend on project-specific test reports and local compliance requirements.
- Final product selection should be confirmed according to substrate conditions, service temperature, local standards and project specifications.
- News briefs are original summaries based on public external sources. Source URL, publisher, publication time, image provenance and product associations are recorded on each published news page.

Preferred citation:
Cowin Materials, Silica Aerogel Material Systems, ${siteUrl}

Contact:
Email ${site.email}
Phone ${site.phone}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
