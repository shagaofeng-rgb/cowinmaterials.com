import Image from "next/image";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { InteriorBreadcrumb, InteriorPage } from "@/components/interior";
import { ArticleByline, ArticleReading, EditorialMedia, RelatedReading } from "@/components/interior-editorial";
import { getProductPath, products } from "@/lib/data";
import { getPublishedNewsBySlug } from "@/lib/news/store";
import { splitArticleSections } from "@/lib/article-sections";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const article = await getPublishedNewsBySlug((await params).slug);
  return article
    ? createPageMetadata({ title: article.seoTitle, description: article.seoDescription, path: `/news/${article.slug}`, keywords: [article.primaryKeyword || "aerogel news", ...article.secondaryKeywords], index: article.indexable })
    : createPageMetadata({ title: "News Brief Not Found | Cowin Materials", description: "The requested Cowin Materials news brief was not found.", path: "/news", index: false });
}

export default async function NewsDetailPage({ params }: Props) {
  const article = await getPublishedNewsBySlug((await params).slug);
  if (!article) notFound();
  const sections = splitArticleSections(article.contentHtml, ["related-products", "source"]);
  const isTechnicalNote = article.originType === "first_party_technical_note";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": isTechnicalNote ? "Article" : "NewsArticle",
    headline: article.title,
    description: article.seoDescription,
    image: [article.image.url],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: article.authorName },
    publisher: { "@type": "Organization", name: "Cowin Materials" },
    mainEntityOfPage: absoluteUrl(`/news/${article.slug}`),
    ...(isTechnicalNote ? {} : { isBasedOn: { "@type": "CreativeWork", name: article.source.title, url: article.source.url, publisher: article.source.publisher, datePublished: article.source.publishedAt } }),
  };
  const breadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "News", item: absoluteUrl("/news") },
      { "@type": "ListItem", position: 3, name: article.title, item: absoluteUrl(`/news/${article.slug}`) },
    ],
  };
  const related = article.relatedProducts.map((product) => ({
    href: getProductPath(products.find((item) => item.slug === product.slug) || product),
    label: product.name,
    note: product.relationshipReason,
  }));
  return (
    <InteriorPage>
      <article className="cw-shell cw-article">
        <InteriorBreadcrumb items={[{ label: "News", href: "/news" }, { label: article.title }]} />
        <header className="cw-article-head">
          <span className="cw-label">{isTechnicalNote ? "Technical note" : "Industry brief"} · {article.category}</span>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <ArticleByline label={isTechnicalNote ? article.authorName : article.source.publisher} publishedAt={article.publishedAt} long />
        </header>
        <EditorialMedia caption="Editorial illustration for technical context. See the source record below for the scope of the information.">
          <Image src={article.image.url} alt={article.image.alt} fill sizes="(max-width: 767px) calc(100vw - 36px), 900px" preload />
        </EditorialMedia>
        <ArticleReading sections={sections} supplements={[
          {
            id: "source",
            label: isTechnicalNote ? "Evidence record" : "Source record",
            body: <dl className="cw-source">
              {isTechnicalNote ? <>
                <div><dt>Evidence source</dt><dd>{article.technicalSource?.label || article.source.title}</dd></div>
                {article.technicalSource?.locator && <div><dt>Source locator</dt><dd>{article.technicalSource.locator}</dd></div>}
                {article.technicalSource?.reportNumber && <div><dt>Report number</dt><dd>{article.technicalSource.reportNumber}</dd></div>}
                <div><dt>Publication scope</dt><dd>Source-recorded technical data with stated conditions and limits; not a project qualification or certificate.</dd></div>
              </> : <>
                <div><dt>Original source</dt><dd><a href={article.source.url} target="_blank" rel="nofollow noopener">{article.source.title} <ExternalLink size={14} aria-hidden="true" /></a></dd></div>
                <div><dt>Source published</dt><dd><time dateTime={article.source.publishedAt}>{new Date(article.source.publishedAt).toISOString().slice(0, 10)}</time></dd></div>
              </>}
              <div><dt>Published by Cowin Materials</dt><dd><time dateTime={article.publishedAt}>{new Date(article.publishedAt).toISOString().slice(0, 10)}</time></dd></div>
            </dl>,
          },
          ...(related.length ? [{ id: "related-products", label: "Related material systems", body: <RelatedReading items={related} /> }] : []),
        ]} />
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }} />
    </InteriorPage>
  );
}
