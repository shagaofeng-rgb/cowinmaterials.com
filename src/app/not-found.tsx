import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <section className="page-hero compact">
          <div className="section-heading">
            <span>404</span>
            <h1>Page Not Found</h1>
            <p>The page may have moved. You can continue with products, applications or a project enquiry.</p>
          </div>
          <div className="hero-actions">
            <Link className="primary-button" href="/products">
              Explore Products
              <ArrowRight size={18} />
            </Link>
            <Link className="secondary-button" href="/contact">
              Contact Cowin Materials
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
