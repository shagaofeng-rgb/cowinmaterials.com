import Link from "next/link";
import { Search } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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
  if (rawPage !== undefined && !/^[1-9]\d*$/.test(rawPage)) notFound();
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
    <>
      <Header />
      <main>
        <section className="subpage-hero compact-hero">
          <span className="eyebrow">Search</span>
          <h1>Find product and industry information</h1>
          <form className="search-form" action="/search">
            <Search size={18} />
            <input name="q" defaultValue={q} placeholder="Search aerogel coating, battery pads, fire protection..." />
            <button type="submit">Search</button>
          </form>
        </section>
        <section className="section">
          {!query ? (
            <div className="empty-state-panel">
              <h2>Start with a material, application or product code.</h2>
              <p>Examples: aerogel coating, CW-FTHL, EV thermal barrier, penetrating water repellent.</p>
            </div>
          ) : (
            <div className="search-results">
              <h2>Results for “{q}”</h2>
              {visibleResults.map((item) => (
                <Link href={item.href} key={item.href} className="search-result-card">
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </Link>
              ))}
              {!results.length ? <p>No matching published result was found.</p> : null}
              <Pagination currentPage={page} totalItems={results.length} pageSize={pageSize} pathname="/search" label="Search results" query={{ q }} />
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
