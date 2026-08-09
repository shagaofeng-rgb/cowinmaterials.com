type DetailPageNavItem = {
  href: string;
  label: string;
};

type DetailPageNavProps = {
  items: DetailPageNavItem[];
};

export function DetailPageNav({ items }: DetailPageNavProps) {
  return (
    <>
      <nav className="detail-page-nav" aria-label="On this page">
        <span>On this page</span>
        {items.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
      </nav>
      <details className="detail-page-nav-mobile">
        <summary>On this page</summary>
        <nav aria-label="On this page">
          {items.map((item) => <a href={item.href} key={item.href}>{item.label}</a>)}
        </nav>
      </details>
    </>
  );
}
