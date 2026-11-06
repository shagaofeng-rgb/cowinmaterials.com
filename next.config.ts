import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [
      {
        source: "/images/home/lab-hero-:variant-v1.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/images/home/app-card-:variant-v1.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Content-Security-Policy-Report-Only", value: "default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src https://www.google.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/api/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "Cache-Control", value: "no-store" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/technology", destination: "/resources", permanent: true },
      { source: "/technical-resources", destination: "/resources", permanent: true },
      { source: "/construction", destination: "/resources#installation-guides", permanent: true },
      { source: "/comparison", destination: "/about", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/technical-data-sheet", destination: "/resources#tds", permanent: true },
      { source: "/products/aerogel-powder-and-slurry", destination: "/products/aerogel-powders-granules/aerogel-powder-and-slurry", permanent: true },
      { source: "/products/aerogel-blanket-and-thermal-pads", destination: "/products/aerogel-blankets-felts-mats/aerogel-blanket-and-thermal-pads", permanent: true },
      { source: "/products/battery-thermal-pads", destination: "/products/aerogel-blankets-felts-mats/battery-thermal-pads", permanent: true },
      { source: "/products/aerogel-insulation-coating", destination: "/products/aerogel-slurries-coatings-paste/aerogel-insulation-coating", permanent: true },
      { source: "/products/industrial-aerogel-insulation-coating", destination: "/products/aerogel-slurries-coatings-paste/industrial-aerogel-insulation-coating", permanent: true },
      { source: "/products/aerogel-paste-compound", destination: "/products/aerogel-slurries-coatings-paste/aerogel-paste-compound", permanent: true },
      { source: "/products/aerogel-fireproof-coating", destination: "/products/fireproof-waterproof-solutions/aerogel-fireproof-coating", permanent: true },
      { source: "/products/non-intumescent-fire-protection-coating", destination: "/products/fireproof-waterproof-solutions/non-intumescent-fire-protection-coating", permanent: true },
      { source: "/products/silicon-penetrating-water-repellent", destination: "/products/fireproof-waterproof-solutions/silicon-penetrating-water-repellent", permanent: true },
    ];
  },
};

export default nextConfig;
