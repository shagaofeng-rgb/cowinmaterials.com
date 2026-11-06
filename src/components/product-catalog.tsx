import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { InteriorLink } from "@/components/interior";
import { MaterialIcon } from "@/components/material-icons";
import { getProductFamilyPath, getProductPath, productFamilies, productTechnicalProfiles, type Product } from "@/lib/data";
import { categoryPresentations, productPresentations } from "@/lib/interior-content";

export function ProductFamilyCards() {
  return (
    <section className="cw-family-grid" aria-label="Product categories">
      {productFamilies.map((family) => {
        const { icon, description } = categoryPresentations[family.slug];
        return (
          <article key={family.slug} className="cw-family">
            <MaterialIcon name={icon} size={32} />
            <h2>{family.title}</h2>
            <p>{description}</p>
            <InteriorLink href={getProductFamilyPath(family)}>View category<span className="sr-only">: {family.title}</span></InteriorLink>
          </article>
        );
      })}
    </section>
  );
}

export function CategoryNavigation({ selected }: { selected: string }) {
  return (
    <nav className="cw-category-nav" aria-label="Product categories">
      <Link href="/products">All products</Link>
      {productFamilies.map((family) => (
        <Link key={family.slug} href={getProductFamilyPath(family)} aria-current={family.slug === selected ? "page" : undefined}>{family.title}</Link>
      ))}
    </nav>
  );
}

export function ProductCatalog({ products }: { products: readonly Product[] }) {
  return (
    <>
      <div className="cw-catalog-head" aria-hidden="true"><span>Product</span><span>Grade</span><span>Selection cue</span></div>
      <ul className="cw-catalog-list">
        {products.map((product) => (
          <li key={product.slug}>
            <Link className="cw-catalog-item" href={getProductPath(product)}>
              <strong>{product.name}</strong>
              <span>{productTechnicalProfiles[product.slug]?.model || product.code}</span>
              <span>{productPresentations[product.slug]?.cue || product.category}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
