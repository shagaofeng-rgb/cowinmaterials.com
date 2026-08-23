import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { getProductFamilyPath, getProductPath, getProductsForFamily, productFamilies, products } from "@/lib/data";
import { getProductFamilyPreview } from "@/lib/product-family-content";

type ProductCatalogProps = {
  familySlug?: string;
  includeFamilyOverview?: boolean;
};

export function ProductFilter({ familySlug, includeFamilyOverview = true }: ProductCatalogProps) {
  const selected = familySlug ? productFamilies.find((family) => family.slug === familySlug) : undefined;
  const displayedProducts = selected ? getProductsForFamily(selected.slug) : products;

  return (
    <div className="product-explorer">
      {includeFamilyOverview ? (
        <div className="product-family-grid" aria-label="Product categories">
          {productFamilies.map((family, index) => {
            const familyProducts = getProductsForFamily(family.slug);
            const preview = getProductFamilyPreview(family.slug);
            return (
              <article className="product-family-card" key={family.slug}>
                <span className="family-index">{String(index + 1).padStart(2, "0")}</span>
                <h2>{family.title}</h2>
                <p>{family.intent}</p>
                {preview ? <dl className="family-evidence">{preview.highlights.map((highlight) => <div key={highlight.label}><dt>{highlight.label}</dt><dd>{highlight.value}</dd></div>)}</dl> : null}
                <small>{familyProducts.map((product) => product.code).join(" · ")}</small>
                <Link className="text-link" href={getProductFamilyPath(family)}>
                  View category <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      ) : null}

      <div className="product-selection" id="product-selection">
        <div className="product-selection-heading">
          <div>
            <span className="eyebrow">Product selection</span>
            <h2>{selected ? selected.title : "Compare product forms"}</h2>
            <p>{selected ? selected.description : "Browse each product by its form, documented scope and intended application. Technical figures always remain tied to the named grade and conditions."}</p>
          </div>
          {selected ? <Link className="secondary-button" href="/products">View all categories</Link> : null}
        </div>

        <nav className="segmented-control" aria-label="Product categories">
          <Link href="/products" aria-current={!selected ? "page" : undefined}>All products</Link>
          {productFamilies.map((family) => <Link href={getProductFamilyPath(family)} key={family.slug} aria-current={selected?.slug === family.slug ? "page" : undefined}>{family.title}</Link>)}
        </nav>

        <div className="product-grid">
          {displayedProducts.map((product) => (
            <article className="product-card" key={product.code}>
              <div className="product-card-media">
                {product.image ? <Image src={product.image} alt={product.imageAlt || product.name} width={760} height={500} /> : <span className="product-card-technical-mark"><small>{product.category}</small><strong>{product.code}</strong></span>}
              </div>
              <div><span className="product-code">{product.code}</span><h3>{product.name}</h3><p>{product.summary}</p></div>
              <ul className="metric-list">{product.metrics.slice(0, 3).map((metric) => <li key={metric}><CheckCircle2 size={16} aria-hidden="true" /><span>{metric}</span></li>)}</ul>
              <div className="product-card-actions"><Link className="text-link" href={getProductPath(product)}>View product <ArrowRight size={16} aria-hidden="true" /></Link><Link className="text-link" href={`/request-quote?request=Request%20Technical%20Data&product=${encodeURIComponent(product.name)}`}>Request technical data <ArrowRight size={16} aria-hidden="true" /></Link></div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
