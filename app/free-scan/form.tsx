"use client";

import { useState } from "react";

type Locale = "en" | "he";

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

/**
 * All user-visible copy, per locale. The Hebrew landing page (/he/bdikat-negishut)
 * reuses this exact flow so there is one scan form to maintain. Rule ids and the
 * one-line rule descriptions come straight from axe-core and stay in English in
 * both locales (the Hebrew copy says so).
 */
const COPY = {
  en: {
    urlLabel: "URL to scan",
    urlPlaceholder: "https://example.com",
    emailLabel: "Where to send a copy of the report",
    emailHint:
      "Results show here instantly; we email a copy too. We don't sell or share your email.",
    submit: "Scan for WCAG 2.2 AA issues",
    submitting: "Scanning… (10–20s)",
    genericError: "Something went wrong. Try again or email info@axlescan.com.",
    couldNotScan: (host: string) => `Couldn't scan ${host}`,
    tryAnother: "Try another URL",
    scanAnother: "Scan another",
    clean: (host: string) => `No automated issues found on ${host}`,
    cleanBody: (email: string) => ({
      before:
        "Nice — axe-core found no WCAG 2.1 / 2.2 AA violations it can detect automatically. Automated testing catches ~57% of issues, so a human review is still worth doing. A copy is on its way to ",
      email,
    }),
    found: (n: number, host: string) =>
      `${n} issue type${n === 1 ? "" : "s"} found on ${host}`,
    impact: {
      critical: "critical",
      serious: "serious",
      moderate: "moderate",
      minor: "minor",
    } as Record<string, string>,
    issue: "issue",
    elements: (n: number) => `${n} element${n === 1 ? "" : "s"}`,
    footnote: (email: string) => ({
      lead: "A copy of this report is on its way to ",
      email,
      tail: " (check spam). Automated testing catches ~57% of WCAG issues — a human review is still recommended for full conformance.",
    }),
    ctaPlugin: "Get the free WordPress plugin →",
    ctaPaid: "Fix these for me — $19/mo →",
    ctaStatement: null as string | null,
    utm: "scan-result-en",
  },
  he: {
    urlLabel: "כתובת האתר לבדיקה",
    urlPlaceholder: "https://example.co.il",
    emailLabel: "לאן לשלוח עותק של הדוח",
    emailHint:
      "התוצאות מופיעות כאן מיד, ונשלח גם עותק למייל. לא מוכרים ולא משתפים את האימייל שלך.",
    submit: "בדיקת נגישות (WCAG 2.2 AA)",
    submitting: "בודקים… (10–20 שניות)",
    genericError: "משהו השתבש. נסו שוב או כתבו ל-info@axlescan.com.",
    couldNotScan: (host: string) => `לא הצלחנו לבדוק את ${host}`,
    tryAnother: "נסו כתובת אחרת",
    scanAnother: "בדיקת אתר נוסף",
    clean: (host: string) => `לא נמצאו בעיות אוטומטיות ב-${host}`,
    cleanBody: (email: string) => ({
      before:
        "מצוין: axe-core לא זיהה הפרות WCAG 2.1 / 2.2 AA שאפשר לזהות אוטומטית. בדיקה אוטומטית תופסת כ-57% מהבעיות, ולכן עדיין כדאי גם סקירה אנושית. עותק נשלח אל ",
      email,
    }),
    found: (n: number, host: string) => `נמצאו ${n} סוגי בעיות ב-${host}`,
    impact: {
      critical: "קריטי",
      serious: "חמור",
      moderate: "בינוני",
      minor: "קל",
    } as Record<string, string>,
    issue: "בעיה",
    elements: (n: number) => (n === 1 ? "אלמנט אחד" : `${n} אלמנטים`),
    footnote: (email: string) => ({
      lead: "עותק של הדוח בדרך אל ",
      email,
      tail: " (כדאי לבדוק גם בספאם). שם הכלל והתיאור מופיעים באנגלית, כפי שהם ב-axe-core, ומקושרים להסבר המלא. בדיקה אוטומטית תופסת כ-57% מבעיות WCAG, ולכן מומלצת גם בדיקה אנושית לעמידה מלאה.",
    }),
    ctaPlugin: "התוסף החינמי לוורדפרס ←",
    ctaPaid: "תקנו לי את זה — $19 לחודש ←",
    ctaStatement: "יצירת הצהרת נגישות חינם ←",
    utm: "scan-result-he",
  },
} as const;

export default function FreeScanForm({
  locale = "en",
  source = "free-scan-page",
}: {
  locale?: Locale;
  source?: string;
}) {
  const c = COPY[locale];
  const isHe = locale === "he";
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
        body: JSON.stringify({ url, email, source, locale }),
      });
      const data = (await res.json().catch(() => null)) as ScanResp | { error?: string } | null;
      if (!res.ok || !data || !("ok" in data)) {
        const msg =
          data && "error" in data && data.error
            ? data.error
            : `${c.genericError} (${res.status})`;
        throw new Error(msg);
      }
      setState({ kind: "done", data, email });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : c.genericError,
      });
    }
  }

  function reset() {
    setState({ kind: "idle" });
    setUrl("");
  }

  // Wrapper carries direction + language for the Hebrew page; the English page
  // gets a plain div, exactly as before.
  const wrapProps = isHe ? { dir: "rtl" as const, lang: "he" } : {};

  if (state.kind === "done") {
    const d = state.data;

    if (!d.scanned) {
      return (
        <div {...wrapProps}>
          <h2 className="text-xl font-bold text-slate-900">
            {c.couldNotScan(d.host)}
          </h2>
          <p className="mt-2 text-sm text-slate-600">{d.message}</p>
          <button
            type="button"
            onClick={reset}
            className="mt-4 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            {c.tryAnother}
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
          {c.ctaPlugin}
        </a>
        <a
          href={`/pricing?utm_source=${c.utm}`}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
        >
          {c.ctaPaid}
        </a>
        {c.ctaStatement ? (
          <a
            href={`/statement?utm_source=${c.utm}`}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            {c.ctaStatement}
          </a>
        ) : null}
        <button
          type="button"
          onClick={reset}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          {c.scanAnother}
        </button>
      </div>
    );

    if (total === 0) {
      const body = c.cleanBody(state.email);
      return (
        <div {...wrapProps}>
          <div className="text-3xl">✅</div>
          <h2 className="mt-2 text-xl font-bold text-slate-900">
            {c.clean(d.host)}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {body.before}
            <strong dir="ltr">{body.email}</strong>.
          </p>
          {cta}
        </div>
      );
    }

    const foot = c.footnote(state.email);
    return (
      <div {...wrapProps}>
        <h2 className="text-xl font-bold text-slate-900">
          {c.found(total, d.host)}
        </h2>
        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
          {(["critical", "serious", "moderate", "minor"] as const).map((k) =>
            s[k] > 0 ? (
              <span
                key={k}
                className={`rounded px-2 py-0.5 ${IMPACT_STYLE[k]}`}
              >
                {s[k]} {c.impact[k]}
              </span>
            ) : null,
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
                  {v.impact ? c.impact[v.impact] : c.issue}
                </span>
                <div>
                  <a
                    href={v.helpUrl}
                    target="_blank"
                    rel="noopener"
                    dir="ltr"
                    className="font-mono text-xs text-slate-900 underline"
                  >
                    {v.id}
                  </a>
                  <p className="text-slate-700">
                    <span dir="ltr">{v.help}</span>{" "}
                    <span className="text-slate-500">
                      ({c.elements(v.nodeCount)})
                    </span>
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-slate-600">
          {foot.lead}
          <strong dir="ltr">{foot.email}</strong>
          {foot.tail}
        </p>
        {cta}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" {...wrapProps}>
      <div>
        <label
          htmlFor="free-scan-url"
          className="block text-sm font-semibold text-slate-700"
        >
          {c.urlLabel}
        </label>
        <input
          id="free-scan-url"
          type="url"
          required
          dir="ltr"
          placeholder={c.urlPlaceholder}
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
          {c.emailLabel}
        </label>
        <input
          id="free-scan-email"
          type="email"
          required
          dir="ltr"
          placeholder="you@yourcompany.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={state.kind === "submitting"}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
        />
        <p className="mt-1 text-xs text-slate-600">{c.emailHint}</p>
      </div>

      <button
        type="submit"
        disabled={state.kind === "submitting"}
        className="w-full rounded-md bg-emerald-700 px-4 py-3 text-base font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.kind === "submitting" ? c.submitting : c.submit}
      </button>

      {state.kind === "error" ? (
        <p className="text-sm text-rose-700" role="alert">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
