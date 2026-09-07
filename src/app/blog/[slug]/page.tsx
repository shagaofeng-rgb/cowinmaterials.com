import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ContentPanel, ContentPanels } from "@/components/content-panels";
import { getBlogArticle } from "@/lib/blog/store";
import { getBlogTechnicalPaths } from "@/lib/blog/related";
import { splitArticleSections } from "@/lib/article-sections";
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
  const technicalPaths = getBlogTechnicalPaths(article);
  const sections = splitArticleSections(article.contentHtml);
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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(`/blog/${article.slug}`) },
    ],
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
          <ContentPanels label="Article sections">
            {sections.map((section) => <ContentPanel id={section.id} label={section.label} key={section.id}><h2 className="content-panel-title">{section.label}</h2><div className="article-body" dangerouslySetInnerHTML={{ __html: section.html }} /></ContentPanel>)}
            <ContentPanel id="related-paths" label="Related paths"><section className="article-related"><h2>Related technical paths</h2><p>Use the linked material and application pages to compare this topic against documented product scope and project conditions.</p><div className="related-news-products">{technicalPaths.map((path) => <Link href={path.href} key={path.href}><strong>{path.label}</strong><span>{path.note}</span></Link>)}</div></section></ContentPanel>
          </ContentPanels>
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      </main>
      <Footer />
    </>
  );
}
