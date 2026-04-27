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

// axle.dev was the originally-planned brand domain but was never registered
// (DNS doesn't resolve as of 2026-04-27). Fall back to the live deployment so
// canonical / OG / sitemap still produce valid URLs even if NEXT_PUBLIC_SITE_URL
// is somehow unset at build time.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "axle — a11y / WCAG 2.2 AA accessibility CI for every PR",
    template: "%s · axle",
  },
  description:
    "a11y CI for the modern web: scan every PR for WCAG 2.1 / 2.2 AA violations with axe-core, generate real code fixes via Claude, produce lawyer-ready audit artifacts. Built for EAA 2025, ADA Title III, Section 508, and Israeli תקנה 35. Not an overlay widget.",
  keywords: [
    "a11y",
    "accessibility",
    "WCAG",
    "WCAG 2.2",
    "WCAG 2.2 AA",
    "a11y CI",
    "a11y testing",
    "accessibility CI",
    "accessibility testing",
    "axe-core",
    "axe",
    "EAA",
    "EAA 2025",
    "EAA compliance",
    "ADA",
    "ADA compliance",
    "ADA Title III",
    "Section 508",
    "EN 301 549",
    "GitHub Action",
    "pull request accessibility",
    "Hebrew accessibility statement",
    "תקנה 35",
    "הצהרת נגישות",
  ],
  applicationName: "axle",
  authors: [{ name: "axle" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "axle",
    title: "axle — a11y / WCAG 2.2 AA accessibility CI for every PR",
    description:
      "Ship accessible code, automatically. Every PR scanned for a11y / WCAG violations, real source-code fixes proposed via Claude, lawyer-ready artifacts included.",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "axle — a11y / WCAG 2.2 AA accessibility CI for every PR",
    description:
      "Ship accessible code, automatically. Every PR scanned for a11y / WCAG violations, real source-code fixes proposed via Claude.",
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
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is axle and how is it different from an accessibility overlay widget?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "axle is a compliance CI: it scans every pull request for WCAG 2.1/2.2 AA violations using axe-core 4.11, then proposes source-code fix diffs via Claude Sonnet inside the PR comment. It never injects JavaScript into the served page — the opposite of an overlay widget. Overlay widgets (accessiBe, UserWay, AudioEye) inject runtime ARIA over broken HTML; that approach cost accessiBe a $1M FTC settlement in January 2025 and does not satisfy EAA 2025 or EN 301 549, which evaluate the served HTML.",
          },
        },
        {
          "@type": "Question",
          name: "Is axle compliant with EAA 2025, ADA, and Israeli תקנה 35?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "axle is a tool for teams seeking compliance with those regulations. It uses axe-core 4.11 which evaluates EN 301 549 / WCAG 2.1 AA — the technical standard all three regulations reference. axle produces the artifacts regulators look for (scan reports as audit trail, a published accessibility statement URL, a named accessibility contact). axle is not a compliance certificate; automated checks catch roughly 57% of WCAG issues and a human audit is still recommended for full conformance.",
          },
        },
        {
          "@type": "Question",
          name: "How much does axle cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Open plan is free forever: unlimited scans on one repository, PR comments, public badge, Hebrew statement generator, and bring-your-own Anthropic API key for AI fixes. Team plan is $49/month: hosted AI fixes, up to 10 repos, multi-language statements, published verified statement URL. Business plan is $299/month: unlimited repos, full EU-language statement pack, SLA support. No seat counts on any plan.",
          },
        },
        {
          "@type": "Question",
          name: "Where does axle run — is it a SaaS I need to sign up for?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "axle ships as a GitHub Action, an npm CLI (axle-cli), and plugins for Netlify, Cloudflare Pages, Vercel, and WordPress. For the free tier and CI pipelines, scans run on your own infrastructure (GitHub runner, Netlify build, etc.) using the open-source axe-core engine — no signup. The hosted service at axle-iota.vercel.app is optional and only involved if you use the web scan form, paid AI fixes, or the published verified statement URL feature.",
          },
        },
        {
          "@type": "Question",
          name: "Does axle support Hebrew accessibility statements for Israeli תקנה 35?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Yes. The Hebrew statement generator at axle-iota.vercel.app/statement runs locally in your browser and produces a statement aligned with Israeli regulation 35(ד). No signup, no upload — the form stays on your device. For compliance officers, the Team plan adds a published verified URL (axle-iota.vercel.app/s/<id>) that is tamper-evident and timestamped for use in disclosure documents.",
          },
        },
        {
          "@type": "Question",
          name: "What's the difference between axle's GitHub Action and the npm CLI?",
          acceptedAnswer: {
            "@type": "Answer",
            text:
              "Same axe-core engine, different delivery surface. The GitHub Action integrates directly into PR workflows, adds a sticky PR comment, and fails the check when violations cross the threshold. The npm CLI (axle-cli) runs anywhere Node.js runs — local dev, other CI systems (GitLab, Jenkins, CircleCI), cron jobs, or manual scans. Output format is identical JSON + markdown between them.",
          },
        },
      ],
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
