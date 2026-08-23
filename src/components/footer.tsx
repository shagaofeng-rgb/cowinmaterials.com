import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { getProductFamilyPath, navItems, productFamilies, site } from "@/lib/data";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">
            <Image
              className="brand-logo"
              src="/brand/cowin-cy-logo.png"
              alt=""
              width={48}
              height={48}
            />
            <span>
              <strong>{site.name}</strong>
              <em>{site.tagline}</em>
            </span>
          </div>
          <p>Operated by {site.legalName}</p>
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
            <Link href="/news">News</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/locations">Locations</Link>
            <Link href="/search">Search</Link>
          </div>
        </div>

        <div>
          <h2>Product Lines</h2>
          <div className="footer-links">
            {productFamilies.map((family) => (
              <Link key={family.slug} href={getProductFamilyPath(family)}>
                {family.title}
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
              <span><strong>Office:</strong> {site.officeAddress}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 {site.legalName}</span>
        <span>
          <Link href="/privacy-policy">Privacy Policy</Link>
          {" · "}
          <Link href="/terms-of-use">Terms of Use</Link>
          {" · "}
          <Link href="/cookie-notice">Cookie Notice</Link>
        </span>
      </div>
    </footer>
  );
}
