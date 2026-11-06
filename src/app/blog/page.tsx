import { notFound } from "next/navigation";
import { BlogCover } from "@/components/blog-cover";
import { InteriorHeading, InteriorLink, InteriorPage } from "@/components/interior";
import { EditorialCard } from "@/components/interior-editorial";
import { Pagination } from "@/components/pagination";
import { getPublishedBlogPage } from "@/lib/blog/store";
import { createPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type BlogPageProps = { searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const page = validPage((await searchParams).page);
  const { total } = await getPublishedBlogPage({ page: 1, pageSize: 1 });
  if (page > Math.max(1, Math.ceil(total / 9))) notFound();
  return createPageMetadata({
    title: page > 1 ? `Aerogel Technical Blog - Page ${page} | Cowin Materials` : "Aerogel Technical Blog | Cowin Materials",
    description: "Technical articles about silica aerogel insulation, fire protection, waterproofing and thermal-management applications.",
    path: page > 1 ? `/blog?page=${page}` : "/blog",
    keywords: ["aerogel blog", "silica aerogel technical articles", "industrial insulation guidance"],
    index: total > 0,
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = validPage((await searchParams).page);
  const result = await getPublishedBlogPage({ page, pageSize: 9 });
  if (page > Math.max(1, Math.ceil(result.total / result.pageSize))) notFound();
  return (
    <InteriorPage>
      <InteriorHeading title="Technical blog" crumbs={[{ label: "Blog" }]} description="Application notes, specification guidance and material selection for industrial projects." />
      <section className="cw-shell cw-listing" aria-label="Blog articles">
        {result.articles.length ? (
          <>
            <div className="cw-editorial-grid">
              {result.articles.map((article) => (
                <EditorialCard
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  title={article.title}
                  label={article.authorId}
                  publishedAt={article.publishedAt}
                  excerpt={article.excerpt}
                  cover={article.imageUrl ? <BlogCover key={article.imageUrl} src={article.imageUrl} alt={`Cover for ${article.title}`} /> : undefined}
                />
              ))}
            </div>
            <Pagination currentPage={result.page} totalItems={result.total} pageSize={result.pageSize} pathname="/blog" label="Blog articles" />
          </>
        ) : (
          <div className="cw-empty"><h2>No published articles</h2><p>For product data and installation guidance, see our technical resources.</p><InteriorLink href="/resources">Browse technical resources</InteriorLink></div>
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
