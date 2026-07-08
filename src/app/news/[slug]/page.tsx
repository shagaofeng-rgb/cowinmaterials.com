import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getPublishedNewsBySlug } from "@/lib/news/store";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type NewsDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: NewsDetailProps) {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);

  if (!article) {
    return createPageMetadata({
      title: "News Brief Not Found | Cowin Materials",
      description: "The requested Cowin Materials news brief was not found.",
      path: "/news",
    });
  }

  return createPageMetadata({
    title: article.seoTitle,
    description: article.seoDescription,
    path: `/news/${article.slug}`,
    keywords: [article.primaryKeyword || "aerogel news", ...article.secondaryKeywords],
  });
}

export default async function NewsDetailPage({ params }: NewsDetailProps) {
  const { slug } = await params;
  const article = await getPublishedNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.seoDescription,
    image: [article.image.url],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    publisher: { "@type": "Organization", name: "Cowin Materials" },
    mainEntityOfPage: absoluteUrl(`/news/${article.slug}`),
    isBasedOn: {
      "@type": "CreativeWork",
      name: article.source.title,
      url: article.source.url,
      publisher: article.source.publisher,
      datePublished: article.source.publishedAt,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "News", item: absoluteUrl("/news") },
      { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(`/news/${article.slug}`) },
    ],
  };

  return (
    <>
      <Header />
      <main>
        <article className="article-layout">
          <Link className="back-link" href="/news">
            <ArrowLeft size={16} />
            Back to news
          </Link>
          <header className="article-header">
            <span className="eyebrow">{article.category}</span>
            <h1>{article.title}</h1>
            <p>{article.excerpt}</p>
            <div className="news-meta">
              <span>{article.source.publisher}</span>
              <span>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(article.publishedAt))}</span>
            </div>
          </header>

          <figure className="article-cover">
            <Image src={article.image.url} alt={article.image.alt} width={1160} height={640} priority />
            <figcaption>
              Image source:{" "}
              <a href={article.image.pageUrl} target="_blank" rel="nofollow noopener">
                {article.source.publisher}
              </a>
            </figcaption>
          </figure>

          <div className="article-body" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />

          <section className="article-related">
            <h2>Related Cowin Materials products</h2>
            <div className="related-news-products">
              {article.relatedProducts.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.slug}>
                  <strong>{product.name}</strong>
                  <span>{product.relationshipReason}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="source-box">
            <h2>Source and audit record</h2>
            <dl>
              <div>
                <dt>Original source</dt>
                <dd>
                  <a href={article.source.url} target="_blank" rel="nofollow noopener">
                    {article.source.title}
                    <ExternalLink size={14} />
                  </a>
                </dd>
              </div>
              <div>
                <dt>Source published</dt>
                <dd>{new Date(article.source.publishedAt).toISOString()}</dd>
              </div>
              <div>
                <dt>Source fetched</dt>
                <dd>{new Date(article.source.fetchedAt).toISOString()}</dd>
              </div>
              <div>
                <dt>Fingerprint</dt>
                <dd>{article.source.fingerprint.slice(0, 18)}...</dd>
              </div>
            </dl>
          </section>
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </main>
      <Footer />
    </>
  );
}
