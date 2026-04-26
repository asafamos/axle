"use client";

import { useState } from "react";

type State =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

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
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(txt || `${res.status}`);
      }
      setState({ kind: "success" });
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

  if (state.kind === "success") {
    return (
      <div className="text-center">
        <div className="text-3xl">✓</div>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Scan queued. Check your inbox.
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;re scanning <code className="rounded bg-slate-100 px-1">{url}</code>{" "}
          now. The full report will arrive at <strong>{email}</strong> in 2-5
          minutes. Check spam if you don&apos;t see it.
        </p>
        <p className="mt-4 text-sm text-slate-700">
          While you wait — most teams add{" "}
          <a
            className="underline"
            href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
            target="_blank"
            rel="noopener"
          >
            the GitHub Action
          </a>{" "}
          so future regressions get caught automatically.
        </p>
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
          Where to send the report
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
          One report per scan. We don&apos;t sell or share your email.
        </p>
      </div>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-md bg-emerald-600 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.kind === "submitting"
          ? "Scanning..."
          : "Email me the WCAG 2.2 AA report"}
      </button>

      {state.kind === "error" ? (
        <p className="text-sm text-rose-600" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
