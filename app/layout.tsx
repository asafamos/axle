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
        <UtmTracker />
        {children}
      </body>
    </html>
  );
}
