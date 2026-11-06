import { Search } from "lucide-react";
import { InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { Pagination } from "@/components/pagination";
import { notFound } from "next/navigation";
import { applicationPages, getProductPath, products } from "@/lib/data";
import { getBlogArticles } from "@/lib/blog/store";
import { getPublishedNews } from "@/lib/news/store";
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
  const query = q.trim().toLowerCase();
  const productResults = query
    ? products.filter((product) =>
        [product.name, product.code, product.category, product.summary, product.applications.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : [];
  const applicationResults = query ? applicationPages.filter((item) => [item.title, item.shortTitle, ...item.challenges].join(" ").toLowerCase().includes(query)) : [];
  const [blogArticles, newsPage] = query ? await Promise.all([getBlogArticles(), getPublishedNews({ page: 1, pageSize: 50 })]) : [[], { articles: [], total: 0 }];
  const newsArticles = newsPage.total > 50 ? [...newsPage.articles, ...(await getPublishedNews({ page: 2, pageSize: 50 })).articles] : newsPage.articles;
  const results = [
    ...productResults.map((product) => ({ href: getProductPath(product), title: product.name, label: product.category, text: product.summary })),
    ...applicationResults.map((item) => ({ href: `/applications/${item.slug}`, title: item.title, label: "Application", text: item.challenges.slice(0, 2).join(" · ") })),
    ...blogArticles.filter((item) => [item.title, item.excerpt].join(" ").toLowerCase().includes(query)).map((item) => ({ href: `/blog/${item.slug}`, title: item.title, label: "Blog", text: item.excerpt })),
    ...newsArticles.filter((item) => [item.title, item.excerpt].join(" ").toLowerCase().includes(query)).map((item) => ({ href: `/news/${item.slug}`, title: item.title, label: "News", text: item.excerpt })),
  ];
  const pageSize = 12;
  if (page > Math.max(1, Math.ceil(results.length / pageSize))) notFound();
  const visibleResults = results.slice((page - 1) * pageSize, page * pageSize);

  return (
    <InteriorPage>
      <InteriorHeading title="Search Cowin Materials" crumbs={[{ label: "Search" }]} />
      <div className="cw-shell cw-search">
        <form className="cw-search-form" action="/search" role="search">
          <label htmlFor="site-query">Material, application or product code</label>
          <div>
            <input id="site-query" name="q" type="search" defaultValue={q} placeholder="e.g. aerogel blanket or CW-FTHL" />
            <button className="cw-button cw-button--primary" type="submit"><Search size={17} aria-hidden="true" />Search</button>
          </div>
        </form>
        {query && <h2 className="cw-search-count">{results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{q}&rdquo;</h2>}
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
            <Pagination currentPage={page} totalItems={results.length} pageSize={pageSize} pathname="/search" label="Search results" query={{ q }} />
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
