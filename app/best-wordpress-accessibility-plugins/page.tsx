import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Best WordPress accessibility plugins (2026) — an honest comparison",
  description:
    "A fair comparison of WordPress accessibility plugins: scanners that find and fix real WCAG / ADA issues (Equalize Digital, WP Accessibility, axle) vs. overlay widgets (UserWay, accessiBe, One Click) that don't. Which to pick, and why overlays are a legal risk.",
  keywords: [
    "best wordpress accessibility plugin",
    "best wordpress accessibility plugins",
    "wordpress accessibility plugin comparison",
    "free wordpress accessibility plugin",
    "wordpress accessibility checker plugin",
    "wordpress wcag plugin",
    "accessibility plugin vs overlay",
    "axle",
  ],
  openGraph: {
    title: "Best WordPress accessibility plugins (2026) — an honest comparison",
    description:
      "Scanners that fix the source (Equalize Digital, WP Accessibility, axle) vs. overlay widgets (UserWay, accessiBe) that don't. An honest map of the category.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/best-wordpress-accessibility-plugins" },
};

const FAQ = [
  {
    q: "What is the best free WordPress accessibility plugin?",
    a: "For finding real issues, the strongest free options are scanner-type plugins: Equalize Digital Accessibility Checker (scans posts/pages in the editor), WP Accessibility by Joe Dolan (adds targeted fixes and tools), and AsafAmos Accessibility Scanner / axle (runs axe-core in wp-admin, privately). All three are free and, importantly, none inject an overlay widget. The right pick depends on whether you want in-editor checks (Equalize Digital), ready-made fixes (WP Accessibility), or a private scan plus optional AI-generated code fixes (axle).",
  },
  {
    q: "Are accessibility overlay plugins (UserWay, accessiBe, One Click) any good?",
    a: "They're the most heavily marketed but the least effective for real compliance. Overlays layer JavaScript on top of your existing HTML instead of fixing it; screen-reader users widely reject them, and the FTC fined accessiBe $1M in 2025 for deceptive claims. Sites using overlays still get sued. If your goal is actual WCAG conformance (not just a badge), choose a scanner that fixes the source.",
  },
  {
    q: "Does a WordPress accessibility plugin make me ADA / WCAG compliant on its own?",
    a: "No plugin makes you fully compliant automatically — automated tools catch roughly 57% of WCAG issues. A scanner finds the machine-detectable problems fast; you (or a fix service) resolve them in the theme and content; and a human audit covers the rest. A plugin is the essential first layer, not the whole answer.",
  },
  {
    q: "What makes axle different from other WordPress accessibility plugins?",
    a: "axle's free plugin scans like the others (axe-core, no overlay, private), but its optional Site plan ($19/mo) actually generates the code-level fix for each violation — most plugins only tell you what's wrong. That's the difference between a report and a resolution, aimed at owners without a developer. axle is also newer with fewer reviews than the established plugins, so weigh that too.",
  },
];

type Row = {
  name: string;
  approach: string;
  free: string;
  fixesSource: string;
  autoFix: string;
  noOverlay: string;
};

const ROWS: Row[] = [
  {
    name: "AsafAmos Accessibility Scanner (axle)",
    approach: "Scanner (axe-core)",
    free: "Yes",
    fixesSource: "Shows + optional AI fix",
    autoFix: "Yes ($19/mo)",
    noOverlay: "Yes",
  },
  {
    name: "Equalize Digital Accessibility Checker",
    approach: "Scanner (in-editor)",
    free: "Yes (+ premium)",
    fixesSource: "Shows",
    autoFix: "No",
    noOverlay: "Yes",
  },
  {
    name: "WP Accessibility (Joe Dolan)",
    approach: "Targeted fixes + tools",
    free: "Yes",
    fixesSource: "Applies some fixes",
    autoFix: "Partial",
    noOverlay: "Yes",
  },
  {
    name: "One Click Accessibility",
    approach: "Toolbar / widget",
    free: "Yes",
    fixesSource: "No",
    autoFix: "No",
    noOverlay: "No (adds a widget)",
  },
  {
    name: "UserWay / accessiBe",
    approach: "Overlay widget",
    free: "Freemium",
    fixesSource: "No",
    autoFix: "No",
    noOverlay: "No (overlay)",
  },
];

export default function BestWordPressAccessibilityPluginsPage() {
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
          WordPress · accessibility plugins · honest comparison
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          The best WordPress accessibility plugins
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          There are two very different kinds of &ldquo;accessibility plugin,&rdquo; and
          the distinction decides whether you actually become compliant or just
          think you did. Here&apos;s an honest map of the category — including
          where our own tool, axle, genuinely fits and where it doesn&apos;t.
        </p>

        <div className="mt-6 rounded-lg border-l-4 border-slate-400 bg-white p-4 text-sm text-slate-600">
          <strong>Full disclosure:</strong> we make axle (the AsafAmos
          Accessibility Scanner). We&apos;ve tried to describe the alternatives
          fairly — several are excellent — because a rigged comparison helps no
          one. Verify current features and prices yourself before choosing.
        </div>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Two philosophies: scan-and-fix vs. overlay
          </h2>
          <p className="mt-3 text-slate-700">
            <strong>Scanners</strong> find the real WCAG / ADA problems in your
            HTML so you (or a fix tool) can correct the source. <strong>Overlay
            widgets</strong> inject JavaScript on top of broken markup — they add
            a floating &ldquo;accessibility button&rdquo; but don&apos;t fix the
            underlying issues. Overlays are heavily marketed and the least
            effective: the FTC fined accessiBe $1M in 2025, and sites using
            overlays are still sued. <strong>Choose a scanner.</strong>
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Comparison at a glance
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500">
                  <th className="py-2 pe-3 font-semibold">Plugin</th>
                  <th className="py-2 pe-3 font-semibold">Approach</th>
                  <th className="py-2 pe-3 font-semibold">Free</th>
                  <th className="py-2 pe-3 font-semibold">Generates fixes</th>
                  <th className="py-2 font-semibold">No overlay</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((r) => (
                  <tr key={r.name} className="border-b border-slate-200 align-top">
                    <td className="py-2 pe-3 font-medium text-slate-900">{r.name}</td>
                    <td className="py-2 pe-3 text-slate-700">{r.approach}</td>
                    <td className="py-2 pe-3 text-slate-700">{r.free}</td>
                    <td className="py-2 pe-3 text-slate-700">{r.autoFix}</td>
                    <td className="py-2 text-slate-700">{r.noOverlay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Categories, not endorsements. Equalize Digital and WP Accessibility
            are well-regarded, established tools; axle is newer with fewer
            reviews. Features change — check each plugin&apos;s current listing.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Which should you pick?</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Want in-editor checks as you write?</strong> Equalize
              Digital Accessibility Checker flags issues per post/page.
            </li>
            <li>
              <strong>Want ready-made fixes &amp; tools?</strong> WP Accessibility
              (Joe Dolan) is a long-standing, respected free plugin.
            </li>
            <li>
              <strong>Want a private scan plus the fixes written for you?</strong>{" "}
              axle scans with axe-core in wp-admin (nothing leaves your server),
              and its $19/mo Site plan generates the code-level fix for each
              violation — useful if you don&apos;t have a developer.
            </li>
            <li>
              <strong>Considering an overlay (UserWay, accessiBe, One Click)?</strong>{" "}
              Don&apos;t — it won&apos;t make you compliant and raises your legal
              risk. See{" "}
              <Link href="/why-not-overlay" className="underline">
                why overlays don&apos;t work
              </Link>
              .
            </li>
          </ul>
        </section>

        <section className="mt-10 rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <h2 className="text-xl font-bold text-emerald-900">Try axle free</h2>
          <p className="mt-2 text-sm text-emerald-900">
            Install the free scanner, run it on any page, and see your real WCAG
            issues in a minute. Add the $19/mo Site plan only if you want the
            fixes generated for you.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={wpPluginUrl}
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the free plugin →
            </a>
            <Link
              href="/wordpress-accessibility"
              className="rounded-md border border-emerald-300 bg-white px-5 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
            >
              WordPress accessibility guide
            </Link>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
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

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Related</h2>
          <ul className="mt-3 list-disc space-y-1 ps-6 text-slate-700">
            <li>
              <Link href="/wordpress-accessibility" className="underline">
                WordPress accessibility guide
              </Link>
            </li>
            <li>
              <Link href="/woocommerce-accessibility" className="underline">
                WooCommerce accessibility
              </Link>
            </li>
            <li>
              <Link href="/wordpress-ada-compliance" className="underline">
                WordPress ADA compliance
              </Link>
            </li>
          </ul>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 19 September 2026. Made by the axle team; comparisons are our
          honest read of the category, not endorsements.{" "}
          <a className="underline" href="mailto:asaf@amoss.co.il">
            asaf@amoss.co.il
          </a>
        </footer>
      </article>
    </main>
  );
}
