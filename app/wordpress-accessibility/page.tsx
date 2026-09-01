import type { Metadata } from "next";
import Link from "next/link";
import FreeScanForm from "../free-scan/form";

export const metadata: Metadata = {
  title:
    "WordPress accessibility — scan & fix WCAG / ADA issues (free plugin)",
  description:
    "Make your WordPress site accessible: scan for WCAG 2.1 / 2.2 AA and ADA issues with the free axe-core plugin, then get AI-generated code fixes for one site from $19/mo — no developer, no overlay widget. Built for EAA 2025, ADA Title III, and Israeli תקנה 35.",
  keywords: [
    "wordpress accessibility",
    "wordpress accessibility plugin",
    "wordpress accessibility checker",
    "wordpress ada compliance",
    "wordpress wcag compliance",
    "make wordpress accessible",
    "wordpress accessibility scanner",
    "woocommerce accessibility",
    "wordpress eaa 2025",
    "axle",
  ],
  openGraph: {
    title:
      "WordPress accessibility — scan & fix WCAG / ADA issues (free plugin)",
    description:
      "Free WordPress accessibility scanner (axe-core), plus $19/mo hosted AI fixes for one site. No code, no overlay. EAA 2025 / ADA ready.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/wordpress-accessibility" },
};

const FAQ = [
  {
    q: "How do I make my WordPress site accessible?",
    a: "Install the free AsafAmos Accessibility Scanner plugin, run a scan of any page from your WP admin, and fix the WCAG 2.1 / 2.2 AA violations it reports. The scan runs privately in your browser using axe-core — nothing is sent anywhere. For code-level fixes generated for you, the axle Site plan ($19/mo) turns each violation into a ready-to-apply fix without you or a developer writing the code.",
  },
  {
    q: "Is there a free WordPress accessibility plugin?",
    a: "Yes. The AsafAmos Accessibility Scanner plugin is free on WordPress.org — unlimited scans, full per-rule report, no signup. It uses axe-core 4.11, the same engine plaintiff-firm scanners use. The optional $19/mo Site plan adds hosted AI fixes on top of the free scanning.",
  },
  {
    q: "Do accessibility overlay widgets make WordPress ADA compliant?",
    a: "No. Overlay widgets inject JavaScript on top of broken HTML and do not fix the underlying issues; the FTC fined the largest overlay vendor $1M in January 2025, and thousands of ADA lawsuits have named sites that use them. Real compliance means fixing the source. This plugin shows you exactly what to fix and never injects anything for your visitors.",
  },
  {
    q: "Does my WordPress site have to comply with the EAA or ADA?",
    a: "If you sell into the EU, the European Accessibility Act (in force June 2025) requires WCAG 2.1 AA. In the US, courts apply WCAG 2.1 AA as the de-facto ADA Title III standard, with 4,000+ web-accessibility lawsuits per year. Israeli sites must meet תקנה 35. Automated scanning is the fast, cheap first layer for all three.",
  },
];

export default function WordPressAccessibilityPage() {
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
      {/* FAQ structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          WordPress · accessibility · WCAG 2.2 AA · ADA · EAA 2025
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          WordPress accessibility, done properly
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Scan your WordPress site for WCAG 2.1 / 2.2 AA and ADA accessibility
          issues with a free plugin, then get real code-level fixes — no
          developer, no overlay widget, no monthly agency retainer. Built for
          the EAA 2025, ADA Title III, and Israeli תקנה 35.
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

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Scan any URL free — no plugin, no signup
          </h2>
          <p className="mt-3 text-slate-700">
            Want to see what&apos;s wrong before you install anything? Enter your
            WordPress URL and get the full WCAG 2.2 AA report by email in a few
            minutes.
          </p>
          <div className="mt-5 rounded-lg border border-emerald-200 bg-white p-6 shadow-sm">
            <FreeScanForm />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            How it works on WordPress
          </h2>
          <ol className="mt-4 space-y-4 text-slate-700">
            <li>
              <strong>1. Install the free plugin.</strong> The{" "}
              <a href={wpPluginUrl} target="_blank" rel="noopener" className="underline">
                AsafAmos Accessibility Scanner
              </a>{" "}
              runs axe-core 4.11 privately inside your WP admin — works with any
              theme, page builder (Elementor, Divi, Gutenberg), WooCommerce, and
              caching plugin. Nothing leaves your server.
            </li>
            <li>
              <strong>2. Scan and see every violation.</strong> Grouped by
              severity (critical / serious / moderate / minor), each linked to
              the rule so you know exactly what&apos;s wrong.
            </li>
            <li>
              <strong>3. Get the fixes (optional, $19/mo).</strong> The axle
              Site plan generates a code-level fix for each violation — no
              developer or API key of your own — so a non-technical site owner
              can actually ship compliance for one site.
            </li>
          </ol>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who this is for</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>WordPress site owners</strong> who got an ADA demand
              letter or an EAA deadline and don&apos;t have a developer on call.
            </li>
            <li>
              <strong>WooCommerce stores</strong> selling into the EU or US,
              where an inaccessible checkout is a direct legal and revenue risk.
            </li>
            <li>
              <strong>Agencies &amp; freelancers</strong> who need a defensible
              accessibility status before handing a client site back.
            </li>
            <li>
              <strong>Anyone told to &ldquo;add an accessibility widget&rdquo;</strong>{" "}
              — and who wants a real fix instead of a lawsuit magnet.
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border-l-4 border-amber-400 bg-amber-50 p-5">
          <h3 className="font-semibold text-amber-900">
            Why not an accessibility overlay widget?
          </h3>
          <p className="mt-2 text-sm text-amber-900">
            Overlays (accessiBe, UserWay, AudioEye and similar) layer JavaScript
            over broken markup. They don&apos;t fix the HTML, screen-reader users
            widely reject them, and the FTC fined the largest vendor $1M in
            January 2025. axle never injects anything into your live site — it
            shows you the source-level fix. Compare:{" "}
            <Link href="/alternatives/accessibe" className="underline">
              accessiBe
            </Link>
            ,{" "}
            <Link href="/alternatives/userway" className="underline">
              UserWay
            </Link>
            ,{" "}
            <Link href="/alternatives/audioeye" className="underline">
              AudioEye
            </Link>
            .
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            WordPress accessibility FAQ
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
            Make your WordPress site accessible this week
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Start free — install the plugin and scan. Upgrade to hosted fixes
            only if you want the code written for you.
          </p>
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
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Generate accessibility statement
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 26 August 2026.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
        </footer>
      </article>
    </main>
  );
}
