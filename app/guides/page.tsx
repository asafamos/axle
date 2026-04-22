import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Accessibility compliance guides — EAA, ADA, WCAG, per country and stack",
  description:
    "Practical accessibility compliance guides for developers: EAA 2025 transpositions (Germany, France, Italy, Spain, Ireland, Netherlands, Belgium), Israeli תקנה 35, and stack-specific guides (Next.js, React, Shopify, WordPress).",
  keywords: [
    "accessibility guides",
    "EAA 2025 guide",
    "WCAG guide",
    "ADA compliance guide",
    "web accessibility developer guide",
    "axle",
  ],
  openGraph: {
    title: "axle — accessibility compliance guides hub",
    description:
      "Per-country EAA transpositions, Israeli תקנה 35, and per-stack accessibility engineering guides.",
    type: "website",
    locale: "en_US",
  },
  alternates: { canonical: "/guides" },
};

type Guide = {
  href: string;
  eyebrow: string;
  title: string;
  blurb: string;
};

const regional: Guide[] = [
  {
    href: "/guides/eaa-2025",
    eyebrow: "EU · overview",
    title: "EAA 2025 — the directive, the obligations, the timeline",
    blurb:
      "What the European Accessibility Act actually requires, who is in scope, and how the 27 national transpositions diverge.",
  },
  {
    href: "/guides/eaa-germany",
    eyebrow: "EAA · Germany",
    title: "Germany — Barrierefreiheitsstärkungsgesetz (BFSG)",
    blurb:
      "BFSG scope, Bundesfachstelle für Barrierefreiheit enforcement, up to €100k fines, German-language statement requirements.",
  },
  {
    href: "/guides/eaa-france",
    eyebrow: "EAA · France",
    title: "France — ordonnance n° 2023-859 and RGAA 4.1",
    blurb:
      "RGAA 4.1 legal weight, ARCOM enforcement, sanctions pécuniaires, French-language statement under Article 47.",
  },
  {
    href: "/guides/eaa-italy",
    eyebrow: "EAA · Italy",
    title: "Italy — D.Lgs. 82/2022 and the Legge Stanca",
    blurb:
      "AgID enforcement, sanzione amministrativa up to 5% turnover, accessibility statement in Italian.",
  },
  {
    href: "/guides/eaa-spain",
    eyebrow: "EAA · Spain",
    title: "Spain — Ley 11/2023 and Real Decreto 193/2023",
    blurb:
      "OAW observatorio scans, multilingual statement (Spanish, Catalan, Basque, Galician), fines up to €600k.",
  },
  {
    href: "/guides/eaa-ireland",
    eyebrow: "EAA · Ireland",
    title: "Ireland — S.I. 636/2023",
    blurb:
      "NDA guidance, CCPC enforcement, €60k per offence + unusual director-liability exposure.",
  },
  {
    href: "/guides/eaa-netherlands",
    eyebrow: "EAA · Netherlands",
    title: "Netherlands — Implementatiewet toegankelijkheid",
    blurb:
      "ACM enforcement, €900k / 1% turnover penalty ceiling, toegankelijkheidsverklaring pattern.",
  },
  {
    href: "/guides/eaa-belgium",
    eyebrow: "EAA · Belgium",
    title: "Belgium — Loi / Wet 28 November 2022",
    blurb:
      "SPF Économie / FOD Economie enforcement across three language regions, €80k per violation.",
  },
  {
    href: "/guides/eaa-austria",
    eyebrow: "EAA · Austria",
    title: "Austria — Barrierefreiheitsgesetz (BaFG)",
    blurb:
      "Sozialministeriumservice enforcement, VStG fines to €80k, BGStG civil-claim double exposure.",
  },
  {
    href: "/guides/eaa-sweden",
    eyebrow: "EAA · Sweden",
    title: "Sweden — Tillgänglighetslagen",
    blurb:
      "DIGG enforcement, sanktionsavgift up to 10 MSEK, parallel DO discrimination pathway.",
  },
  {
    href: "/guides/eaa-portugal",
    eyebrow: "EAA · Portugal",
    title: "Portugal — Decreto-Lei 82/2022",
    blurb:
      "AMA / ASAE enforcement, RGCE contraordenações up to €44,891, complementary AccessMonitor.",
  },
  {
    href: "/guides/eaa-poland",
    eyebrow: "EAA · Poland",
    title: "Poland — Ustawa o dostępności",
    blurb:
      "UOKiK turnover-linked fines, 38M consumers, fastest-growing EU e-commerce market.",
  },
  {
    href: "/guides/eaa-denmark",
    eyebrow: "EAA · Denmark",
    title: "Denmark — Lov om tilgængelighedskrav",
    blurb:
      "Digitaliseringsstyrelsen + Forbrugerombudsmanden, parallel Ligebehandlingsnævnet complaint pathway.",
  },
  {
    href: "/he/takana-35",
    eyebrow: "ישראל · תקנה 35",
    title: "תקנה 35 — שירות נגיש באינטרנט",
    blurb:
      "מחוץ ל-EAA אבל פנימית לישראל: דרישות שירות המשפט, הצהרת נגישות בעברית, נציב שוויון.",
  },
];

const stack: Guide[] = [
  {
    href: "/guides/nextjs-accessibility",
    eyebrow: "Stack · Next.js",
    title: "Next.js accessibility — RSC, App Router, metadata",
    blurb:
      "Server components, useId, focus management on route changes, CI with @axe-core/playwright.",
  },
  {
    href: "/guides/react-accessibility",
    eyebrow: "Stack · React",
    title: "React accessibility — the practical guide",
    blurb:
      "Component semantics, useId forms, focus management, jest-axe + Playwright, and a CI pipeline.",
  },
  {
    href: "/guides/vue-accessibility",
    eyebrow: "Stack · Vue / Nuxt",
    title: "Vue accessibility — the practical guide",
    blurb:
      "Vue 3.5 useId, route focus, vitest-axe + Playwright, Nuxt specifics, CI pipeline.",
  },
  {
    href: "/guides/angular-accessibility",
    eyebrow: "Stack · Angular",
    title: "Angular accessibility — CDK a11y, Material, cypress-axe",
    blurb:
      "FocusTrap / LiveAnnouncer primitives, Material patterns, reactive forms, router focus, CI.",
  },
  {
    href: "/guides/shopify-accessibility",
    eyebrow: "Stack · Shopify",
    title: "Shopify accessibility — theme, checkout, catalog",
    blurb:
      "Theme audit, Liquid templates, Checkout Extensibility limits, catalog-scale scanning.",
  },
  {
    href: "/guides/wordpress-accessibility",
    eyebrow: "Stack · WordPress",
    title: "WordPress accessibility — themes, plugins, Gutenberg",
    blurb:
      "Block editor patterns, plugin-conflict testing, axle-wordpress plugin for per-page scans.",
  },
];

const reference: Guide[] = [
  {
    href: "/checklist/wcag-2-2-aa",
    eyebrow: "Checklist",
    title: "WCAG 2.2 AA — printable checklist",
    blurb: "All 55 success criteria with plain-language engineer-facing descriptions and quick examples.",
  },
  {
    href: "/why-not-overlay",
    eyebrow: "Reference",
    title: "Why accessibility overlays don't work",
    blurb:
      "FTC $1M accessiBe settlement, Princeton 2023 study, regulator methodology, what to do instead.",
  },
  {
    href: "/web-accessibility-audit",
    eyebrow: "Reference",
    title: "Web accessibility audit — scope, cost, template",
    blurb:
      "How to commission a real audit, cost ranges, VPAT, and how pre-scans cut billable hours by 40-60%.",
  },
  {
    href: "/ada-demand-letter",
    eyebrow: "Emergency",
    title: "I got an ADA demand letter — the first 48 hours",
    blurb:
      "Engineering-side playbook: preserve evidence, scan and inventory, engage counsel, publish a dated plan.",
  },
  {
    href: "/alternatives/accessibe",
    eyebrow: "Alternative",
    title: "accessiBe alternative — compliance without the overlay",
    blurb: "Side-by-side comparison of accessiBe's overlay model vs axle's CI-first source-fix approach.",
  },
  {
    href: "/alternatives/userway",
    eyebrow: "Alternative",
    title: "UserWay alternative — compliance without the widget",
    blurb: "Why UserWay's widget fails EAA / EN 301 549 evaluation, and what to do instead.",
  },
  {
    href: "/alternatives/audioeye",
    eyebrow: "Alternative",
    title: "AudioEye alternative — real fixes in the source",
    blurb: "Comparison of AudioEye's hybrid overlay-plus-audit model vs axle's PR-embedded workflow.",
  },
];

function GuideCard({ g }: { g: Guide }) {
  return (
    <Link
      href={g.href}
      className="block rounded-lg border border-slate-200 bg-white p-5 transition hover:border-slate-400 hover:bg-slate-50"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {g.eyebrow}
      </p>
      <h3 className="mt-2 text-lg font-semibold text-slate-900">{g.title}</h3>
      <p className="mt-2 text-sm text-slate-600">{g.blurb}</p>
    </Link>
  );
}

export default function GuidesHub() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · guides
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
          Accessibility compliance guides
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-700">
          Practical engineering-focused guides for WCAG 2.1 / 2.2 AA compliance.
          Regional guides cover how each jurisdiction transposed the EAA (and Israel&apos;s
          parallel framework). Stack guides cover the specifics of building accessible
          applications in the most common web stacks. All guides are written for
          developers and engineering leads — no legalese, no vendor fluff.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">Regional guides</h2>
          <p className="mt-2 text-sm text-slate-600">
            EAA 2025 transpositions and parallel frameworks, sorted by market size.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {regional.map((g) => (
              <GuideCard key={g.href} g={g} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Stack guides</h2>
          <p className="mt-2 text-sm text-slate-600">
            Accessibility patterns for the most common web frameworks and platforms.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {stack.map((g) => (
              <GuideCard key={g.href} g={g} />
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-slate-900">Reference</h2>
          <p className="mt-2 text-sm text-slate-600">
            Checklists, alternative comparisons, and the overlay-widget reference.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {reference.map((g) => (
              <GuideCard key={g.href} g={g} />
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">Missing a country or stack?</h2>
          <p className="mt-2 text-sm text-slate-700">
            Guides are prioritised by traffic and regulator pressure. If you&apos;d like
            coverage for another EU member state, a stack (Vue, Svelte, Rails,
            Django, .NET), or a specific industry vertical (fintech, healthcare,
            edtech), email{" "}
            <a className="underline" href="mailto:asaf@amoss.co.il">
              asaf@amoss.co.il
            </a>{" "}
            with the market context. Practical case studies help prioritisation.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
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
              href="/faq"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              FAQ
            </Link>
          </div>
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Updated: 22 April 2026. All guides maintained by the axle team. Not legal
          advice.
        </footer>
      </div>
    </main>
  );
}
