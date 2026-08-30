import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getBlogArticle } from "@/lib/blog/store";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogDetailProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: BlogDetailProps) {
  const article = await getBlogArticle((await params).slug);
  if (!article) return createPageMetadata({ title: "Blog Article Not Found | Cowin Materials", description: "The requested blog article was not found.", path: "/blog", index: false });
  return createPageMetadata({ title: article.title, description: article.excerpt, path: `/blog/${article.slug}` });
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const article = await getBlogArticle((await params).slug);
  if (!article) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.imageUrl ? [article.imageUrl] : undefined,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorId },
    publisher: { "@type": "Organization", name: "Cowin Materials" },
    mainEntityOfPage: absoluteUrl(`/blog/${article.slug}`),
  };
  return (
    <>
      <Header />
      <main>
        <article className="article-layout">
          <Link className="back-link" href="/blog"><ArrowLeft size={16} />Back to blog</Link>
          <header className="article-header">
            <span className="eyebrow">Technical Blog</span>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="news-meta"><span>{article.authorId}</span><span>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(article.publishedAt))}</span></div>
          </header>
          {article.imageUrl ? (
            <figure className="article-cover">
              {/* The publishing API accepts arbitrary HTTPS image hosts, so Next Image cannot use a fixed allowlist. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.imageUrl} alt={`${article.title} cover`} />
            </figure>
          ) : null}
          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
      <Footer />
    </>
  );
}
