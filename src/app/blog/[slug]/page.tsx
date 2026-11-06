import { notFound } from "next/navigation";
import { BlogCover } from "@/components/blog-cover";
import { InteriorBreadcrumb, InteriorPage } from "@/components/interior";
import { ArticleByline, ArticleReading, EditorialMedia, RelatedReading } from "@/components/interior-editorial";
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
  const sections = splitArticleSections(article.contentHtml, ["related-paths"]);
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
    <InteriorPage>
      <article className="cw-shell cw-article">
        <InteriorBreadcrumb items={[{ label: "Blog", href: "/blog" }, { label: article.title }]} />
        <header className="cw-article-head">
          <span className="cw-label">Technical blog</span>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <ArticleByline label={article.authorId} publishedAt={article.publishedAt} long />
        </header>
        {article.imageUrl && <EditorialMedia><BlogCover key={article.imageUrl} src={article.imageUrl} alt={`Cover for ${article.title}`} eager /></EditorialMedia>}
        <ArticleReading sections={sections} supplements={[{ id: "related-paths", label: "Related technical paths", body: <RelatedReading items={technicalPaths} /> }]} />
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
    </InteriorPage>
  );
}
