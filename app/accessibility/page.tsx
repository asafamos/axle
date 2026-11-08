import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description:
    "How accessible axlescan.com is, how we test it, the problems we already know about, and how to tell us about one we missed.",
  alternates: { canonical: "/accessibility" },
};

// Utility classes are spelled out here instead of `prose`, so this page keeps a
// light surface and readable text in dark mode regardless of the typography plugin.
const h2 = "mt-10 text-xl font-semibold text-slate-900";
const p = "mt-3 leading-relaxed text-slate-700";
const ul = "mt-3 list-disc space-y-2 pl-6 leading-relaxed text-slate-700";
const link = "font-medium text-emerald-700 underline hover:text-emerald-900";

export default function AccessibilityStatementPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Accessibility statement
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Last updated: 8 November 2026
        </p>

        <p className={p}>
          axle sells accessibility tooling, so this site should be accessible
          to the people who use it. This statement covers{" "}
          <code className="rounded bg-slate-200 px-1 py-0.5 text-sm text-slate-900">
            axlescan.com
          </code>
          : the marketing and documentation pages, the free scanner and the
          statement generator.
        </p>

        <h2 className={h2}>Conformance status</h2>
        <p className={p}>
          We aim to meet{" "}
          <a className={link} href="https://www.w3.org/TR/WCAG22/">
            WCAG 2.2 level AA
          </a>
          . We describe our status as{" "}
          <strong>partially conformant, self-assessed</strong>. Every page in
          our sitemap passes our automated checks (see below), but automated
          checks find only part of the real issues, we have not had this site
          audited by an independent party, and we know of the gaps listed
          further down.
        </p>

        <h2 className={h2}>How we test</h2>
        <ul className={ul}>
          <li>
            <strong>Every night</strong>, and on pull requests, we scan the
            pages of our sitemap with axle itself (axe-core against WCAG 2.0,
            2.1 and 2.2 A and AA rules). A page with a serious or critical
            finding fails the check.
          </li>
          <li>
            Automated tools detect only around half of WCAG issues. A clean
            scan is therefore evidence, not proof, and it is the reason we
            call our status partial.
          </li>
          <li>
            We have not commissioned an independent audit and do not currently
            publish a manual screen-reader test report.
          </li>
        </ul>

        <h2 className={h2}>Known limitations</h2>
        <p className={p}>
          These are problems we are aware of. We list them so you do not have
          to find them yourself.
        </p>
        <ul className={ul}>
          <li>
            There is no &ldquo;skip to main content&rdquo; link. Keyboard and
            screen-reader users have to pass the page header and navigation
            before the main content (WCAG 2.4.1).
          </li>
          <li>
            The URL field on the home page and the email field in the
            lead-capture box show focus mainly by changing the border colour.
            The change is visible but subtle, and we intend to add a stronger
            focus ring (WCAG 2.4.7).
          </li>
          <li>
            The loading spinner and the pulsing status dot keep animating when
            a visitor has asked their system for reduced motion. They are
            small and decorative, but they should respect that setting.
          </li>
          <li>
            Checkout and subscription management are hosted by our payment
            provider, Polar, at{" "}
            <code className="rounded bg-slate-200 px-1 py-0.5 text-sm text-slate-900">
              polar.sh
            </code>
            . We do not control the accessibility of those pages.
          </li>
        </ul>

        <h2 className={h2}>Technical basis</h2>
        <p className={p}>
          The site relies on HTML, CSS and JavaScript (built with Next.js). Our
          automated checks run in Chromium. If something works in one browser
          and not another, tell us which.
        </p>

        <h2 className={h2}>Feedback and contact</h2>
        <p className={p}>
          If you cannot use part of this site, or find content you cannot
          read, tell us at{" "}
          <a className={link} href="mailto:info@axlescan.com">
            info@axlescan.com
          </a>
          . Please include the page address, what you were trying to do and,
          if you can, the browser and assistive technology you use. We aim to
          reply within five business days and to tell you what we will do
          about it.
        </p>
        <p className={p}>
          If you are not satisfied with our answer, you may contact the
          accessibility or consumer-protection authority in your country.
        </p>

        <h2 className={h2}>Related</h2>
        <p className={p}>
          axle provides remediation assistance and does not issue compliance
          certificates. If you need an accessibility statement for your own
          site, the{" "}
          <Link className={link} href="/statement">
            free statement generator
          </Link>{" "}
          (Hebrew, regulation 35) is available.
        </p>
      </article>
    </main>
  );
}
