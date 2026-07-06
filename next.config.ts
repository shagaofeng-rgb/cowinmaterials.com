import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/technology", destination: "/technical-resources", permanent: true },
      { source: "/construction", destination: "/technical-resources#installation-guides", permanent: true },
      { source: "/comparison", destination: "/about", permanent: true },
    ];
  },
};

export default nextConfig;
