import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
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
