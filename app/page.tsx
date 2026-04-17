"use client";

import { useState } from "react";
import type { ScanResult, AxeViolation } from "@/lib/scanner";

type FixResult = {
  explanation: string;
  fix_strategy: string;
  patches: Array<{
    selector: string;
    before: string;
    after: string;
    notes: string;
  }>;
  confidence: "high" | "medium" | "low";
  manual_review_needed: boolean;
};

type FixState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "done"; fix: FixResult }
  | { status: "error"; error: string };

const impactColor: Record<string, string> = {
  critical: "bg-red-600 text-white",
  serious: "bg-orange-500 text-white",
  moderate: "bg-yellow-400 text-black",
  minor: "bg-blue-400 text-white",
};

const confidenceColor: Record<string, string> = {
  high: "text-green-700 bg-green-100",
  medium: "text-yellow-700 bg-yellow-100",
  low: "text-red-700 bg-red-100",
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [fixes, setFixes] = useState<Record<string, FixState>>({});

  async function handleFix(violation: AxeViolation, nodeIndex: number) {
    const key = `${violation.id}-${nodeIndex}`;
    setFixes((f) => ({ ...f, [key]: { status: "loading" } }));
    try {
      const res = await fetch("/api/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ violation, nodeIndex }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Fix generation failed");
      setFixes((f) => ({ ...f, [key]: { status: "done", fix: data } }));
    } catch (err) {
      setFixes((f) => ({
        ...f,
        [key]: {
          status: "error",
          error: err instanceof Error ? err.message : "Unknown error",
        },
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const totalViolations = result?.violations.length ?? 0;
  const totalNodes =
    result?.violations.reduce((sum, v) => sum + v.nodes.length, 0) ?? 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            a11y-fixer
          </h1>
          <p className="mt-3 text-lg text-slate-600">
            Real accessibility code fixes. No overlay widgets.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={loading}
            required
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !url}
            className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan for free"}
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-red-800">
            <strong>Error:</strong> {error}
          </div>
        )}

        {loading && (
          <div className="mt-10 text-center text-slate-600">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900"></div>
            <p className="mt-3">
              Launching headless browser and running axe-core. This takes 10-30 seconds...
            </p>
          </div>
        )}

        {result && !loading && (
          <section className="mt-10 space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    {result.title || result.url}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{result.url}</p>
                </div>
                <div
                  className={`rounded-full px-4 py-1 text-sm font-semibold ${
                    totalViolations === 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {totalViolations} issues
                </div>
              </div>

              <div className="mt-6 grid grid-cols-4 gap-3 text-center">
                <SummaryCard label="Critical" value={result.summary.critical} color="text-red-600" />
                <SummaryCard label="Serious" value={result.summary.serious} color="text-orange-600" />
                <SummaryCard label="Moderate" value={result.summary.moderate} color="text-yellow-600" />
                <SummaryCard label="Minor" value={result.summary.minor} color="text-blue-600" />
              </div>

              <div className="mt-4 text-sm text-slate-500">
                {result.passes} checks passed · {result.incomplete} need manual review · {totalNodes} elements affected
              </div>
            </div>

            {result.violations.map((v) => (
              <article
                key={v.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-semibold text-slate-900">{v.help}</h3>
                  {v.impact && (
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        impactColor[v.impact] || "bg-slate-200"
                      }`}
                    >
                      {v.impact}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-slate-600">{v.description}</p>
                <p className="mt-2 text-xs text-slate-500">
                  Rule: <code>{v.id}</code> ·{" "}
                  <a
                    href={v.helpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-slate-800"
                  >
                    Learn more
                  </a>
                </p>
                <details className="mt-3" open>
                  <summary className="cursor-pointer text-sm font-medium text-slate-700">
                    {v.nodes.length} affected element{v.nodes.length === 1 ? "" : "s"}
                  </summary>
                  <div className="mt-3 space-y-3">
                    {v.nodes.slice(0, 5).map((n, i) => {
                      const key = `${v.id}-${i}`;
                      const fixState = fixes[key] || { status: "idle" };
                      return (
                        <div key={i} className="rounded-md bg-slate-50 p-3 text-xs">
                          <pre className="whitespace-pre-wrap break-all font-mono text-slate-700">
                            {n.html}
                          </pre>
                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="text-slate-500">
                              Selector:{" "}
                              <code className="font-mono">{n.target.join(" ")}</code>
                            </div>
                            {fixState.status === "idle" && (
                              <button
                                onClick={() => handleFix(v, i)}
                                className="shrink-0 rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                              >
                                ✨ Generate fix
                              </button>
                            )}
                            {fixState.status === "loading" && (
                              <div className="shrink-0 text-xs text-slate-500">
                                <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 align-middle"></span>{" "}
                                Generating...
                              </div>
                            )}
                          </div>
                          {fixState.status === "error" && (
                            <div className="mt-2 rounded bg-red-50 p-2 text-xs text-red-800">
                              Error: {fixState.error}
                            </div>
                          )}
                          {fixState.status === "done" && (
                            <div className="mt-3 space-y-2 border-t border-slate-200 pt-3">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-800">
                                  AI suggested fix
                                </span>
                                <span
                                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                    confidenceColor[fixState.fix.confidence]
                                  }`}
                                >
                                  {fixState.fix.confidence} confidence
                                </span>
                                {fixState.fix.manual_review_needed && (
                                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-orange-700">
                                    Review needed
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-700">
                                <strong>Why it broke:</strong>{" "}
                                {fixState.fix.explanation}
                              </p>
                              <p className="text-slate-700">
                                <strong>Fix strategy:</strong>{" "}
                                {fixState.fix.fix_strategy}
                              </p>
                              {fixState.fix.patches.map((p, pi) => (
                                <div
                                  key={pi}
                                  className="rounded-md border border-slate-200 bg-white p-2"
                                >
                                  <div className="mb-1 text-[10px] font-semibold uppercase text-red-700">
                                    Before
                                  </div>
                                  <pre className="whitespace-pre-wrap break-all rounded bg-red-50 p-2 font-mono text-[11px] text-red-900">
                                    {p.before}
                                  </pre>
                                  <div className="mt-2 mb-1 text-[10px] font-semibold uppercase text-green-700">
                                    After
                                  </div>
                                  <pre className="whitespace-pre-wrap break-all rounded bg-green-50 p-2 font-mono text-[11px] text-green-900">
                                    {p.after}
                                  </pre>
                                  {p.notes && (
                                    <div className="mt-2 text-[11px] text-slate-600">
                                      📝 {p.notes}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {v.nodes.length > 5 && (
                      <p className="text-xs text-slate-500">+ {v.nodes.length - 5} more</p>
                    )}
                  </div>
                </details>
              </article>
            ))}

            {totalViolations === 0 && (
              <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center text-green-900">
                <p className="text-lg font-semibold">No automated violations detected!</p>
                <p className="mt-2 text-sm">
                  Automated tools catch ~57% of WCAG issues. Manual review is still recommended.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
    </div>
  );
}
