import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { AnalyticsEvents } from "@/components/analytics-events";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { organizationJsonLd, siteUrl, websiteJsonLd } from "@/lib/seo";
import "./globals.css";
import "./interior.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const configuredGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const gaMeasurementId = configuredGaId && /^G-[A-Z0-9]+$/.test(configuredGaId) ? configuredGaId : null;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aerogel Materials, Insulation and Coating Systems | Cowin Materials",
    template: "%s",
  },
  description:
    "Cowin Materials supplies silica aerogel powder, insulation blankets, thermal barrier materials and functional coating systems for industrial and construction applications.",
  applicationName: "Cowin Materials Aerogel Materials",
  category: "Industrial materials",
  creator: "Quzhou Qiying Import & Export Co., Ltd.",
  publisher: "Quzhou Qiying Import & Export Co., Ltd.",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "256x256" },
    ],
    shortcut: "/icon.png",
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        <WhatsAppFloat />
        <AnalyticsEvents />
        {gaMeasurementId ? (
          <Script id="ga4-bootstrap" strategy="afterInteractive">{`if (navigator.globalPrivacyControl !== true && navigator.doNotTrack !== '1' && !location.pathname.startsWith('/admin')) { window.dataLayer = window.dataLayer || []; window.gtag = function(){dataLayer.push(arguments);}; gtag('js', new Date()); gtag('config', '${gaMeasurementId}', { anonymize_ip: true }); const ga = document.createElement('script'); ga.async = true; ga.src = 'https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}'; document.head.appendChild(ga); }`}</Script>
        ) : null}
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
