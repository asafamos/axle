"use client";

import { useState } from "react";

type Violation = {
  id: string;
  impact: "minor" | "moderate" | "serious" | "critical" | null;
  help: string;
  helpUrl: string;
  nodeCount: number;
};

type ScanResp =
  | {
      ok: true;
      scanned: true;
      host: string;
      title?: string;
      total: number;
      summary: { critical: number; serious: number; moderate: number; minor: number };
      violations: Violation[];
      emailed: string;
    }
  | { ok: true; scanned: false; host: string; message: string };

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "done"; data: ScanResp; email: string }
  | { kind: "error"; message: string };

const IMPACT_STYLE: Record<string, string> = {
  critical: "bg-red-600 text-white",
  serious: "bg-orange-500 text-white",
  moderate: "bg-yellow-400 text-black",
  minor: "bg-blue-400 text-white",
};

const PLUGIN_URL =
  "https://wordpress.org/plugins/asafamos-accessibility-scanner/";

export default function FreeScanForm() {
  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url || !email) return;
    setState({ kind: "submitting" });
    try {
      const res = await fetch("/api/free-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, email, source: "free-scan-page" }),
      });
      const data = (await res.json().catch(() => null)) as ScanResp | { error?: string } | null;
      if (!res.ok || !data || !("ok" in data)) {
        const msg =
          data && "error" in data && data.error
            ? data.error
            : `Something went wrong (${res.status}). Try again or email asaf@amoss.co.il.`;
        throw new Error(msg);
      }
      setState({ kind: "done", data, email });
    } catch (err) {
      setState({
        kind: "error",
        message:
          err instanceof Error
            ? err.message
            : "Something went wrong. Try again or email asaf@amoss.co.il.",
      });
    }
  }

  function reset() {
    setState({ kind: "idle" });
    setUrl("");
  }

  if (state.kind === "done") {
    const d = state.data;

    if (!d.scanned) {
      return (
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Couldn&apos;t scan {d.host}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{d.message}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Try another URL
          </button>
        </div>
      );
    }

    const { summary: s, total } = d;
    const cta = (
      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={PLUGIN_URL}
          target="_blank"
          rel="noopener"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Get the free WordPress plugin →
        </a>
        <a
          href="/pricing"
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          Fix these for me — $19/mo →
        </a>
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          Scan another
        </button>
      </div>
    );

    if (total === 0) {
      return (
        <div>
          <div className="text-3xl">✅</div>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            No automated issues found on {d.host}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Nice — axe-core found no WCAG 2.1 / 2.2 AA violations it can detect
            automatically. Automated testing catches ~57% of issues, so a human
            review is still worth doing. A copy is on its way to{" "}
            <strong>{state.email}</strong>.
          </p>
          {cta}
        </div>
      );
    }

    return (
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          {total} issue type{total === 1 ? "" : "s"} found on {d.host}
        </h2>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
          {s.critical > 0 && (
            <span className="rounded bg-red-600 px-2 py-0.5 text-white">
              {s.critical} critical
            </span>
          )}
          {s.serious > 0 && (
            <span className="rounded bg-orange-500 px-2 py-0.5 text-white">
              {s.serious} serious
            </span>
          )}
          {s.moderate > 0 && (
            <span className="rounded bg-yellow-400 px-2 py-0.5 text-black">
              {s.moderate} moderate
            </span>
          )}
          {s.minor > 0 && (
            <span className="rounded bg-blue-400 px-2 py-0.5 text-white">
              {s.minor} minor
            </span>
          )}
        </div>

        <ul className="mt-4 space-y-2">
          {d.violations.map((v) => (
            <li
              key={v.id}
              className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm"
            >
              <div className="flex items-start gap-2">
                <span
                  className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    IMPACT_STYLE[v.impact || "minor"] || "bg-slate-400 text-white"
                  }`}
                >
                  {v.impact || "issue"}
                </span>
                <div>
                  <a
                    href={v.helpUrl}
                    target="_blank"
                    rel="noopener"
                    className="font-mono text-xs text-slate-900 underline"
                  >
                    {v.id}
                  </a>
                  <p className="text-slate-700">
                    {v.help}{" "}
                    <span className="text-slate-400">
                      ({v.nodeCount} element{v.nodeCount === 1 ? "" : "s"})
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-slate-500">
          A copy of this report is on its way to <strong>{state.email}</strong>{" "}
          (check spam). Automated testing catches ~57% of WCAG issues — a human
          review is still recommended for full conformance.
        </p>
        {cta}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="free-scan-url"
          className="block text-sm font-semibold text-slate-700"
        >
          URL to scan
        </label>
        <input
          id="free-scan-url"
          type="url"
          required
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={state.kind === "submitting"}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
      </div>

      <div>
        <label
          htmlFor="free-scan-email"
          className="block text-sm font-semibold text-slate-700"
        >
          Where to send a copy of the report
        </label>
        <input
          id="free-scan-email"
          type="email"
          required
          placeholder="you@yourcompany.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state.kind === "submitting"}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <p className="mt-1 text-xs text-slate-500">
          Results show here instantly; we email a copy too. We don&apos;t sell or
          share your email.
        </p>
      </div>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-md bg-emerald-700 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.kind === "submitting"
          ? "Scanning… (10–20s)"
          : "Scan for WCAG 2.2 AA issues"}
      </button>

      {state.kind === "error" ? (
        <p className="text-sm text-rose-700" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
