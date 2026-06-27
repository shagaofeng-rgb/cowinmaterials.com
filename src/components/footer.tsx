import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { megaMenus, navItems, seoTopics, site } from "@/lib/data";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <span className="brand-mark">CM</span>
            <span>
              <strong>{site.legalName}</strong>
              <em>{site.tagline}</em>
            </span>
          </div>
          <p>
            Silica aerogel materials for thermal insulation, fire protection, waterproofing
            and battery thermal-management projects.
          </p>
        </div>

        <div>
          <h2>Navigation</h2>
          <div className="footer-links">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2>Product Lines</h2>
          <div className="footer-links">
            {megaMenus.Products.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2>Contact</h2>
          <ul className="contact-list">
            <li>
              <Phone size={16} />
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </li>
            <li>
              <Mail size={16} />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
            <li>
              <MapPin size={16} />
              <span>{site.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="seo-keywords" aria-label="Core SEO topics">
        {seoTopics.map((topic) => (
          <span key={topic}>{topic}</span>
        ))}
      </div>

      <div className="footer-bottom">
        <span>© 2026 {site.legalName}</span>
        <span>Silica aerogel material systems for global technical buyers and engineering projects.</span>
      </div>
    </footer>
  );
}
