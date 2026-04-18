"use client";

import { useMemo, useState } from "react";

const STATES = [
  { key: "passing", label: "passing", color: "brightgreen" },
  { key: "issues", label: "issues", color: "yellow" },
  { key: "failing", label: "failing", color: "red" },
  { key: "pending", label: "pending scan", color: "blue" },
] as const;

export default function BadgePage() {
  const [url, setUrl] = useState("https://example.com");
  const [standard, setStandard] = useState("WCAG 2.1 AA");

  const markdown = useMemo(() => {
    const src = `/api/badge?url=${encodeURIComponent(url)}&standard=${encodeURIComponent(
      standard
    )}`;
    return `[![${standard}](${src})](https://axle.dev/?utm_source=badge)`;
  }, [url, standard]);

  const html = useMemo(() => {
    const src = `/api/badge?url=${encodeURIComponent(url)}&standard=${encodeURIComponent(
      standard
    )}`;
    return `<a href="https://axle.dev/?utm_source=badge"><img src="${src}" alt="${standard}" /></a>`;
  }, [url, standard]);

  const shieldsEndpoint = useMemo(() => {
    const base = `https://axle.dev/api/badge?url=${encodeURIComponent(
      url
    )}&format=json&standard=${encodeURIComponent(standard)}`;
    return `https://img.shields.io/endpoint?url=${encodeURIComponent(base)}`;
  }, [url, standard]);

  async function copy(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Compliance badge</h1>
            <p className="mt-2 text-slate-600">
              A live shield proving your site meets WCAG 2.1 / 2.2 AA. Embeds in any README,
              footer, or landing page. Free forever, even on the free tier.
            </p>
          </div>
          <a
            href="/"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            ← Home
          </a>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            States
          </h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {STATES.map((s) => (
              <img
                key={s.key}
                src={`/api/badge?url=https://demo&status=${s.key}&standard=${encodeURIComponent(
                  standard
                )}`}
                alt={s.label}
                className="h-5"
              />
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            States update automatically once you wire your repo to axle CI. Unknown URLs render as
            “pending scan” — still shareable, still drives adoption.
          </p>
        </section>

        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
            Customise your badge
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-800">Site URL</span>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-slate-800">Standard</span>
              <select
                value={standard}
                onChange={(e) => setStandard(e.target.value)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2"
              >
                <option>WCAG 2.1 AA</option>
                <option>WCAG 2.2 AA</option>
                <option>IS 5568 AA</option>
                <option>WCAG 2.1 AAA</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <img
              alt="Preview"
              className="h-5"
              src={`/api/badge?url=${encodeURIComponent(url)}&standard=${encodeURIComponent(
                standard
              )}`}
            />
            <span className="text-xs text-slate-500">
              Live preview (served from /api/badge)
            </span>
          </div>

          <div className="mt-6 space-y-4">
            <CodeBlock label="Markdown" code={markdown} onCopy={copy} />
            <CodeBlock label="HTML" code={html} onCopy={copy} />
            <CodeBlock
              label="shields.io endpoint"
              code={shieldsEndpoint}
              onCopy={copy}
              hint="If you prefer shields.io rendering, point their endpoint at our JSON output."
            />
          </div>
        </section>

        <p className="mt-6 text-xs text-slate-500">
          axle provides remediation assistance. A badge is not a compliance certificate — it reflects
          the outcome of automated checks. Manual human review is still recommended for full WCAG
          conformance.
        </p>
      </div>
    </main>
  );
}

function CodeBlock({
  label,
  code,
  onCopy,
  hint,
}: {
  label: string;
  code: string;
  onCopy: (s: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <button
          onClick={() => onCopy(code)}
          className="rounded-md border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-700 hover:bg-slate-50"
        >
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-800">
        {code}
      </pre>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
