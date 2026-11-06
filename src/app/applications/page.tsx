import Image from "next/image";
import Link from "next/link";
import { InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { applicationPages, applicationTechnicalProfiles, getProductPath, products } from "@/lib/data";
import { applicationVisuals } from "@/lib/interior-content";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Aerogel Application Solutions | Cowin Materials",
  description:
    "Explore Cowin Materials aerogel applications for building retrofit, industrial insulation, EV and ESS thermal barriers, LNG insulation, steel fire protection and concrete waterproofing.",
  path: "/applications",
  keywords: ["aerogel applications", "industrial aerogel insulation", "building insulation coating", "battery thermal barrier"],
});

export default function ApplicationsPage() {
  return (
    <InteriorPage>
      <InteriorHeading title="Applications" description="Explore aerogel material options by project conditions, operating environment and validation needs." action={<InteriorLink href="/products">Browse materials</InteriorLink>} />
      <div className="cw-shell cw-tile-grid">
        {applicationPages.map((item) => {
          const visual = applicationVisuals[item.slug];
          const profile = applicationTechnicalProfiles[item.slug];
          const productRoutes = products.filter((product) => profile?.recommendedProductSlugs.includes(product.slug));
          return (
            <article className="cw-tile" key={item.slug}>
              <figure>
                <div className={`cw-tile-media${visual.fit === "cover" ? "" : " cw-tile-media--contain"}`}>
                  <Image src={visual.src} alt={visual.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw" />
                </div>
                <figcaption>{visual.caption}</figcaption>
              </figure>
              <div className="cw-tile-body">
                <h2><Link href={`/applications/${item.slug}`}>{item.shortTitle}</Link></h2>
                <p>{item.challenges.slice(0, 3).join(" · ")}</p>
                <p className="cw-muted"><strong>Project inputs:</strong> {item.requiredInfo.slice(0, 2).join(", ")}</p>
                <div className="cw-tile-links" aria-label="Relevant product grades">
                  {productRoutes.map((product) => <Link className="cw-inline" href={getProductPath(product)} key={product.slug}>{product.code}</Link>)}
                </div>
                <InteriorLink href={`/applications/${item.slug}`}>Explore application<span className="sr-only">: {item.shortTitle}</span></InteriorLink>
              </div>
            </article>
          );
        })}
      </div>
    </InteriorPage>
  );
}
