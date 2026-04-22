import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "EAA in Sweden — Tillgänglighetslagen for developers",
  description:
    "Sweden transposed the EAA via lagen om vissa produkters och tjänsters tillgänglighet. Myndigheten för digital förvaltning (DIGG) enforces. A practical engineering guide for teams shipping to the Swedish market.",
  keywords: [
    "EAA Sweden",
    "tillgänglighetslagen",
    "DIGG tillgänglighet",
    "svensk tillgänglighet",
    "WCAG Sverige",
    "tillgänglighetsredogörelse",
    "axle",
  ],
  openGraph: {
    title: "EAA in Sweden — Tillgänglighetslagen",
    description:
      "What Swedish law requires, who it applies to, DIGG enforcement, and CI-first compliance.",
    type: "article",
    locale: "sv_SE",
  },
  alternates: { canonical: "/guides/eaa-sweden" },
};

export default function SwedenPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Sverige · EAA-guide
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          EAA in Sweden — Tillgänglighetslagen
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Sweden transposed the European Accessibility Act through{" "}
          <strong>Lag (2023:254) om vissa produkters och tjänsters tillgänglighet</strong>{" "}
          — popularly the <em>Tillgänglighetslagen</em>. Enforcement took effect{" "}
          <strong>28 June 2025</strong>. The lead authority is the{" "}
          <strong>Myndigheten för digital förvaltning (DIGG)</strong>, which also runs
          the public-sector accessibility oversight under <em>DOS-lagen</em>. Sector
          authorities apply: <strong>Finansinspektionen (FI)</strong> for banking and
          investment, <strong>Post- och telestyrelsen (PTS)</strong> for electronic
          communications, and <strong>Konsumentverket</strong> (KO) for consumer
          protection overlays. Penalties include administrative fines
          (<em>sanktionsavgift</em>) up to <strong>SEK 10 million</strong> per breach,
          scaled by turnover and severity.
        </p>

        <nav className="mt-8 rounded-lg border border-slate-200 bg-white p-4 text-sm">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Innehåll
          </div>
          <ol className="mt-2 list-decimal space-y-1 ps-6 text-slate-700">
            <li><a className="hover:underline" href="#what">Legal framework — DOS + Tillgänglighetslagen</a></li>
            <li><a className="hover:underline" href="#who">Who it applies to</a></li>
            <li><a className="hover:underline" href="#technical">Technical requirements — EN 301 549</a></li>
            <li><a className="hover:underline" href="#penalties">Penalties — DIGG sanktionsavgift</a></li>
            <li><a className="hover:underline" href="#statement">Tillgänglighetsredogörelse — the statement</a></li>
            <li><a className="hover:underline" href="#how">How to comply — CI-first</a></li>
          </ol>
        </nav>

        <section id="what" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Legal framework</h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li><strong>Lag (2018:1937) om tillgänglighet till digital offentlig service (DOS-lagen)</strong> — transposed Directive 2016/2102 for public-sector bodies. DIGG enforces.</li>
            <li><strong>Lag (2023:254) om vissa produkters och tjänsters tillgänglighet (Tillgänglighetslagen)</strong> — transposed the EAA (Directive 2019/882) to private-sector operators. Effective 28 June 2025.</li>
            <li><strong>EN 301 549 v3.2.1</strong> — harmonised standard, embeds WCAG 2.1 Level AA for web content.</li>
            <li><strong>Diskrimineringslagen (2008:567)</strong> — pre-existing discrimination framework; <em>bristande tillgänglighet</em> is a protected category, enforceable through the Equality Ombudsman (DO).</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Sweden is unusual in explicitly treating <em>bristande tillgänglighet</em>{" "}
            (inadequate accessibility) as a form of discrimination under the main
            anti-discrimination statute. This creates a second enforcement pathway
            through Diskrimineringsombudsmannen (DO) in parallel with DIGG fines.
          </p>
        </section>

        <section id="who" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Who it applies to</h2>
          <p className="mt-3 text-slate-700">
            In-scope services for consumers in Sweden:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>E-commerce (Boozt, Nelly, etc.), online marketplaces, booking platforms.</li>
            <li>Consumer-facing banking and financial services (Swish, Klarna, bank apps).</li>
            <li>E-books, e-readers, and associated software (Storytel, BookBeat).</li>
            <li>Consumer-facing electronic communications (messaging, VoIP, 112 emergency calls).</li>
            <li>SJ, SL and other passenger-transport ticketing, real-time info, self-service terminals.</li>
            <li>Consumer hardware terminals (Bankomat ATMs, Pressbyrån kiosks, check-in machines) and their operating systems.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            <strong>Microenterprise exemption</strong> per Article 4(5) EAA: fewer
            than 10 employees <em>and</em> annual turnover / balance sheet under €2M,
            providing services. Product manufacturers are not exempt regardless of
            size.
          </p>
          <p className="mt-3 text-slate-700">
            Non-Swedish operators serving Swedish consumers fall within DIGG reach.
            Nordic-region operators (Norwegian, Danish, Finnish) should evaluate
            Sweden alongside their home-country transposition; Sweden is frequently
            the largest Nordic consumer market.
          </p>
        </section>

        <section id="technical" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Technical requirements — EN 301 549
          </h2>
          <p className="mt-3 text-slate-700">
            EN 301 549 v3.2.1 is the referenced harmonised standard. For web content,
            WCAG 2.1 Level AA is the conformance target. Key expectations:
          </p>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>Perceivable — alt text, captions for prerecorded video, 4.5:1 body contrast, 3:1 for large text.</li>
            <li>Operable — full keyboard navigability, no flashing above 3 Hz, visible focus indicator.</li>
            <li>Understandable — <code>&lt;html lang=&quot;sv&quot;&gt;</code>, predictable navigation, explicit form labels in Swedish (Swedish personnummer format, Swedish address structure).</li>
            <li>Robust — valid HTML, ARIA consistent with DOM semantics.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            Sweden-specific UX patterns worth getting right: BankID flows, Swish QR
            codes, personnummer input with the <em>ÅÅÅÅMMDD-XXXX</em> format, and
            handling of the å/ä/ö characters in names and addresses. The language
            declaration matters for screen-reader pronunciation — Swedish phonology
            diverges materially from Danish and Norwegian despite written similarity.
          </p>
        </section>

        <section id="penalties" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Penalties — DIGG sanktionsavgift
          </h2>
          <ul className="mt-3 list-disc space-y-2 ps-6 text-slate-700">
            <li>DIGG administrative fines (<em>sanktionsavgift</em>) up to <strong>SEK 10 million per breach</strong>, scaled by turnover and severity.</li>
            <li>Viten (periodic penalty) per day of continued non-compliance until remediation.</li>
            <li>Public decision register via DIGG — reputational cost significant for consumer brands.</li>
            <li>
              <strong>Diskrimineringsombudsmannen (DO)</strong> can bring discrimination
              claims under the Diskrimineringslagen in parallel. Remedies include damages
              and injunctive relief.
            </li>
            <li>Sector regulators (FI for banking, PTS for telecoms) apply separate fining frameworks on top.</li>
          </ul>
          <p className="mt-3 text-slate-700">
            DIGG&apos;s historical DOS-lagen enforcement has been graduated: informal
            contact → förelägganden (orders) → viten → sanktionsavgift. Credible
            remediation signalled through a published tillgänglighetsredogörelse and
            CI-scan evidence usually stops escalation before the fine stage.
          </p>
        </section>

        <section id="statement" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Tillgänglighetsredogörelse — the statement
          </h2>
          <p className="mt-3 text-slate-700">
            Swedish accessibility statements follow the EU template. Required
            elements:
          </p>
          <ol className="mt-3 list-decimal space-y-2 ps-6 text-slate-700">
            <li>Conformance status: <em>helt förenligt / delvis förenligt / inte förenligt</em> with EN 301 549.</li>
            <li>List of non-accessible content with justification (<em>oproportionerlig börda</em>, exemption, pending remediation).</li>
            <li>Named accessibility contact (email required; phone recommended).</li>
            <li>Escalation procedure — DIGG for Tillgänglighetslagen matters, DO for discrimination, sector regulator where relevant.</li>
            <li>Assessment methodology (self-assessment, third-party audit) with date.</li>
            <li>Preparation and last-review dates.</li>
            <li>Statement must itself be accessible; published in Swedish.</li>
          </ol>
          <p className="mt-3 text-slate-700">
            The DOS-lagen oversight (via DIGG&apos;s{" "}
            <em>Webbtillgänglighetsdirektivet</em> portal) publishes thousands of
            public-sector statements — useful reference for phrasing and methodology.
          </p>
        </section>

        <section id="how" className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            How to comply — CI-first approach
          </h2>
          <ol className="mt-3 list-decimal space-y-3 ps-6 text-slate-700">
            <li><strong>Baseline scan</strong> — axe-core 4.11 against the Swedish-locale homepage and 10 critical flows.</li>
            <li><strong>Fix at source</strong> — overlay widgets do not satisfy EN 301 549; DIGG and DO both evaluate the served HTML.</li>
            <li><strong>CI gate</strong> — fail PRs on serious-severity regressions to prevent drift.</li>
            <li><strong>Annual human audit</strong> — axe-core catches ~57% of WCAG issues. Commission an IAAP-certified auditor for the remainder. Swedish auditors (Funka, Useit, Dyslexiförbundet) are established references.</li>
            <li><strong>Publish the tillgänglighetsredogörelse</strong> with DIGG and DO escalation details in Swedish.</li>
            <li><strong>Retain evidence</strong> — per-PR axe-core scan history is the most defensible ongoing-diligence record.</li>
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
              Statement generator
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
            <strong>Disclaimer:</strong> written for engineering teams. Not legal
            advice. For exposure specific to Tillgänglighetslagen, consult a Swedish
            advokat. Penalty figures cited reflect statutory maxima under DIGG&apos;s
            sanktionsavgift framework.
          </p>
          <p className="mt-3">
            Updated: 22 April 2026. Factual corrections:{" "}
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
