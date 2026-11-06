"use client";

import { useState } from "react";

export function BlogCover({ src, alt, eager = false }: { src: string; alt: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  // The publishing webhook supports HTTPS image URLs from arbitrary hosts.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} />;
}
