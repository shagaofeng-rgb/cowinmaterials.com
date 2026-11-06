import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, CircleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

type Crumb = { label: string; href?: string };

export function InteriorPage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <><Header /><main className={`cw-interior ${className}`}>{children}</main><Footer /></>;
}

export function InteriorBreadcrumb({ items, includeHome = true }: { items: Crumb[]; includeHome?: boolean }) {
  return <div className="cw-crumbs"><Breadcrumbs items={includeHome ? [{ label: "Home", href: "/" }, ...items] : items} /></div>;
}

export function InteriorHeading({ title, description, crumbs, action }: {
  title: string;
  description?: string;
  crumbs?: Crumb[];
  action?: ReactNode;
}) {
  return (
    <header className="cw-shell cw-page-heading">
      <InteriorBreadcrumb items={crumbs || [{ label: title }]} />
      <div className="cw-heading-row">
        <div><h1>{title}</h1>{description && <p>{description}</p>}</div>
        {action}
      </div>
    </header>
  );
}

export function InteriorLink({ href, children, variant = "text" }: {
  href: string;
  children: ReactNode;
  variant?: "text" | "primary" | "secondary";
}) {
  return (
    <Link className={variant === "text" ? "cw-text-link" : `cw-button cw-button--${variant}`} href={href}>
      {children}{variant !== "secondary" && <ArrowRight size={16} aria-hidden="true" />}
    </Link>
  );
}

export function InteriorCTA({ title, description, href, label }: {
  title: string;
  description?: string;
  href: string;
  label: string;
}) {
  return (
    <section className="cw-cta">
      <div className="cw-shell cw-cta-row">
        <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
        <InteriorLink href={href} variant="primary">{label}</InteriorLink>
      </div>
    </section>
  );
}

export type MaterialVisual = { src: string; alt: string; caption: string; fit?: "contain" | "cover" };

export function MaterialFigure({ visual, eager = false }: { visual: MaterialVisual; eager?: boolean }) {
  return (
    <figure className="cw-figure">
      <div className={`cw-figure-media${visual.fit === "cover" ? " cw-figure-media--cover" : ""}`}>
        <Image
          src={visual.src}
          alt={visual.alt}
          fill
          sizes="(max-width: 767px) calc(100vw - 36px), (max-width: 1287px) 42vw, 480px"
          preload={eager}
        />
      </div>
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}

export function EvidenceTable({ columns, rows, caption }: {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
  caption: string;
}) {
  return (
    <table className={`cw-evidence-table${columns.length === 3 ? " cw-evidence-table--triple" : ""}`} role="table">
      <caption className="sr-only">{caption}</caption>
      <thead role="rowgroup"><tr role="row">{columns.map((label) => <th key={label} scope="col" role="columnheader">{label}</th>)}</tr></thead>
      <tbody role="rowgroup">
        {rows.map(([label, ...values]) => (
          <tr key={label} role="row">
            <th scope="row" role="rowheader">{label}</th>
            {values.map((value, index) => <td key={columns[index + 1]} role="cell"><span className="cw-mobile-column" aria-hidden="true">{columns[index + 1]}</span>{value}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function ScopeNote({ children }: { children: ReactNode }) {
  return <aside className="cw-scope-note"><CircleAlert size={17} aria-hidden="true" /><p>{children}</p></aside>;
}

export function InteriorFaq({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <div className="cw-faq">
      {items.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}<ChevronDown size={17} aria-hidden="true" /></summary>
          <p>{answer}</p>
        </details>
      ))}
    </div>
  );
}

export function ProcessList({ steps }: { steps: readonly { title: string; text: string }[] }) {
  return (
    <ol className="cw-process">
      {steps.map((step, index) => (
        <li key={step.title}>
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div><h3>{step.title}</h3><p>{step.text}</p></div>
        </li>
      ))}
    </ol>
  );
}
