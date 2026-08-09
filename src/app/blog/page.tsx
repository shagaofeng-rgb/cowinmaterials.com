import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getBlogArticles } from "@/lib/blog/store";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const articles = await getBlogArticles();
  return createPageMetadata({
    title: "Aerogel Technical Blog | Cowin Materials",
    description: "Technical articles about silica aerogel insulation, fire protection, waterproofing and thermal-management applications.",
    path: "/blog",
    keywords: ["aerogel blog", "silica aerogel technical articles", "industrial insulation guidance"],
    index: articles.length > 0,
  });
}

export default async function BlogPage() {
  const articles = await getBlogArticles();
  return (
    <>
      <Header />
      <main>
        <section className="subpage-hero blog-hero">
          <span className="eyebrow">Technical Blog</span>
          <h1>Practical aerogel material guidance for engineers and buyers</h1>
          <p>Application notes, specification guidance and material-selection perspectives for global industrial projects.</p>
        </section>
        <section className="section">
          {articles.length ? (
            <div className="news-grid">
              {articles.map((article) => (
                <article className="news-card" key={article.id}>
                  {article.imageUrl ? (
                    <Link className="news-image" href={`/blog/${article.slug}`}>
                      {/* Remote publisher images cannot use Next Image without a fixed host allowlist. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.imageUrl} alt="" loading="lazy" />
                    </Link>
                  ) : null}
                  <div className="news-card-body">
                    <div className="news-meta">
                      <span>{article.authorId}</span>
                      <span><CalendarDays size={14} />{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(article.publishedAt))}</span>
                    </div>
                    <h2><Link href={`/blog/${article.slug}`}>{article.title}</Link></h2>
                    <p>{article.excerpt}</p>
                    <Link className="text-link" href={`/blog/${article.slug}`}>Read article<ArrowRight size={16} /></Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state-panel">
              <span className="eyebrow">Technical Library</span>
              <h2>No blog articles have been published yet.</h2>
              <p>New technical articles will appear here after editorial publication.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
