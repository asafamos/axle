import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "EAA 2025 compliance for developers — what's required, who's affected, how to audit",
  description:
    "The European Accessibility Act has been enforceable since 28 June 2025. Penalties reach 4% of global revenue in some member states. Practical guide for engineering teams: scope, technical requirements, CI pipeline, and accessibility statement.",
  keywords: [
    "EAA 2025",
    "European Accessibility Act",
    "WCAG 2.1 AA compliance",
    "accessibility CI",
    "accessibility statement EU",
    "EN 301 549",
    "digital accessibility Europe",
    "axle",
  ],
  openGraph: {
    title: "EAA 2025 compliance for developers — the practical guide",
    description:
      "What the European Accessibility Act requires, who it affects, and how to build accessibility into your CI pipeline before the next demand letter arrives.",
    type: "article",
    locale: "en_US",
  },
  alternates: { canonical: "/guides/eaa-2025" },
};

export default function EaaGuidePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Europe · Compliance guide
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA 2025 compliance for developers
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          The European Accessibility Act (Directive (EU) 2019/882) became
          enforceable across all 27 EU member states on <strong>28 June 2025</strong>.
          This guide explains what the law actually requires in engineering
          terms — not marketing terms — and shows you how to put it in a CI
          pipeline before the demand letters arrive.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Contents
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li>
              <a className="hover:underline" href="#what">
                What EAA 2025 is (in plain English)
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#who">
                Who it applies to
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#what-required">
                Technical requirements — EN 301 549 / WCAG 2.1 AA
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#penalties">
                Penalties and enforcement (by member state)
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#overlays">
                Why accessibility overlay widgets don&apos;t protect you
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#how">
                How to comply — a six-step process
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#statement">
                Accessibility statement — what the EAA requires
              </a>
            </li>
            <li>
              <a className="hover:underline" href="#axle">
                How axle helps
              </a>
            </li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            What EAA 2025 is (in plain English)
          </h2>
          <p className="mt-3 text-slate-700">
            The European Accessibility Act (Directive (EU) 2019/882) is the EU&apos;s
            unified accessibility law for digital products and services. It
            replaces a fragmented patchwork of national rules with one standard
            across the EU single market. Member states had until 28 June 2022
            to transpose it into national law; the act then became enforceable
            against private-sector operators on <strong>28 June 2025</strong>.
          </p>
          <p className="mt-3 text-slate-700">
            Unlike the ADA in the U.S., the EAA doesn&apos;t wait for courts to
            decide what &quot;accessible&quot; means — it points at{" "}
            <strong>EN 301 549</strong>, the European accessibility standard,
            which in turn incorporates <strong>WCAG 2.1 Level AA</strong>{" "}
            as the baseline for web content. WCAG 2.2 AA has been added in
            the most recent revision (EN 301 549 v3.2.1).
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Who it applies to
          </h2>
          <p className="mt-3 text-slate-700">
            The EAA applies to <strong>private-sector</strong> operators
            providing any of the following to consumers in the EU:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              E-commerce: online stores, marketplaces, booking platforms,
              ticketing.
            </li>
            <li>
              Banking and financial services (consumer-facing): online banking,
              mobile banking apps, payment services.
            </li>
            <li>
              E-book services and e-readers.
            </li>
            <li>
              Audiovisual media services (consumer-facing VoD, streaming).
            </li>
            <li>
              Electronic communications services (messaging, emergency calls).
            </li>
            <li>
              Transport services: ticketing, booking, check-in, real-time info.
            </li>
            <li>
              Consumer-facing computer hardware + operating systems (e.g., a
              laptop vendor&apos;s OS).
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption:</strong> companies with fewer
            than 10 employees <em>and</em> under €2M annual turnover providing
            services are exempt from EAA service obligations. Product
            manufacturers don&apos;t get this exemption.
          </p>
          <p className="mt-3 text-slate-700">
            <strong>Non-EU companies are in scope</strong> if they sell to EU
            consumers. A U.S. e-commerce site accepting EU orders falls under
            the EAA just like a German site.
          </p>
        </section>

        <section id="what-required" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Technical requirements — EN 301 549 / WCAG 2.1 AA
          </h2>
          <p className="mt-3 text-slate-700">
            For web content, the EAA references{" "}
            <strong>EN 301 549 v3.2.1</strong>, which incorporates WCAG 2.1 AA.
            Practically, this means:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Alt text for informative images</strong> (not for
              decorative ones — decorative images should have{" "}
              <code className="rounded bg-slate-100 px-1 text-xs">
                alt=&quot;&quot;
              </code>
              ).
            </li>
            <li>
              <strong>Keyboard-only operation</strong>: every mouse action must
              have a keyboard equivalent, and no keyboard traps.
            </li>
            <li>
              <strong>4.5:1 contrast ratio</strong> for body text, 3:1 for
              large text and for UI components and meaningful graphics.
            </li>
            <li>
              <strong>Semantic headings</strong> in order (h1 → h2 → h3), not
              skipping levels.
            </li>
            <li>
              <strong>Programmatic form labels</strong> associated with every
              input — <code className="rounded bg-slate-100 px-1 text-xs">
                &lt;label for=&quot;x&quot;&gt;
              </code>{" "}
              or <code className="rounded bg-slate-100 px-1 text-xs">
                aria-labelledby
              </code>
              . Placeholder text alone is not sufficient.
            </li>
            <li>
              <strong>Screen-reader support</strong> for NVDA, JAWS, VoiceOver.
              The DOM order and ARIA semantics must match the visual order.
            </li>
            <li>
              <strong>Focus visible</strong>: a clear outline or ring when an
              element has keyboard focus.
            </li>
            <li>
              <strong>No flashing content</strong> above 3 flashes per second
              (seizure risk).
            </li>
            <li>
              <strong>Page language declared</strong>:{" "}
              <code className="rounded bg-slate-100 px-1 text-xs">
                &lt;html lang=&quot;en&quot;&gt;
              </code>
              . Every EU language the site supports must be declared per
              sub-section.
            </li>
          </ul>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Penalties and enforcement (by member state)
          </h2>
          <p className="mt-3 text-slate-700">
            The EAA requires each member state to set &quot;effective,
            proportionate and dissuasive&quot; penalties. In practice, penalty
            structure varies — but several member states are aggressive:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Germany</strong> (BFSG): fines up to €100,000 per
              violation; repeat violators can face service-prohibition orders.
            </li>
            <li>
              <strong>Ireland</strong>: fines up to €60,000 per infringement
              and up to 18 months imprisonment for directors in extreme cases.
            </li>
            <li>
              <strong>France</strong> (LCEN + EAA transposition): up to €300,000
              for corporate violations; consumers can bring civil actions with
              strict liability for accessibility failures.
            </li>
            <li>
              <strong>Italy</strong>: up to 5% of annual turnover for
              non-compliant products/services per the national transposition.
            </li>
            <li>
              <strong>Spain</strong>: escalating tiers with maximum fines up to
              €1,000,000 for &quot;very serious&quot; infringements that affect
              a large number of users.
            </li>
          </ul>
          <p className="mt-3 text-slate-700">
            Unlike U.S. ADA cases — which typically end in a settlement of
            $5K-50K — EU enforcement can be administrative (regulator-led, not
            consumer-led) and can result in mandatory remediation orders with
            deadlines. Missing those deadlines is what triggers the large
            fines.
          </p>
        </section>

        <section id="overlays" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Why accessibility overlay widgets don&apos;t protect you
          </h2>
          <p className="mt-3 text-slate-700">
            If you&apos;re looking at this page because a vendor offered to
            &quot;make you EAA-compliant&quot; with a JavaScript widget that
            adds a small button to your site, stop. The FTC settled with
            accessiBe for <strong>$1,000,000</strong> in January 2025,
            specifically over the claim that their overlay made sites
            compliant. The FTC&apos;s allegation was that this claim was
            deceptive.
          </p>
          <p className="mt-3 text-slate-700">
            From a strict EAA compliance standpoint: EN 301 549 specifies
            requirements at the <em>source</em> level. An overlay that
            programmatically injects ARIA on top of broken HTML does not
            change the underlying source — and a regulator or a consumer
            association running an axe-core scan will see the same violations
            that existed before the overlay was installed.
          </p>
          <p className="mt-3 text-slate-700">
            Research from Princeton (Van Lee et al., 2023) documented cases
            where overlay-injected ARIA actively <em>harmed</em> screen-reader
            users because the injected roles conflicted with the semantic
            structure of the underlying HTML.
          </p>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — a six-step process
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li>
              <strong>Baseline scan.</strong> Run axe-core 4.11 against your
              homepage + 3-5 representative pages. Expect 30-80 violations on a
              typical site that has not been audited. Half will be trivial
              (missing alt, missing label); half will need real work.
            </li>
            <li>
              <strong>Fix at the source.</strong> Edit your React / Vue /
              WordPress / Next.js / Astro templates — do not wrap a band-aid
              script over a broken page. The EAA cares about the served HTML,
              not whatever runs in the browser after page load.
            </li>
            <li>
              <strong>Accessibility in CI.</strong> Install an accessibility
              scanner in your pull-request pipeline. Fail the build at a
              severity threshold you can actually maintain (
              <code className="rounded bg-slate-100 px-1 text-xs">serious</code>{" "}
              is a good starting point). This is what prevents regressions in
              the months between audits.
            </li>
            <li>
              <strong>Manual audit for the long tail.</strong> Automated tools
              (axe-core, WAVE, Lighthouse) catch roughly 57% of WCAG violations.
              Cognitive load, screen-reader flow, form error recovery, and
              video captioning can only be fully assessed by a human. Budget
              for one accessibility auditor engagement per year.
            </li>
            <li>
              <strong>Publish an accessibility statement.</strong> The EAA
              (and WAD Directive (EU) 2016/2102 for public-sector sites)
              requires a public statement that describes the site&apos;s
              conformance status, known non-compliant content, and a
              mechanism for users to report barriers.
            </li>
            <li>
              <strong>Keep an audit trail.</strong> Retain scan reports and PR
              review artifacts. When a regulator investigates, the question
              isn&apos;t whether you&apos;re 100% compliant — it&apos;s
              whether you&apos;re making systematic good-faith effort. Reports
              from a CI pipeline are the easiest evidence of that.
            </li>
          </ol>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Accessibility statement — what the EAA requires
          </h2>
          <p className="mt-3 text-slate-700">
            The EAA requires an accessibility statement on every covered
            digital service. The exact format varies by member state
            transposition, but at minimum it must include:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>
              <strong>Conformance status</strong>: &quot;fully&quot;,
              &quot;partially&quot;, or &quot;not&quot; compliant with the
              referenced standard (EN 301 549 / WCAG 2.1 AA).
            </li>
            <li>
              <strong>Known non-compliant content</strong> with a reason
              (disproportionate burden under Art. 14 EAA, or exemption under
              Annex V).
            </li>
            <li>
              <strong>Contact information</strong> for accessibility feedback
              (named person or team, email, preferably also phone).
            </li>
            <li>
              <strong>Enforcement procedure</strong>: the national regulator
              the user can escalate to if the operator doesn&apos;t respond.
            </li>
            <li>
              <strong>Methodology</strong>: how conformance was assessed
              (self-assessment vs. third-party audit, tools used, date).
            </li>
            <li>
              <strong>Last updated date</strong>.
            </li>
            <li>
              The statement itself must be <strong>accessible</strong>. Posting
              it as a scanned PDF without an underlying text layer is itself a
              violation.
            </li>
          </ol>
          <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            axle&apos;s{" "}
            <Link href="/statement" className="font-semibold underline">
              statement generator
            </Link>{" "}
            produces an EAA-compliant statement in Hebrew (Israeli תקנה 35) and
            English. Multi-language support for all EU languages is on the
            Team plan.
          </p>
        </section>

        <section id="axle" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How axle helps
          </h2>
          <p className="mt-3 text-slate-700">
            axle is a compliance CI toolkit designed specifically for teams
            that need to hit EN 301 549 / WCAG 2.1 AA on every release, not
            just at audit time.
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>
              <strong>GitHub Action</strong>. Scans every pull request with
              axe-core 4.11, blocks merges when violations exceed your
              threshold. Claude Sonnet proposes source-code fix diffs inline
              in the PR comment so reviewers see a complete fix, not just a
              finding.
            </li>
            <li>
              <strong>Platform plugins</strong> for Netlify, Cloudflare Pages,
              and Vercel. Same scan, your existing pipeline.
            </li>
            <li>
              <strong>WordPress plugin</strong>. Client-side scanner runs in
              the admin browser — works for any site, including staging behind
              VPN or basic auth.
            </li>
            <li>
              <strong>Accessibility statement generator</strong> that meets
              EAA statement requirements, with a hosted verified URL (
              <code className="mx-1 rounded bg-slate-100 px-1 text-xs">
                axle-iota.vercel.app/s/&lt;id&gt;
              </code>
              ). Tamper-evident, timestamped, indexable — exactly what a
              regulator wants to see linked from your footer.
            </li>
            <li>
              <strong>Audit trail</strong>. Every scan result is retained in
              your private dashboard as evidence of systematic monitoring.
            </li>
          </ul>

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
              Generate a statement
            </Link>
            <Link
              href="/#pricing"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              See pricing
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <p>
            <strong>Disclaimer:</strong> This guide is written for engineering
            teams. It is <em>not</em> legal advice and does not substitute for
            a qualified accessibility auditor. For specific legal exposure in
            a given member state, consult a lawyer admitted in that
            jurisdiction.
          </p>
          <p className="mt-3">
            Updated: 20 April 2026. Revised when the law or EN 301 549
            changes. Factual corrections welcome:{" "}
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
