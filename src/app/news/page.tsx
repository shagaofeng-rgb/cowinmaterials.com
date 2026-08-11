import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Rss } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getProductPath, products } from "@/lib/data";
import { getPublishedNews } from "@/lib/news/store";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = createPageMetadata({ title: "Aerogel Industry News and Technical Insights | Cowin Materials", description: "Source-linked industry briefs on silica aerogel insulation, battery thermal barriers, fire protection coatings and waterproofing material trends.", path: "/news", keywords: ["aerogel news", "silica aerogel insulation", "battery thermal barrier news"] });

export default async function NewsPage() {
  const news = await getPublishedNews({ pageSize: 12 });
  return <><Header /><main>
    <section className="subpage-hero news-hero"><span className="eyebrow">News & Technical Insights</span><h1>Aerogel industry signals for technical buyers</h1><p>Automatically published source-linked briefs connect recent industry developments with material-evaluation context. Each item records its original source and relevant product areas.</p><div className="hero-actions"><Link className="primary-button" href="/news/rss.xml">RSS feed <Rss size={18} /></Link><Link className="secondary-button" href="/products">Browse products</Link></div></section>
    <section className="section">{news.articles.length ? <div className="news-grid">{news.articles.map((article) => <article className="news-card" key={article.slug}><Link href={`/news/${article.slug}`} className="news-image"><Image src={article.image.url} alt={article.image.alt} width={720} height={430} /></Link><div className="news-card-body"><div className="news-meta"><span>{article.source.publisher}</span><span><CalendarDays size={14} />{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(article.publishedAt))}</span></div><h2><Link href={`/news/${article.slug}`}>{article.title}</Link></h2><p>{article.excerpt}</p><div className="chip-row">{article.relatedProducts.slice(0, 2).map((product) => <Link className="chip" href={getProductPath(products.find((item) => item.slug === product.slug) || product)} key={product.slug}>{product.name}</Link>)}</div><Link className="text-link" href={`/news/${article.slug}`}>Read brief <ArrowRight size={16} /></Link></div></article>)}</div> : <div className="empty-state-panel"><span className="eyebrow">News feed active</span><h2>Waiting for a new source that meets the publication rules.</h2><p>News items publish directly only after freshness, product-relevance and duplicate checks have passed.</p><Link className="primary-button" href="/resources">View technical resources <ArrowRight size={18} /></Link></div>}</section>
  </main><Footer /></>;
}
