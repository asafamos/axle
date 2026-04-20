import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UtmTracker } from "./utm-tracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axle.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "axle — accessibility compliance CI",
    template: "%s · axle",
  },
  description:
    "Continuous WCAG 2.1 / 2.2 AA compliance for the modern web. Scan every PR, generate real code fixes with Claude, produce lawyer-ready audit artifacts. Built for EAA 2025, ADA, and Israeli equality regs. No overlay widgets.",
  keywords: [
    "accessibility",
    "WCAG",
    "EAA compliance",
    "ADA",
    "a11y CI",
    "GitHub Action",
    "axe-core",
    "Hebrew accessibility statement",
    "הצהרת נגישות",
  ],
  applicationName: "axle",
  authors: [{ name: "axle" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "axle",
    title: "axle — accessibility compliance CI",
    description:
      "Ship accessible code, automatically. Every PR scanned, real fixes proposed, lawyer-ready artifacts included.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "axle — accessibility compliance CI",
    description:
      "Ship accessible code, automatically. Every PR scanned, real fixes proposed, lawyer-ready artifacts included.",
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: SITE_URL,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "axle",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Cross-platform",
      url: SITE_URL,
      description:
        "Continuous WCAG 2.1 / 2.2 AA accessibility compliance for modern web apps. GitHub Action, npm CLI, Netlify, Cloudflare Pages and Vercel plugins scan every PR and propose source-code fixes via Claude. Built for EAA 2025, ADA, and Israeli תקנה 35.",
      offers: [
        {
          "@type": "Offer",
          name: "Open",
          price: "0",
          priceCurrency: "USD",
          description: "Unlimited scans on 1 repo, PR comments, public badge, Hebrew statement generator, BYO Anthropic key.",
        },
        {
          "@type": "Offer",
          name: "Team",
          price: "49",
          priceCurrency: "USD",
          description: "Hosted AI fixes, up to 10 repos, trend history, multi-language statements.",
        },
        {
          "@type": "Offer",
          name: "Business",
          price: "299",
          priceCurrency: "USD",
          description: "Unlimited repos, full EAA language pack, SLA support.",
        },
      ],
      featureList: [
        "WCAG 2.1 / 2.2 AA scanning via axe-core 4.11",
        "Claude Sonnet code-fix diffs in PR comments",
        "GitHub Action, npm CLI, Netlify, Cloudflare Pages, Vercel plugins",
        "Hebrew + EAA accessibility statement generator",
        "No runtime overlay widget injection",
      ],
    },
    {
      "@type": "Organization",
      name: "axle",
      url: SITE_URL,
      logo: `${SITE_URL}/opengraph-image`,
    },
  ],
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
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <UtmTracker />
        {children}
      </body>
    </html>
  );
}
