import Link from "next/link";
import { ChevronDown, FileText } from "lucide-react";
import type { ReactNode } from "react";
import { InteriorLink } from "@/components/interior";
import type { ArticleSection } from "@/lib/article-sections";

export function ArticleByline({ label, publishedAt, long = false }: { label: string; publishedAt: string; long?: boolean }) {
  return (
    <div className="cw-byline">
      <span>{label}</span>
      <time dateTime={publishedAt}>{new Intl.DateTimeFormat("en", { dateStyle: long ? "long" : "medium", timeZone: "UTC" }).format(new Date(publishedAt))}</time>
    </div>
  );
}

export function EditorialMedia({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="cw-editorial-figure">
      <div className="cw-editorial-media"><FileText size={30} aria-hidden="true" />{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export function EditorialCard({ href, title, excerpt, label, publishedAt, cover, children }: {
  href: string;
  title: string;
  excerpt: string;
  label: string;
  publishedAt: string;
  cover?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <article className="cw-editorial-card">
      {cover && <EditorialMedia>{cover}</EditorialMedia>}
      <div className="cw-editorial-card-body">
        <ArticleByline label={label} publishedAt={publishedAt} />
        <h2><Link href={href}>{title}</Link></h2>
        <p>{excerpt}</p>
        {children}
      </div>
    </article>
  );
}

type SectionLink = { id: string; label: string };
type Supplement = SectionLink & { body: ReactNode };

export function ContentsNavigation({ entries }: { entries: readonly SectionLink[] }) {
  const links = <ol>{entries.map(({ id, label }) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol>;
  return (
    <nav className="cw-contents" aria-label="On this page">
      <div className="cw-contents-desktop"><strong>On this page</strong>{links}</div>
      <details className="cw-contents-mobile"><summary>On this page <ChevronDown size={16} aria-hidden="true" /></summary>{links}</details>
    </nav>
  );
}

export function ArticleReading({ sections, supplements }: { sections: ArticleSection[]; supplements: Supplement[] }) {
  const showContents = sections.length >= 3;
  return (
    <div className={`cw-reading-layout${showContents ? "" : " cw-reading-layout--single"}`}>
      {showContents && <ContentsNavigation entries={[...sections, ...supplements]} />}
      <div className="cw-prose">
        {sections.map(({ id, label, html }) => (
          <section id={id} key={id}>
            {id !== "article" && <h2>{label}</h2>}
            <div className="cw-article-html" dangerouslySetInnerHTML={{ __html: html }} />
          </section>
        ))}
        {supplements.map(({ id, label, body }) => <section id={id} key={id}><h2>{label}</h2>{body}</section>)}
      </div>
    </div>
  );
}

export function RelatedReading({ items }: { items: readonly { href: string; label: string; note: string }[] }) {
  return (
    <ul className="cw-related">
      {items.map(({ href, label, note }) => <li key={href}><InteriorLink href={href}>{label}</InteriorLink><p>{note}</p></li>)}
    </ul>
  );
}
