import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cowin Materials",
    short_name: "Cowin",
    description: "Silica aerogel materials, insulation and functional coating systems.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#0b75c9",
    icons: [
      {
        src: "/brand/cowin-cy-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
