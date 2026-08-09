import { getProductPath, products, site } from "@/lib/data";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const productLines = products
    .map((product) => `- ${product.name} (${product.code}): ${product.summary} URL: ${siteUrl}${getProductPath(product)}`)
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
- Technical resources: ${siteUrl}/resources
- Office and manufacturing facility address: ${siteUrl}/locations
- Quality and documentation scope: ${siteUrl}/quality

Technical notes:
- Technical values depend on product grade, test method, sample configuration and operating conditions.
- The supplied building aerogel insulation-coating record reports 0.040 W/(m·K) thermal conductivity, 0.26 m²·K/W added thermal resistance and 35 g/L VOC for its submitted sample and report conditions.
- The supplied cryogenic aerogel-blanket table reports 0.0125 W/(m·K) at -159 °C for the identified blanket grade.
- The supplied 2024 penetrating water-repellent test summary reports 19% water absorption ratio and a 0 mm penetration observation for its submitted sample and stated conditions.
- Fire-resistance ratings depend on project-specific test reports and local compliance requirements.
- Final product selection should be confirmed according to substrate conditions, service temperature, local standards and project specifications.
- Public technical information is limited to stated product, document and application scope. Use product and application pages for current technical context.

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
