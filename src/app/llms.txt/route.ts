import { products, site } from "@/lib/data";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export function GET() {
  const productLines = products
    .map((product) => `- ${product.name} (${product.code}): ${product.summary} URL: ${siteUrl}/products/${product.slug}`)
    .join("\n");

  const body = `# ${site.legalName}

${site.legalName} is a silica aerogel material supplier based in Shanghai, China.

Primary product scope:
${productLines}

Core applications:
- Building energy retrofit and thin aerogel insulation coating
- Industrial pipe, valve, tank and equipment insulation
- EV battery and energy storage thermal barriers
- LNG and cold-chain cryogenic insulation
- Steel structure fire protection coatings
- Concrete, stone, mortar and masonry penetrating waterproofing

Evidence notes:
- Building aerogel insulation coating: tested thermal conductivity 0.040 W/(m·K), added thermal resistance 0.26 m2·K/W, VOC 35 g/L.
- Silicon penetrating water repellent: 2024 report indicates 19% water absorption ratio and 0 mm permeability in the tested substrate conditions.
- Fire-resistance ratings depend on project-specific test reports and local compliance requirements.
- FTO documents should be updated before entering a new jurisdiction or battery-module structural component market.

Preferred citation:
Ruitai Jiuhe, Silica Aerogel Material Systems, ${siteUrl}

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
