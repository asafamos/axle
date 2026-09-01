import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../free-scan/form";

export const metadata: Metadata = {
  title: "WordPress ADA compliance — make your site ADA / WCAG compliant",
  description:
    "How to make a WordPress site ADA compliant: scan for the WCAG 2.1 AA issues US courts use as the ADA standard with a free plugin, fix the source (not an overlay), and document conformance. Got a demand letter? Here's the fast, defensible path.",
  keywords: [
    "wordpress ada compliance",
    "make wordpress ada compliant",
    "wordpress ada website",
    "is my wordpress site ada compliant",
    "wordpress accessibility lawsuit",
    "ada compliance wordpress plugin",
    "wcag 2.1 aa wordpress",
    "axle",
  ],
  openGraph: {
    title: "WordPress ADA compliance — make your site ADA / WCAG compliant",
    description:
      "Scan the WCAG 2.1 AA issues courts use as the ADA standard, fix the source, document conformance. Free plugin + $19/mo fixes.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/wordpress-ada-compliance" },
};

const FAQ = [
  {
    q: "Does my WordPress site have to be ADA compliant?",
    a: "US courts apply ADA Title III to websites as 'places of public accommodation' and use WCAG 2.1 Level AA as the practical standard. There is no official government checklist, but WCAG 2.1 AA is what settlements, consent decrees, and expert witnesses reference. Businesses open to the public — retail, services, hospitality, healthcare — are the most frequent targets.",
  },
  {
    q: "What is the standard for ADA website compliance?",
    a: "WCAG 2.1 Level AA. It is the conformance level cited in the vast majority of ADA web settlements and the one the DOJ has pointed to. Meeting WCAG 2.1 AA (and ideally 2.2 AA) is the defensible target. An automated scan catches roughly 57% of issues; a human audit covers the rest.",
  },
  {
    q: "I received an ADA demand letter for my WordPress site — what do I do?",
    a: "Don't ignore it, and don't panic-buy an overlay widget (they don't resolve claims and can make you a repeat target). Scan your site to establish the actual issues, fix the serious violations, and document the remediation with dates. See the first-48-hours playbook for the full response, then keep a record of your conformance work.",
  },
  {
    q: "Is an accessibility overlay or plugin enough for ADA compliance?",
    a: "An overlay is not — the FTC fined the largest vendor $1M in 2025 and overlay sites are still sued. A scanning plugin that shows you real source-level fixes is the right tool: it finds the WCAG 2.1 AA violations courts care about so you can fix your theme and content, then document it.",
  },
];

export default function WordPressAdaCompliancePage() {
  const siteEnabled = Boolean(process.env.POLAR_PRODUCT_ID_SITE);
  const wpPluginUrl =
    "https://wordpress.org/plugins/asafamos-accessibility-scanner/";
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          WordPress · ADA Title III · WCAG 2.1 AA
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Make your WordPress site ADA compliant
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          US courts use WCAG 2.1 Level AA as the de-facto ADA standard for
          websites, and WordPress sites open to the public are among the most
          sued. The path is straightforward: scan for the violations that matter,
          fix the source, and document what you did — no overlay widget required.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={wpPluginUrl}
            target="_blank"
            rel="noopener"
            className="rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Install the free plugin →
          </a>
          {siteEnabled ? (
            <Link
              href="/pricing"
              className="rounded-md bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Get hosted fixes — $19/mo →
            </Link>
          ) : null}
        </div>

        <section className="mt-10 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">Got a demand letter?</h3>
          <p className="mt-2 text-sm text-amber-900">
            Act, but don&apos;t panic-buy an overlay. Scan first to see the real
            issues, fix the serious ones, and document the dates. The{" "}
            <Link href="/ada-demand-letter" className="underline">
              first-48-hours playbook
            </Link>{" "}
            walks through the exact response.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            The 3-step compliance path
          </h2>
          <ol className="mt-4 space-y-4 text-slate-700">
            <li>
              <strong>1. Scan for WCAG 2.1 AA violations.</strong> Install the{" "}
              <a href={wpPluginUrl} target="_blank" rel="noopener" className="underline">
                free plugin
              </a>{" "}
              and run it on your key templates — home, a product/service page,
              contact, and any form. It uses axe-core, the same engine plaintiff
              experts use.
            </li>
            <li>
              <strong>2. Fix the source.</strong> Resolve serious and critical
              issues in your theme and content. The axle Site plan ($19/mo)
              generates the code-level fix for each one if you don&apos;t have a
              developer.
            </li>
            <li>
              <strong>3. Document conformance.</strong> Keep dated scan reports
              and publish an{" "}
              <Link href="/statement" className="underline">
                accessibility statement
              </Link>
              . A documented remediation history is what defends you.
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Check your site now
          </h2>
          <p className="mt-3 text-slate-700">
            Enter your WordPress URL for a free WCAG 2.2 AA report — the fastest
            way to see where you stand.
          </p>
          <div className="mt-5 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
            <FreeScanForm />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            WordPress ADA compliance FAQ
          </h2>
          <div className="mt-5 space-y-4">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <summary className="cursor-pointer font-semibold text-slate-900">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Start your ADA remediation today
          </h2>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a
              href={wpPluginUrl}
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the free plugin →
            </a>
            {siteEnabled ? (
              <Link
                href="/pricing"
                className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                See axle Site — $19/mo →
              </Link>
            ) : null}
            <Link
              href="/woocommerce-accessibility"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              WooCommerce store? →
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 1 September 2026. Not legal advice.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
        </footer>
      </article>
    </main>
  );
}
