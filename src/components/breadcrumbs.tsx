import Link from "next/link";

type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
          {index < items.length - 1 ? <span className="breadcrumb-separator" aria-hidden="true">/</span> : null}
        </span>
      ))}
    </nav>
  );
}
