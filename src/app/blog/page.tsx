import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getBlogArticles } from "@/lib/blog/store";
import { getPublishedBlogPage } from "@/lib/blog/store";
import { Pagination } from "@/components/pagination";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogPageProps = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const articles = await getBlogArticles();
  const page = Math.max(1, Number((await searchParams).page) || 1);
  return createPageMetadata({
    title: page > 1 ? `Aerogel Technical Blog - Page ${page} | Cowin Materials` : "Aerogel Technical Blog | Cowin Materials",
    description: "Technical articles about silica aerogel insulation, fire protection, waterproofing and thermal-management applications.",
    path: page > 1 ? `/blog?page=${page}` : "/blog",
    keywords: ["aerogel blog", "silica aerogel technical articles", "industrial insulation guidance"],
    index: articles.length > 0,
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const requestedPage = Math.max(1, Number((await searchParams).page) || 1);
  const result = await getPublishedBlogPage({ page: requestedPage, pageSize: 9 });
  const articles = result.articles;
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
            <>
            <div className="news-grid">
              {articles.map((article) => (
                <article className="news-card" key={article.id}>
                  {article.imageUrl ? (
                    <Link className="news-image" href={`/blog/${article.slug}`}>
                      {/* Remote publisher images cannot use Next Image without a fixed host allowlist. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.imageUrl} alt={`${article.title} cover`} loading="lazy" />
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
            <Pagination currentPage={result.page} totalItems={result.total} pageSize={result.pageSize} pathname="/blog" label="Blog articles" />
            </>
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
