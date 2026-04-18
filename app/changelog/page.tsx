import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "Every release of axle — the accessibility compliance CI for modern websites. Continuous WCAG 2.1 / 2.2 AA scanning, AI code fixes, and lawyer-ready artifacts.",
  alternates: { canonical: "/changelog" },
};

type Entry = {
  date: string; // ISO
  version: string;
  tag: "launch" | "feature" | "fix" | "infra";
  title: string;
  body: string[];
};

const ENTRIES: Entry[] = [
  {
    date: "2026-04-18",
    version: "0.1.0",
    tag: "launch",
    title: "First public release",
    body: [
      "Full accessibility-compliance CI ships with the initial release: every PR is scanned by axe-core 4.11 across WCAG 2.1 / 2.2 AA rule sets, and AI-generated code fixes are posted inline via Claude Sonnet 4.6.",
      "Compliance artifacts shipped from day one: Hebrew accessibility statement generator aligned with תקנה 35, embeddable compliance badge, and audit-trail JSON + markdown reports uploaded to every workflow run.",
      "Billing rail activated via Polar.sh — Israeli founders can accept USD payments globally without setting up a US LLC. First real subscription processed end-to-end on launch day.",
      "Free distribution across GitHub Marketplace (asafamos/axle-action), npm (axle-cli + axle-netlify-plugin), and the hosted web UI at axle-iota.vercel.app. Paid Team tier unlocks hosted AI fixes, nightly monitoring, and audit PDFs.",
    ],
  },
];

const TAG_LABEL: Record<Entry["tag"], { text: string; className: string }> = {
  launch: { text: "Launch", className: "bg-emerald-100 text-emerald-800" },
  feature: { text: "Feature", className: "bg-blue-100 text-blue-800" },
  fix: { text: "Fix", className: "bg-amber-100 text-amber-800" },
  infra: { text: "Infra", className: "bg-slate-200 text-slate-800" },
};

export default function ChangelogPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Changelog
          </p>
          <h1 className="mt-1 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Every shipped release of axle
          </h1>
          <p className="mt-3 text-slate-600">
            We build in public. Subscribe to updates via the{" "}
            <a
              href="https://github.com/asafamos/axle-action/releases.atom"
              className="underline hover:text-slate-800"
            >
              RSS feed
            </a>{" "}
            or watch{" "}
            <a
              href="https://github.com/asafamos/axle-action"
              className="underline hover:text-slate-800"
            >
              the action repo on GitHub
            </a>
            .
          </p>
        </header>

        <div className="space-y-10">
          {ENTRIES.map((e) => {
            const tag = TAG_LABEL[e.tag];
            return (
              <article
                key={`${e.version}-${e.date}`}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${tag.className}`}
                  >
                    {tag.text}
                  </span>
                  <span className="font-mono text-sm text-slate-700">
                    v{e.version}
                  </span>
                  <time
                    dateTime={e.date}
                    className="text-sm text-slate-500"
                  >
                    {new Date(e.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                  {e.title}
                </h2>
                <div className="mt-3 space-y-3 text-slate-700">
                  {e.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <footer className="mt-12 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <a href="/" className="hover:text-slate-800">
            ← Back to axle
          </a>
        </footer>
      </div>
    </main>
  );
}
