import Link from "next/link";
import { Search } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { products } from "@/lib/data";
import { getPublishedNews } from "@/lib/news/store";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Search Aerogel Products and News | Cowin Materials",
  description: "Search Cowin Materials aerogel products, application pages and published industry news briefs.",
  path: "/search",
});

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim().toLowerCase();
  const news = await getPublishedNews({ pageSize: 20 });
  const productResults = query
    ? products.filter((product) =>
        [product.name, product.code, product.category, product.summary, product.applications.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : [];
  const newsResults = query
    ? news.articles.filter((article) =>
        [article.title, article.excerpt, article.category, article.relatedProducts.map((item) => item.name).join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : [];

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
              {[...productResults.map((product) => ({
                href: `/products/${product.slug}`,
                title: product.name,
                label: product.category,
                text: product.summary,
              })), ...newsResults.map((article) => ({
                href: `/news/${article.slug}`,
                title: article.title,
                label: "News",
                text: article.excerpt,
              }))].map((item) => (
                <Link href={item.href} key={item.href} className="search-result-card">
                  <span>{item.label}</span>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </Link>
              ))}
              {!productResults.length && !newsResults.length ? <p>No matching published result was found.</p> : null}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
