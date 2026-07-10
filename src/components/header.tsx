"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { megaMenus, navItems, site } from "@/lib/data";

const menuLabels = new Set(["Products", "Applications", "Technical Resources"]);

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <>
      <header className="site-header">
        <div className="top-strip">
          <span>Global aerogel material systems from Quzhou, Zhejiang, China</span>
          <a href={`mailto:${site.email}`}>
            <Mail size={14} />
            {site.email}
          </a>
        </div>

        <div className="nav-shell">
          <Link className="brand" href="/" aria-label="Cowin Materials homepage">
            <span className="brand-mark">CM</span>
            <span>
              <strong>{site.name}</strong>
              <em>{site.tagline}</em>
            </span>
          </Link>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => {
            const resourceMenu = item.label === "Technical Resources" ? megaMenus.Resources : null;
            const productMenu = item.label === "Products" ? megaMenus.Products : null;
            const applicationMenu = item.label === "Applications" ? megaMenus.Applications : null;
            const menu = productMenu ?? applicationMenu ?? resourceMenu;

            return (
              <div
                className={activeMenu === item.label ? "nav-cluster open" : "nav-cluster"}
                key={item.href}
                onMouseEnter={() => setActiveMenu(menu ? item.label : null)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link
                  className={pathname === item.href ? "nav-link active" : "nav-link"}
                  href={item.href}
                  onFocus={() => setActiveMenu(menu ? item.label : null)}
                  onBlur={() => setActiveMenu(null)}
                >
                  {item.label}
                  {menu || menuLabels.has(item.label) ? <ChevronDown size={14} /> : null}
                </Link>
                {menu ? (
                  <div className="mega-menu">
                    {menu.map((entry) => (
                      <Link key={entry.href} href={entry.href}>
                        <strong>{entry.label}</strong>
                        <span>{entry.note}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <Link className="header-cta" href="/contact">
          Request Data Sheet
        </Link>

        <button
          className="mobile-menu-button"
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        </div>

        {open ? (
          <div className="mobile-panel" id="mobile-navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                className={pathname === item.href ? "mobile-link active" : "mobile-link"}
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link className="mobile-cta" href="/contact" onClick={() => setOpen(false)}>
              Request Technical Data
            </Link>
          </div>
        ) : null}
      </header>
      <div className="mobile-sticky-cta" aria-label="Mobile quick actions">
        <Link href="/contact?request=Request%20a%20Quote">Request a Quote</Link>
        <Link href="/contact?request=Ask%20for%20Product%20Selection">Ask an Engineer</Link>
      </div>
    </>
  );
}
