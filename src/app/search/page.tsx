import { Search } from "lucide-react";
import { InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { Pagination } from "@/components/pagination";
import { notFound } from "next/navigation";
import { applicationPages, getProductPath, products } from "@/lib/data";
import { findPublicEditorial } from "@/lib/public-search";
import { blogDisplayTitle } from "@/lib/editorial-titles";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Search Aerogel Products | Cowin Materials",
  description: "Search Cowin Materials aerogel products and application information.",
  path: "/search",
  index: false,
});

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const { q = "", page: rawPage } = await searchParams;
  if (typeof q !== "string" || (rawPage !== undefined && (typeof rawPage !== "string" || !/^[1-9]\d*$/.test(rawPage)))) notFound();
  const page = rawPage ? Number(rawPage) : 1;
  if (!Number.isSafeInteger(page)) notFound();
  const searchTerm = q.trim().slice(0, 120);
  const query = searchTerm.toLowerCase();
  const productResults = query
    ? products.filter((product) =>
        [product.name, product.code, product.category, product.summary, product.applications.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : [];
  const applicationResults = query ? applicationPages.filter((item) => [item.title, item.shortTitle, ...item.challenges].join(" ").toLowerCase().includes(query)) : [];
  const catalogResults = [
    ...productResults.map((product) => ({ href: getProductPath(product), title: product.name, label: product.category, text: product.summary })),
    ...applicationResults.map((item) => ({ href: `/applications/${item.slug}`, title: item.title, label: "Application", text: item.challenges.slice(0, 2).join(" · ") })),
  ];
  const pageSize = 12;
  if (page > Math.floor(Number.MAX_SAFE_INTEGER / pageSize)) notFound();
  const start = (page - 1) * pageSize;
  const catalogPage = catalogResults.slice(start, start + pageSize);
  const editorial = await findPublicEditorial(query, Math.max(0, start - catalogResults.length), pageSize - catalogPage.length);
  const total = catalogResults.length + editorial.total;
  if (page > Math.max(1, Math.ceil(total / pageSize))) notFound();
  const visibleResults = [...catalogPage, ...editorial.items.map((item) => ({
    href: `/${item.section.toLowerCase()}/${encodeURIComponent(item.slug)}`, title: item.section === "Blog" ? blogDisplayTitle(item.slug, item.title) : item.title, label: item.section, text: item.excerpt,
  }))];

  return (
    <InteriorPage>
      <InteriorHeading title="Search Cowin Materials" crumbs={[{ label: "Search" }]} />
      <div className="cw-shell cw-search">
        <form className="cw-search-form" action="/search" role="search">
          <label htmlFor="site-query">Material, application or product code</label>
          <div>
            <input id="site-query" name="q" type="search" maxLength={120} defaultValue={searchTerm} placeholder="e.g. aerogel blanket or CW-FTHL" />
            <button className="cw-button cw-button--primary" type="submit"><Search size={17} aria-hidden="true" />Search</button>
          </div>
        </form>
        {query && <h2 className="cw-search-count">{total} {total === 1 ? "result" : "results"} for &ldquo;{searchTerm}&rdquo;</h2>}
        {visibleResults.length ? (
          <>
            <ul className="cw-result-list">
              {visibleResults.map((item) => (
                <li key={item.href}>
                  <span className="cw-label">{item.label}</span>
                  <h3><InteriorLink href={item.href}>{item.title}</InteriorLink></h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
            <Pagination currentPage={page} totalItems={total} pageSize={pageSize} pathname="/search" label="Search results" query={{ q: searchTerm }} />
          </>
        ) : (
          <section className="cw-empty">
            <h2>{query ? "No matching pages" : "Explore the material catalog"}</h2>
            <p>{query ? "Try a material name or a shorter term." : "Browse products by material type or choose an application."}</p>
            <div className="cw-inline-links"><InteriorLink href="/products">Browse products</InteriorLink><InteriorLink href="/applications">Explore applications</InteriorLink></div>
          </section>
        )}
      </div>
    </InteriorPage>
  );
}
