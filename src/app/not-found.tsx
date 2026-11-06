import type { Metadata } from "next";
import { FileQuestion } from "lucide-react";
import { InteriorLink, InteriorPage } from "@/components/interior";

export const metadata: Metadata = {
  title: "Page Not Found | Cowin Materials",
  description: "The requested Cowin Materials page could not be found.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <InteriorPage>
      <section className="cw-shell cw-message">
        <FileQuestion size={32} aria-hidden="true" />
        <span className="cw-label">404</span>
        <h1>Page not found</h1>
        <p>The page may have moved or is no longer available.</p>
        <div className="cw-actions"><InteriorLink href="/products" variant="primary">Explore products</InteriorLink><InteriorLink href="/search" variant="secondary">Search the site</InteriorLink></div>
        <InteriorLink href="/contact">Contact Cowin Materials</InteriorLink>
      </section>
    </InteriorPage>
  );
}
