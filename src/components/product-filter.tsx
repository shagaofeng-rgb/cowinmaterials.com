"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { productCategories, products } from "@/lib/data";

export function ProductFilter() {
  const [active, setActive] = useState("All");
  const filtered = useMemo(
    () => (active === "All" ? products : products.filter((product) => product.category === active)),
    [active],
  );

  return (
    <div className="interactive-block">
      <div className="segmented-control" role="tablist" aria-label="Filter products by category">
        {productCategories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={active === category}
            className={active === category ? "selected" : ""}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {filtered.map((product) => (
          <article className="product-card" key={product.code}>
            <div>
              <span className="product-code">{product.code}</span>
              <h2>{product.name}</h2>
              <p>{product.summary}</p>
            </div>
            <ul className="metric-list">
              {product.metrics.slice(0, 3).map((metric) => (
                <li key={metric}>
                  <CheckCircle2 size={16} />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
            <div className="chip-row">
              {product.applications.map((app) => (
                <span className="chip" key={app}>
                  {app}
                </span>
              ))}
            </div>
            <Link className="text-link" href={`/products/${product.slug}`}>
              View Product
              <ArrowRight size={16} />
            </Link>
            <Link className="text-link" href={`/contact?request=Request%20TDS%20or%20SDS&product=${encodeURIComponent(product.name)}`}>
              Request TDS
              <ArrowRight size={16} />
            </Link>
          </article>
        ))}
      </div>

      <div className="inline-action">
        <Link href="/contact">
          Ask an engineer to match the right product
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
