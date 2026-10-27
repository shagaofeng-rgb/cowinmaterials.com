import { applicationPages, getProductFamilyPath, getProductPath, productFamilies, products } from "../data.ts";

const siteOrigin = "https://www.cowinmaterials.com";
const siteHosts = new Set(["cowinmaterials.com", "www.cowinmaterials.com"]);
const publicPaths = new Set([
  "/", "/about", "/applications", "/blog", "/case-studies", "/contact", "/cookie-notice",
  "/locations", "/news", "/privacy-policy", "/products", "/quality",
  "/request-quote", "/resources", "/search", "/terms-of-use",
  ...applicationPages.map((item) => `/applications/${item.slug}`),
  ...productFamilies.map(getProductFamilyPath),
  ...products.map(getProductPath),
]);

const aliases = new Map<string, string>([
  ["/contact-us", "/contact"],
  ["/technology", "/resources"],
  ["/technical-resources", "/resources"],
  ["/construction", "/resources#installation-guides"],
  ["/comparison", "/about"],
  ["/technical-data-sheet", "/resources#tds"],
  ["/products/aerogel-insulation", "/products"],
  ["/aerogel-insulation-materials", "/products"],
  ["/products/flame-retardant-aerogel-materials", "/products/fireproof-waterproof-solutions"],
  ["/products/flame-retardant-fireproof-insulation-coatings", "/products/fireproof-waterproof-solutions"],
  ["/flame-retardant-aerogel", "/products/fireproof-waterproof-solutions"],
  ["/heat-insulating-coatings", "/products/aerogel-slurries-coatings-paste"],
  ["/high-temperature-coatings", "/products/aerogel-slurries-coatings-paste"],
  ["/insulating-coatings", "/products/aerogel-slurries-coatings-paste"],
  ["/insulation-coatings", "/products/aerogel-slurries-coatings-paste"],
  ["/products/insulation-coatings", "/products/aerogel-slurries-coatings-paste"],
  ["/products/insulation-paint", "/products/aerogel-slurries-coatings-paste"],
  ["/products/heat-insulation-paint", "/products/aerogel-slurries-coatings-paste"],
  ["/insulation-solutions", "/applications"],
  ["/services", "/applications"],
  ["/high-temperature-insulation-solutions", "/applications/industrial-pipe-equipment-insulation"],
  ...products.map((product) => [`/products/${product.slug}`, getProductPath(product)] as const),
]);

function unwrapLink(value: string) {
  let href = value.trim();
  try {
    href = decodeURIComponent(href);
  } catch {
    return "";
  }

  const markdown = /^\[[^\]]+\]\(([^)]+)\)$/.exec(href);
  if (markdown) href = markdown[1].trim();
  else if (/^\[[^\]]+\]$/.test(href)) href = href.slice(1, -1);

  if (/^https?:\/[^/]/i.test(href)) href = href.replace(/^(https?):\//i, "$1://");
  if (/^(?:www\.)?cowinmaterials\.com(?:\/|$)/i.test(href)) href = `https://${href}`;
  return href;
}

export function normalizeBlogLinkHref(value: string): string | null {
  const href = unwrapLink(value);
  if (!href) return null;
  if (href.startsWith("#")) return href;
  if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(href)) return href;
  if (!href.startsWith("/") && !/^https?:\/\//i.test(href)) return null;

  let url: URL;
  try {
    url = new URL(href, siteOrigin);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!siteHosts.has(url.hostname.toLowerCase())) return url.toString();

  const path = url.pathname.replace(/\/$/, "") || "/";
  const canonical = aliases.get(path) || path;
  if (!publicPaths.has(canonical.split("#")[0])) return null;
  return `${canonical}${url.hash}`;
}
