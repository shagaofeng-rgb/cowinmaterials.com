import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { applicationPages, commonFaqs, products } from "@/lib/data";
import { getPublishedNews } from "@/lib/news/store";
import { absoluteUrl, createPageMetadata } from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return createPageMetadata({
      title: "Aerogel Product Not Found | Cowin Materials",
      description: "The requested aerogel product profile was not found.",
      path: "/products",
    });
  }

  return createPageMetadata({
    title: `${product.seoTitle} | Cowin Materials`,
    description: product.seoDescription,
    path: `/products/${product.slug}`,
    keywords: [product.name, product.category, product.code, "silica aerogel supplier"],
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedNews = await getPublishedNews({ pageSize: 3, productSlug: product.slug });

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: product.category,
    description: product.seoDescription,
    image: absoluteUrl(product.image),
    brand: {
      "@type": "Brand",
      name: "Cowin Materials",
    },
  };

  return (
    <>
      <Header />
      <main>
        <section className="product-hero">
          <div className="product-hero-copy">
            <Link className="back-link" href="/products">
              <ArrowLeft size={16} />
              Back to products
            </Link>
            <span className="product-code">{product.code}</span>
            <h1>{product.name}</h1>
            <p>{product.summary}</p>
            <div className="hero-actions">
              <Link className="primary-button" href={`/contact?request=Request%20TDS%20or%20SDS&product=${encodeURIComponent(product.name)}`}>
                Request TDS
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button" href={`/contact?request=Request%20a%20Sample&product=${encodeURIComponent(product.name)}`}>
                Request a Sample
              </Link>
              <Link className="secondary-button" href={`/contact?request=Request%20a%20Quote&product=${encodeURIComponent(product.name)}`}>
                Request a Quote
              </Link>
            </div>
          </div>
          <div className="product-visual">
            <Image src={product.image} alt={product.name} width={1100} height={760} priority />
          </div>
        </section>

        <section className="section product-detail-grid">
          <article>
            <h2>Technical Overview</h2>
            {product.detail.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="proof-note">Qualification note: {product.proof}</p>
          </article>

          <article>
            <h2>Key Metrics</h2>
            <ul className="metric-list">
              {product.metrics.map((metric) => (
                <li key={metric}>
                  <CheckCircle2 size={16} />
                  <span>{metric}</span>
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h2>Typical Applications</h2>
            <div className="chip-row">
              {product.applications.map((application) => (
                <span className="chip" key={application}>
                  {application}
                </span>
              ))}
            </div>
          </article>
        </section>

        <section className="section muted">
          <div className="product-detail-grid">
            <article>
              <h2>Key Benefits</h2>
              <ul className="metric-list">
                {[
                  "Supports product evaluation for defined operating conditions",
                  "Can be reviewed with applicable technical documents",
                  "Designed for application-specific material selection",
                ].map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
            <article>
              <h2>Technical Documents</h2>
              <div className="chip-row">
                {["Request TDS", "Request SDS", "Request Test Information", "Request Installation Guide"].map((item) => (
                  <Link className="chip" href={`/contact?request=${encodeURIComponent(item)}&product=${encodeURIComponent(product.name)}`} key={item}>
                    {item}
                  </Link>
                ))}
              </div>
            </article>
            <article>
              <h2>Related Applications</h2>
              <div className="chip-row">
                {applicationPages.slice(0, 3).map((item) => (
                  <Link className="chip" href={`/applications/${item.slug}`} key={item.slug}>
                    {item.shortTitle}
                  </Link>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="section">
          <h2>Product FAQ</h2>
          <div className="faq-list">
            {commonFaqs.map(([question, answer]) => (
              <article key={question}>
                <h2>{question}</h2>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </section>

        {relatedNews.articles.length ? (
          <section className="section muted">
            <h2>Related Industry News</h2>
            <div className="news-grid">
              {relatedNews.articles.map((article) => (
                <article className="news-card" key={article.slug}>
                  <div className="news-card-body">
                    <div className="news-meta">
                      <span>{article.source.publisher}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString("en")}</span>
                    </div>
                    <h2>
                      <Link href={`/news/${article.slug}`}>{article.title}</Link>
                    </h2>
                    <p>{article.excerpt}</p>
                    <Link className="text-link" href={`/news/${article.slug}`}>
                      Read brief
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="cta-section">
          <div>
            <span className="eyebrow">Qualification Step</span>
            <h2>Need a match for your substrate, temperature or test standard?</h2>
          </div>
          <Link className="primary-button" href="/contact">
            Send Project Details
            <ArrowRight size={18} />
          </Link>
        </section>

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
      </main>
      <Footer />
    </>
  );
}
