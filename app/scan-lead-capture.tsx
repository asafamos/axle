"use client";

import { useState } from "react";

type Props = {
  scanUrl: string;
  totalViolations: number;
  critical: number;
  serious: number;
};

/**
 * Email-capture card rendered directly under a scan result.
 *
 * Conversion thesis: the moment right after a visitor sees a list of their
 * own site's accessibility violations is peak buyer intent. They have
 * acknowledged a real compliance risk. That's the moment to offer an easy
 * "monitor this over time" hook — it asks for almost nothing, tees up a
 * future email nurture toward the paid plan.
 *
 * Not shown when totalViolations === 0 (nothing to monitor; the user is
 * already compliant and this prompt would feel unnecessary).
 */
export function ScanLeadCapture({
  scanUrl,
  totalViolations,
  critical,
  serious,
}: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    | { kind: "idle" }
    | { kind: "loading" }
    | { kind: "success" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          url: scanUrl,
          violations: totalViolations,
          critical,
          serious,
          source: "scan-result",
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) throw new Error(data.error || "Subscribe failed");
      setState({ kind: "success" });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  if (totalViolations === 0) return null;

  if (state.kind === "success") {
    return (
      <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-emerald-600"
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <p className="font-semibold">
            You&apos;re in. We&apos;ll email you if <code className="rounded bg-emerald-100 px-1 text-sm">{scanUrl}</code>&apos;s score changes.
          </p>
        </div>
        <p className="mt-2 text-sm">
          Want it as a signed PDF your lawyer can hand the regulator?{" "}
          <a
            href="/#pricing"
            className="font-semibold underline decoration-emerald-400 underline-offset-2 hover:text-emerald-700"
          >
            See Team plan →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-5">
      <div className="flex items-start gap-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mt-0.5 h-5 w-5 flex-none text-amber-700"
          aria-hidden="true"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <div className="flex-1">
          <p className="font-semibold text-amber-900">
            {critical + serious > 0
              ? `${critical} critical and ${serious} serious violations found.`
              : `${totalViolations} violations found.`}{" "}
            Want to know when this changes?
          </p>
          <p className="mt-1 text-sm text-amber-800">
            We&apos;ll re-scan <code className="rounded bg-amber-100 px-1 text-xs">{scanUrl}</code> weekly and email you if the score drops
            or if new critical issues appear. Free, no signup, unsubscribe in one click.
          </p>
          <form onSubmit={submit} className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              disabled={state.kind === "loading"}
              className="flex-1 rounded-md border border-amber-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-amber-500 focus:outline-none disabled:opacity-50"
              autoComplete="email"
              spellCheck={false}
            />
            <button
              type="submit"
              disabled={state.kind === "loading" || !email.trim()}
              className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {state.kind === "loading" ? "Subscribing…" : "Watch this site →"}
            </button>
          </form>
          {state.kind === "error" && (
            <p className="mt-2 text-xs text-red-700">{state.message}</p>
          )}
          <p className="mt-2 text-xs text-amber-700">
            Only your email + this URL. No tracking, no signup, no spam.
            Paid plans add a signed PDF report + verified /s/&lt;id&gt; URL.
          </p>
        </div>
      </div>
    </div>
  );
}
