import Image from "next/image";
import { notFound } from "next/navigation";
import { Rss } from "lucide-react";
import { InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { EditorialCard } from "@/components/interior-editorial";
import { Pagination } from "@/components/pagination";
import { getProductPath, products } from "@/lib/data";
import { getPublishedNews } from "@/lib/news/store";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
type NewsPageProps = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: NewsPageProps) {
  const page = validPage((await searchParams).page);
  const { total } = await getPublishedNews({ page: 1, pageSize: 1 });
  if (page > Math.max(1, Math.ceil(total / 9))) notFound();
  return createPageMetadata({ title: page > 1 ? `Aerogel Industry News - Page ${page} | Cowin Materials` : "Aerogel Industry News and Technical Notes | Cowin Materials", description: "Evidence-backed technical notes and source-linked industry briefs on silica aerogel insulation, thermal barriers, coatings and waterproofing materials.", path: page > 1 ? `/news?page=${page}` : "/news", keywords: ["aerogel news", "silica aerogel insulation", "battery thermal barrier news"] });
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const page = validPage((await searchParams).page);
  const news = await getPublishedNews({ page, pageSize: 9 });
  if (page > Math.max(1, Math.ceil(news.total / news.pageSize))) notFound();
  return (
    <InteriorPage>
      <InteriorHeading title="News and technical notes" crumbs={[{ label: "News" }]} description="Cowin Materials technical notes and source-linked industry briefs on aerogel, thermal barriers and functional coatings." action={<a className="cw-button cw-button--secondary" href="/news/rss.xml"><Rss size={17} aria-hidden="true" />RSS feed</a>} />
      <section className="cw-shell cw-listing" aria-label="News and technical notes">
        {news.articles.length ? (
          <>
            <div className="cw-editorial-grid">
              {news.articles.map((article) => (
                <EditorialCard
                  key={article.slug}
                  href={`/news/${article.slug}`}
                  title={article.title}
                  excerpt={article.excerpt}
                  label={article.originType === "first_party_technical_note" ? "Technical note" : `Industry brief · ${article.source.publisher}`}
                  publishedAt={article.publishedAt}
                  cover={<Image src={article.image.url} alt={article.image.alt} fill sizes="(max-width: 767px) calc(100vw - 36px), (max-width: 1099px) 46vw, 410px" />}
                >
                  <div className="cw-editorial-related">
                    {article.relatedProducts.slice(0, 2).map((product) => <InteriorLink key={product.slug} href={getProductPath(products.find((item) => item.slug === product.slug) || product)}>{product.name}</InteriorLink>)}
                  </div>
                </EditorialCard>
              ))}
            </div>
            <Pagination currentPage={news.page} totalItems={news.total} pageSize={news.pageSize} pathname="/news" label="News articles" />
          </>
        ) : (
          <div className="cw-empty"><h2>No published news or technical notes</h2><p>Browse product documents and application guidance in our technical resources.</p><InteriorLink href="/resources">Browse technical resources</InteriorLink></div>
        )}
      </section>
    </InteriorPage>
  );
}

function validPage(value?: string) {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) notFound();
  const page = Number(value);
  if (!Number.isSafeInteger(page)) notFound();
  return page;
}
