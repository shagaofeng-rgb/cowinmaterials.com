import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ruitai Jiuhe | Silica Aerogel Insulation Coatings and Material Systems",
    template: "%s",
  },
  description:
    "Shanghai Ruitai Jiuhe supplies silica aerogel insulation coatings, fireproof coatings, aerogel blankets, thermal pads and penetrating water repellents for global B2B projects.",
  applicationName: "Ruitai Jiuhe Aerogel Materials",
  category: "Industrial materials",
  creator: "Shanghai Ruitai Jiuhe High-tech Materials Co., Ltd.",
  publisher: "Shanghai Ruitai Jiuhe High-tech Materials Co., Ltd.",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
