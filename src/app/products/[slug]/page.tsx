import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { products } from "@/lib/data";
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    category: product.category,
    description: product.seoDescription,
    image: absoluteUrl(product.image),
    brand: {
      "@type": "Brand",
      name: "Cowin Materials",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Quzhou Qiying Import & Export Co., Ltd.",
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
              <Link className="primary-button" href="/contact">
                Request Data Sheet
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button" href="/technology">
                View Test Data
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
            <p className="proof-note">{product.proof}</p>
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
