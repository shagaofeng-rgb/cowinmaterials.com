import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { applicationPages } from "@/lib/data";
import { createPageMetadata } from "@/lib/seo";

type ApplicationPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return applicationPages.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ApplicationPageProps) {
  const { slug } = await params;
  const page = applicationPages.find((item) => item.slug === slug);

  if (!page) {
    return createPageMetadata({
      title: "Application Not Found | Cowin Materials",
      description: "The requested Cowin Materials application page was not found.",
      path: "/applications",
    });
  }

  return createPageMetadata({
    title: `${page.shortTitle} Solutions | Cowin Materials`,
    description: page.intro,
    path: `/applications/${page.slug}`,
    keywords: [page.shortTitle, "aerogel application", "Cowin Materials"],
  });
}

export default async function ApplicationDetailPage({ params }: ApplicationPageProps) {
  const { slug } = await params;
  const page = applicationPages.find((item) => item.slug === slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <section className="product-hero">
          <div className="product-hero-copy">
            <span className="eyebrow">Application Solution</span>
            <h1>{page.title}</h1>
            <p>{page.intro}</p>
            <div className="hero-actions">
              <Link className="primary-button" href={`/contact?application=${encodeURIComponent(page.shortTitle)}`}>
                Request a Project Review
                <ArrowRight size={18} />
              </Link>
              <Link className="secondary-button" href="/technical-resources">
                View Technical Resources
              </Link>
            </div>
          </div>
          <div className="product-visual">
            <Image src={page.image} alt={page.title} width={1100} height={760} priority />
          </div>
        </section>

        <section className="section product-detail-grid">
          <article>
            <h2>Common Project Challenges</h2>
            <ul className="metric-list">
              {page.challenges.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
          <article>
            <h2>Recommended Products</h2>
            <div className="chip-row">
              {page.products.map((item) => (
                <span className="chip" key={item}>{item}</span>
              ))}
            </div>
          </article>
          <article>
            <h2>Project Information Required</h2>
            <ul className="metric-list">
              {page.requiredInfo.map((item) => (
                <li key={item}>
                  <CheckCircle2 size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="section muted">
          <div className="qualification-panel">
            <h2>Selection Notes</h2>
            <p>
              Final product selection depends on the operating conditions, installation
              method, substrate condition, required thickness and applicable project
              standard. Cowin Materials can provide applicable technical documents during
              evaluation.
            </p>
            <div className="chip-row">
              {page.considerations.map((item) => (
                <span className="chip" key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
