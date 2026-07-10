import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Rss } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getPublishedNews } from "@/lib/news/store";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createPageMetadata({
  title: "Aerogel Industry News and Technical Insights | Cowin Materials",
  description:
    "Follow Cowin Materials news briefs on silica aerogel insulation, battery thermal barriers, fire protection coatings and waterproofing material trends.",
  path: "/news",
  keywords: ["aerogel news", "silica aerogel insulation", "battery thermal barrier news"],
});

export default async function NewsPage() {
  const news = await getPublishedNews({ pageSize: 12 });

  return (
    <>
      <Header />
      <main>
        <section className="subpage-hero news-hero">
          <span className="eyebrow">News & Technical Insights</span>
          <h1>Aerogel industry signals for global technical buyers</h1>
          <p>
            Curated briefs connect public industry developments with Cowin Materials product
            evaluation areas. Every published item records source, image provenance and related
            product context.
          </p>
          <div className="hero-actions">
            <Link className="primary-button" href="/news/rss.xml">
              RSS Feed
              <Rss size={18} />
            </Link>
            <Link className="secondary-button" href="/products">
              Browse Products
            </Link>
          </div>
        </section>

        <section className="section">
          {news.articles.length ? (
            <div className="news-grid">
              {news.articles.map((article) => (
                <article className="news-card" key={article.slug}>
                  <Link href={`/news/${article.slug}`} className="news-image">
                    <Image src={article.image.url} alt={article.image.alt} width={720} height={430} />
                  </Link>
                  <div className="news-card-body">
                    <div className="news-meta">
                      <span>{article.source.publisher}</span>
                      <span>
                        <CalendarDays size={14} />
                        {new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(article.publishedAt))}
                      </span>
                    </div>
                    <h2>
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p>{article.excerpt}</p>
                    <div className="chip-row">
                      {article.relatedProducts.slice(0, 2).map((product) => (
                        <Link className="chip" href={`/products/${product.slug}`} key={product.slug}>
                          {product.name}
                        </Link>
                      ))}
                    </div>
                    <Link className="text-link" href={`/news/${article.slug}`}>
                      Read brief
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state-panel">
              <span className="eyebrow">No Published News</span>
              <h2>News automation is installed and waiting for verified content.</h2>
              <p>
                Cowin Materials does not publish placeholder news. Articles appear here only after
                source freshness, product relevance and image provenance checks pass.
              </p>
              <Link className="primary-button" href="/technical-resources">
                View Technical Resources
                <ArrowRight size={18} />
              </Link>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
