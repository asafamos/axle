import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "BFSG compliance for developers — EAA in Germany, what's required, penalties",
  description:
    "Germany's Barrierefreiheitsstärkungsgesetz (BFSG) transposes the EAA. Enforced 28 June 2025. Fines up to €100,000 per violation. Practical engineering guide for teams shipping to the DACH market.",
  keywords: [
    "BFSG",
    "Barrierefreiheitsstärkungsgesetz",
    "EAA Germany",
    "EU accessibility act Germany",
    "German accessibility law",
    "BITV 2.0",
    "WCAG 2.1 Germany",
    "axle",
  ],
  openGraph: {
    title: "BFSG (Germany) compliance for developers — a practical guide",
    description:
      "What German law requires, who it applies to, penalty structure, and how to build accessibility into your CI pipeline before an audit arrives.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/eaa-germany" },
};

export default function GermanyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Germany · BFSG compliance guide
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          BFSG compliance for developers (Germany)
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Germany transposed the European Accessibility Act through the{" "}
          <strong>Barrierefreiheitsstärkungsgesetz</strong> (BFSG — literally
          &quot;accessibility strengthening act&quot;). It became enforceable on{" "}
          <strong>28 June 2025</strong> and has some of the most muscular penalties
          in the EU — up to €100,000 per violation, with power for regulators to
          order a service offline. If your product reaches German consumers, this
          applies to you even if your company is based elsewhere.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">What the BFSG is</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">What it requires technically (BITV 2.0 / EN 301 549)</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties and enforcement</a></li>
            <li><a className="hover:underline" href="#monitoring">Monitoring body and reporting</a></li>
            <li><a className="hover:underline" href="#statement">German accessibility statement — what's required</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first approach</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">What the BFSG is</h2>
          <p className="mt-3 text-slate-700">
            The Barrierefreiheitsstärkungsgesetz was passed on 16 July 2021 and entered
            into force on 28 June 2025. It is the German implementation of Directive
            (EU) 2019/882 (the European Accessibility Act). The law references{" "}
            <strong>BITV 2.0</strong> (Barrierefreie-Informationstechnik-Verordnung)
            and, through it, <strong>EN 301 549</strong> — which incorporates WCAG 2.1
            Level AA as the baseline for web content.
          </p>
          <p className="mt-3 text-slate-700">
            Unlike the public-sector-only BITV 2.0 that preceded it, the BFSG extends
            the same obligations to <strong>private-sector operators</strong> that sell
            to consumers. That is the major shift.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services providing to German consumers include:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce (§1 BFSG) — online stores, marketplaces, booking services.</li>
            <li>Consumer-facing banking and financial services.</li>
            <li>E-book services and e-readers.</li>
            <li>Electronic communications services (messaging, telephony, emergency communication).</li>
            <li>Transportation ticketing and scheduling services.</li>
            <li>Consumer-facing computer hardware, operating systems, and terminal devices.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption (§3 BFSG):</strong> companies with fewer
            than 10 employees and annual turnover / balance sheet total below €2 million
            that provide services are exempt from service obligations. <em>Product</em>{" "}
            manufacturers do not get this exemption.
          </p>
          <p className="mt-3 text-slate-700">
            <strong>Non-German companies are in scope</strong> if they make services
            available to consumers in Germany. A U.S. SaaS accepting German signups, or
            an Israeli e-commerce site shipping to Germany, is subject to the BFSG.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            What it requires technically
          </h2>
          <p className="mt-3 text-slate-700">
            The BFSG references BITV 2.0, which in turn references EN 301 549 — which
            incorporates WCAG 2.1 Level AA for the web. Practically that means:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Perceivable</strong>: text alternatives for non-text content, captions for pre-recorded audio-visual, sufficient colour contrast (4.5:1 for body text).</li>
            <li><strong>Operable</strong>: all functionality keyboard-reachable, no time limits on core interactions, no content that flashes more than three times per second.</li>
            <li><strong>Understandable</strong>: page language declared (<code>&lt;html lang=&quot;de&quot;&gt;</code>), consistent navigation, clear form error messages.</li>
            <li><strong>Robust</strong>: valid HTML, compatible with assistive technology, ARIA semantics that match the DOM.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            EN 301 549 also covers mobile applications and authoring tools, not just
            websites — important if you ship a native iOS / Android app alongside your
            web product.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Penalties and enforcement
          </h2>
          <p className="mt-3 text-slate-700">
            §37 BFSG (<em>Bußgeldvorschriften</em>) sets out fines for administrative
            offences. Key figures:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Up to <strong>€100,000 per violation</strong> for failing to provide accessible services or misrepresenting conformity.</li>
            <li>Up to <strong>€10,000</strong> for lesser failures (e.g., missing accessibility statement, delayed response to consumer complaints).</li>
            <li>The regulator can issue a <strong>service-prohibition order</strong> — taking your service offline — for persistent non-compliance.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Complaints can be filed with the market surveillance authority in the
            Bundesland where the service is offered, and by recognised consumer
            associations (<em>Verbraucherverbände</em>) under §33 BFSG. The
            association-standing provision means a single non-compliant product can
            attract a coordinated complaint campaign — which is how overlay-widget
            users have historically been hit hardest.
          </p>
        </section>

        <section id="monitoring" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Monitoring body and reporting
          </h2>
          <p className="mt-3 text-slate-700">
            Market surveillance is coordinated by the <strong>Marktüberwachungsbehörden
            der Länder</strong> (state market surveillance authorities). The{" "}
            <strong>Bundesfachstelle für Barrierefreiheit</strong>, attached to the
            Federal Ministry of Labour, publishes guidance and consumer tools.
            Consumers and recognised associations can submit complaints both to the
            provider directly and — if the provider fails to respond — to the
            surveillance authority.
          </p>
          <p className="mt-3 text-slate-700">
            You have an obligation under §4 BFSG to publish an{" "}
            <strong>Erklärung zur Barrierefreiheit</strong> (accessibility statement).
            That statement must itself be accessible, must be published in German, and
            must include a contact channel for users to report accessibility barriers.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            German accessibility statement — what&apos;s required
          </h2>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status (fully / partially / not) with BITV 2.0 / EN 301 549.</li>
            <li>List of non-accessible content and the reason (disproportionate burden, exemption, or in-progress remediation with target date).</li>
            <li>Named contact for accessibility feedback — email address plus, ideally, phone.</li>
            <li>Enforcement procedure: which market surveillance authority applies and how users can escalate.</li>
            <li>How conformance was assessed (self-assessment, third-party audit, or both — with date).</li>
            <li>Date the statement was last prepared or reviewed.</li>
            <li>The statement itself must be accessible — not a PDF-only or image-based version.</li>
          </ol>
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            axle&apos;s statement generator is currently Hebrew-first (for Israeli תקנה 35).{" "}
            <strong>A German Erklärung template is on the Team plan roadmap.</strong>{" "}
            Until then, the generated English structure matches EN 301 549&apos;s
            required fields — you can translate to German and have a native speaker
            review.
          </p>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — a CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Baseline scan.</strong> Run axe-core 4.11 against your main
              entry points (landing, checkout, account). A typical site has 30-80
              violations on first scan.
            </li>
            <li>
              <strong>Fix at the source.</strong> Edit templates, not runtime
              overlays. The BFSG looks at the served HTML, not what JavaScript does
              after load.
            </li>
            <li>
              <strong>Put accessibility in CI.</strong> Every pull request should
              fail when severity-serious violations appear. This is what keeps the
              site compliant between audits.
            </li>
            <li>
              <strong>Commission one human audit per year.</strong> axe-core
              catches ~57% of WCAG issues; cognitive load, screen-reader flow, and
              video captioning need human review.
            </li>
            <li>
              <strong>Publish the Erklärung zur Barrierefreiheit.</strong> Include
              the state market surveillance authority&apos;s contact for your
              Bundesland, and a named accessibility officer for feedback.
            </li>
            <li>
              <strong>Retain evidence.</strong> Save scan reports and PR review
              trails. When a consumer association complains, your documented
              good-faith effort is the core of the defence.
            </li>
          </ol>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Install the GitHub Action →
            </a>
            <Link
              href="/statement"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Accessibility statement generator
            </Link>
            <Link
              href="/guides/eaa-2025"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              ← EU-wide EAA overview
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> This guide is written for engineering teams.
            It is <em>not</em> legal advice. For specific exposure under BFSG, consult
            an attorney admitted in Germany. Penalty figures cited are statutory
            maximums — actual fines depend on case specifics, severity, and intent.
          </p>
          <p className="mt-3">
            Updated: 21 April 2026. Revised when statutes or enforcement guidance
            change. Factual corrections welcome:{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>
            .
          </p>
        </footer>
      </article>
    </main>
  );
}
