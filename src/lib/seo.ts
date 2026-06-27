import type { Metadata } from "next";
import { products, site } from "@/lib/data";

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.cowinmaterials.com";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path,
  keywords = [],
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: `${site.name} | ${site.tagline}`,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.legalName,
  alternateName: site.name,
  url: siteUrl,
  email: site.email,
  telephone: site.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Room 110, 1st Floor, Building 2, Qushidai Future Building, Kecheng District",
    addressLocality: "Quzhou City",
    addressRegion: "Zhejiang Province",
    addressCountry: "CN",
  },
  areaServed: ["Global", "Asia", "Europe", "North America", "Middle East"],
  knowsAbout: [
    "Silica aerogel",
    "Aerogel insulation coating",
    "Aerogel fireproof coating",
    "Penetrating water repellent",
    "Industrial thermal insulation",
    "EV battery thermal barriers",
  ],
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: `${site.name} ${site.tagline}`,
  url: siteUrl,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: site.legalName,
  },
};

export const productListJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Cowin Materials silica aerogel product portfolio",
  itemListElement: products.map((product, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absoluteUrl(`/products/${product.slug}`),
    name: product.name,
  })),
};
