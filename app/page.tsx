"use client";

import { useEffect, useState } from "react";
import type { ScanResult, AxeViolation } from "@/lib/scanner";
import { getStoredUtmSource } from "./utm-tracker";
import { ScanLeadCapture } from "./scan-lead-capture";

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
  const [rateLimited, setRateLimited] = useState(false);
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
    setRateLimited(false);
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, source: getStoredUtmSource() || "web" }),
      });
      const data = await res.json();
      if (res.status === 402 && data.code === "rate_limited") {
        setRateLimited(true);
        throw new Error(data.error || "Daily limit reached");
      }
      if (!res.ok) throw new Error(data.error || "Scan failed");
      setResult(data);
      if (typeof window !== "undefined") {
        document
          .getElementById("scan-results")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
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
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header />

      <Hero
        url={url}
        setUrl={setUrl}
        loading={loading}
        onSubmit={handleSubmit}
      />

      {error && (
        <div className="mx-auto max-w-3xl px-6">
          <div
            className={`rounded-lg border p-4 ${
              rateLimited
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-red-300 bg-red-50 text-red-800"
            }`}
          >
            {rateLimited ? (
              <>
                <strong>Daily limit reached.</strong> {error}{" "}
                <a href="#pricing" className="font-semibold underline">
                  See plans →
                </a>
              </>
            ) : (
              <>
                <strong>Error:</strong> {error}
              </>
            )}
          </div>
        </div>
      )}

      {loading && (
        <div className="mx-auto max-w-3xl px-6 pt-6 text-center text-slate-600">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-900" />
          <p className="mt-3">
            Launching headless Chromium and running axe-core. 10–30s.
          </p>
        </div>
      )}

      {result && !loading && (
        <section id="scan-results" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-16">
          <ScanResultPanel
            result={result}
            fixes={fixes}
            totalViolations={totalViolations}
            totalNodes={totalNodes}
            onFix={handleFix}
          />
          <ScanLeadCapture
            scanUrl={result.url}
            totalViolations={totalViolations}
            critical={result.summary.critical}
            serious={result.summary.serious}
          />
        </section>
      )}

      <PressureSection />
      <FeatureGrid />
      <ArtifactsSection />
      <IntegrationsStrip />
      <PricingPreview />
      <FAQ />
      <Footer />
    </main>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: "#features", label: "Features" },
    { href: "#integrations", label: "Integrations" },
    { href: "#pricing", label: "Pricing" },
    { href: "/statement", label: "Hebrew statement" },
  ];
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="/" className="flex items-center gap-2 font-bold">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-white">a</span>
          <span className="text-lg tracking-tight">axle</span>
          <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 sm:inline">
            private beta
          </span>
        </a>
        <nav className="hidden items-center gap-1 text-sm md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-slate-700 hover:bg-slate-100"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/asafamos/axle"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-700"
          >
            GitHub
          </a>
        </nav>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:bg-slate-100 md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {open ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-slate-200 bg-white px-6 py-3 md:hidden"
        >
          <ul className="flex flex-col gap-1 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-slate-700 hover:bg-slate-100"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/asafamos/axle"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-slate-900 px-3 py-2 text-center font-medium text-white hover:bg-slate-700"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function ScanCounter() {
  const [stats, setStats] = useState<{
    scans_today: number;
    scans_all_time: number;
    fixes_all_time: number;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setStats(d);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!stats || (stats.scans_all_time === 0 && stats.fixes_all_time === 0)) {
    return null;
  }

  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`);

  return (
    <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
      <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
      <span>
        <strong className="text-slate-700">{fmt(stats.scans_all_time)}</strong> scans ·{" "}
        <strong className="text-slate-700">{fmt(stats.fixes_all_time)}</strong> AI fixes shipped
      </span>
    </p>
  );
}

function Hero({
  url,
  setUrl,
  loading,
  onSubmit,
}: {
  url: string;
  setUrl: (v: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Built for the EAA 2025 + ADA + Israeli equality regulations
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Ship accessible code.{" "}
              <span className="bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
                Automatically.
              </span>
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              axle is the compliance CI for modern websites. One GitHub Action scans every PR for
              WCAG 2.1 / 2.2 AA violations, proposes real code fixes with Claude, and generates the
              legal artifacts your lawyer asks for. No overlay widgets.
            </p>
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-site.com"
                disabled={loading}
                required
                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-3 shadow-sm focus:border-slate-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={loading || !url}
                className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white shadow-sm transition hover:bg-slate-700 disabled:opacity-50"
              >
                {loading ? "Scanning…" : "Scan for free"}
              </button>
            </form>
            {/*
              text-slate-500 on white was 4.34:1 — barely below the 4.5:1
              WCAG AA minimum at this small size. Bumped to slate-600 (5.04:1)
              and the inline <code> uses slate-900 on slate-200 (16.7:1) to
              clear the bar with margin. axle's own dogfood scan caught this
              within 6 days; fixed in PR #16.
            */}
            <p className="mt-3 text-xs text-slate-600">
              No signup. Real headless browser + axe-core 4.11. ~15s. 3 free scans/day · <a href="#pricing" className="underline hover:text-slate-900">unlimited with Team</a>.
              {" "}Each scan gets a shareable <code className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-900">/r/&lt;id&gt;</code> URL with a custom OG image.
            </p>
            <ScanCounter />
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a
                href="https://github.com/marketplace/actions/axle-accessibility-compliance-ci"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-800 hover:bg-slate-100"
              >
                ▸ Install GitHub Action
              </a>
              <a
                href="/statement"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 font-medium text-slate-800 hover:bg-slate-100"
              >
                🇮🇱 Hebrew statement generator
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-slate-500">PR #42 · axle bot</span>
            </div>
            <div className="space-y-3 pt-4 text-sm">
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-red-900">
                    ❌ Accessibility check failed (serious+)
                  </span>
                  <span className="text-xs text-red-700">3 critical · 2 serious</span>
                </div>
                <p className="mt-1 text-xs text-red-800">
                  <code>aria-valid-attr</code> · <code>button-name</code> · <code>color-contrast</code>
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-xs font-semibold uppercase text-slate-500">Suggested fix · high confidence</div>
                <pre className="mt-1 overflow-x-auto rounded bg-white p-2 text-[11px] leading-snug">
                  <span className="text-red-700">
                    - {'<ul aria-labeledby="tb-trigger">'}
                  </span>
                  {"\n"}
                  <span className="text-emerald-700">
                    + {'<ul aria-labelledby="tb-trigger">'}
                  </span>
                </pre>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
                ✨ Apply fix → re-run check → green ✓
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PressureSection() {
  const items = [
    {
      flag: "🇪🇺",
      law: "European Accessibility Act",
      date: "In force June 2025",
      text: "Every company selling into the EU must meet WCAG 2.1 AA. Fines up to €1M per violation.",
    },
    {
      flag: "🇺🇸",
      law: "ADA Title III",
      date: "Enforced",
      text: "4,000+ web-accessibility lawsuits per year. Average cost of settlement: $50K.",
    },
    {
      flag: "🇮🇱",
      law: "חוק שוויון זכויות לאנשים עם מוגבלות",
      date: "תקנות 5568",
      text: "הצהרת נגישות בעברית חובה לכל אתר ישראלי. נציבות שוויון זכויות אוכפת.",
    },
  ];
  return (
    <section className="border-y border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
          Why now
        </p>
        <h2 className="mt-2 text-center text-2xl font-bold sm:text-3xl">
          The legal ground just shifted under your website
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.law}
              className="rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="text-2xl">{it.flag}</div>
              <div className="mt-2 font-semibold text-slate-900">{it.law}</div>
              <div className="text-xs text-slate-500">{it.date}</div>
              <p className="mt-2 text-sm text-slate-700">{it.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    {
      title: "PR-native compliance check",
      desc: "Every pull request gets a scan. Violations are posted inline with severity and WCAG rule references. Regressions block merge.",
      icon: "🔒",
    },
    {
      title: "Real code fixes, not widgets",
      desc: "Claude Sonnet proposes surgical diffs per violation. Confidence + human-review flags keep you out of accessiBe territory.",
      icon: "🧠",
    },
    {
      title: "Audit trail for lawyers",
      desc: "Every scan, every fix, every approval — timestamped and exportable. The artifact you need when a demand letter arrives.",
      icon: "📜",
    },
    {
      title: "Hebrew + EU-wide statements",
      desc: "Generates accessibility statements aligned with תקנה 35 and the EAA. Hebrew today; French, German, Spanish soon.",
      icon: "🌍",
    },
    {
      title: "Continuous monitoring",
      desc: "Nightly scans of production URLs. Alert on regressions. Track compliance score across a portfolio of sites.",
      icon: "📈",
    },
    {
      title: "Public compliance badge",
      desc: "Embed a shield on your site showing live WCAG 2.1 AA status — updated on every scan. Free, even on the free tier.",
      icon: "🛡️",
    },
    {
      title: "Shareable scan results",
      desc: "Every scan auto-generates a public URL like axle-iota.vercel.app/r/<id> with a custom OG image. Send to a stakeholder, drop in Slack, link from your accessibility statement. 30-day TTL.",
      icon: "🔗",
    },
  ];
  return (
    <section id="features" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            What's in the box
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Not a scanner. A compliance workflow.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Scanners are a commodity. axle bundles the scan with the thing you actually need to sell
            accessibility internally: a workflow, artifacts, and a paper trail.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-2xl">{f.icon}</div>
              <div className="mt-3 font-semibold">{f.title}</div>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArtifactsSection() {
  return (
    <section className="bg-slate-900 py-20 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Free tool
            </p>
            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Hebrew accessibility statement — generated in your browser, in 60 seconds.
            </h2>
            <p className="mt-4 text-slate-300">
              Aligned with תקנות שוויון זכויות לאנשים עם מוגבלות (תקנה 35). Outputs
              clean, styled HTML you can drop straight on your site. No signup, no upload,
              nothing leaves your browser.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/statement"
                className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
              >
                Generate statement →
              </a>
              <span className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-300">
                Coming: FR, DE, ES, IT for EAA coverage
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 text-right" dir="rtl">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              תצוגה מקדימה
            </div>
            <h3 className="mt-2 text-xl font-bold">הצהרת נגישות — דוגמה בע״מ</h3>
            <p className="mt-2 text-sm text-slate-300">
              חברת דוגמה בע״מ מחויבת לאפשר לכל אדם, לרבות אנשים עם מוגבלות, גישה
              מלאה ושוויונית לאתר.
            </p>
            <div className="mt-3 text-sm font-semibold text-white">תקן הנגישות החל</div>
            <p className="text-sm text-slate-300">
              האתר נבדק לעמידה ב-WCAG 2.1 Level AA בתאריך 17.4.2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function IntegrationsStrip() {
  const rows = [
    { name: "GitHub Action", status: "live", href: "https://github.com/asafamos/axle-action" },
    { name: "npm CLI", status: "live", href: "https://www.npmjs.com/package/axle-cli" },
    { name: "VS Code Extension", status: "live", href: "https://marketplace.visualstudio.com/items?itemName=asafamos.axle-a11y" },
    { name: "MCP Server (Claude / Cursor / Cline)", status: "live", href: "/mcp" },
    { name: "Storybook Addon", status: "live", href: "https://www.npmjs.com/package/axle-storybook" },
    { name: "ChatGPT GPT / OpenAPI", status: "live", href: "/gpt" },
    { name: "Slack / Linear / Jira / GitLab", status: "live", href: "/integrations" },
    { name: "Netlify Plugin", status: "live", href: "https://www.npmjs.com/package/axle-netlify-plugin" },
    { name: "Cloudflare Pages", status: "live", href: "https://www.npmjs.com/package/axle-cloudflare-plugin" },
    { name: "Vercel", status: "live", href: "https://www.npmjs.com/package/axle-vercel-plugin" },
    { name: "WordPress Plugin", status: "beta", href: "https://github.com/asafamos/axle/tree/main/packages/axle-wordpress" },
    { name: "Shopify App", status: "planned", href: "#" },
  ];
  const badge: Record<string, string> = {
    live: "bg-emerald-100 text-emerald-800",
    beta: "bg-sky-100 text-sky-800",
    soon: "bg-amber-100 text-amber-800",
    planned: "bg-slate-100 text-slate-600",
  };
  return (
    <section id="integrations" className="border-y border-slate-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Runs where you already deploy
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            One scanner, every pipeline
          </h2>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((r) => (
            <a
              key={r.name}
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100"
            >
              <span className="font-medium text-slate-800">{r.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                  badge[r.status] ?? "bg-slate-100 text-slate-600"
                }`}
              >
                {r.status}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPreview() {
  const [checkoutPlan, setCheckoutPlan] = useState<null | "team" | "business">(
    null
  );
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function subscribe(plan: "team" | "business") {
    setCheckoutPlan(plan);
    setCheckoutError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Unknown error");
      setCheckoutPlan(null);
    }
  }

  const tiers: Array<{
    name: string;
    price: string;
    sub: string;
    bullets: string[];
    cta: string;
    highlight: boolean;
    onClick: () => void;
  }> = [
    {
      name: "Open",
      price: "$0",
      sub: "forever",
      bullets: [
        "Unlimited scans, 1 repo",
        "PR comments + status checks",
        "Public compliance badge",
        "Hebrew statement generator",
        "BYO Anthropic API key for AI fixes",
      ],
      cta: "Install free",
      highlight: false,
      onClick: () =>
        document
          .getElementById("features")
          ?.scrollIntoView({ behavior: "smooth" }),
    },
    {
      name: "Team",
      price: "$49",
      sub: "per month",
      bullets: [
        "Up to 10 repos / domains",
        "Hosted AI fixes — no BYO key",
        "Nightly production monitoring",
        "Audit trail PDF exports",
        "Slack + email alerts",
      ],
      cta: "Subscribe",
      highlight: true,
      onClick: () => subscribe("team"),
    },
    {
      name: "Business",
      price: "$299",
      sub: "per month",
      bullets: [
        "Unlimited repos / domains",
        "Multi-language statements (EAA)",
        "Priority fix queue",
        "SSO + private audit log",
        "Compliance officer dashboard",
      ],
      cta: "Contact sales",
      highlight: false,
      onClick: () =>
        (window.location.href =
          "mailto:asaf@amoss.co.il?subject=axle%20Business%20plan"),
    },
  ];
  return (
    <section id="pricing" className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            Cheaper than an hour with a compliance lawyer
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Self-serve. No seat counts. No procurement call.
          </p>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-xl border p-6 shadow-sm ${
                t.highlight
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-900"
              }`}
            >
              <div
                className={`text-sm font-semibold uppercase tracking-wider ${
                  t.highlight ? "text-emerald-300" : "text-slate-500"
                }`}
              >
                {t.name}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold">{t.price}</span>
                <span className={`text-sm ${t.highlight ? "text-slate-300" : "text-slate-500"}`}>
                  {t.sub}
                </span>
              </div>
              <ul className="mt-5 space-y-2 text-sm">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className={t.highlight ? "text-emerald-400" : "text-emerald-600"}>
                      ✓
                    </span>
                    <span className={t.highlight ? "text-slate-200" : "text-slate-700"}>
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={t.onClick}
                disabled={checkoutPlan !== null}
                className={`mt-6 w-full rounded-md px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
                  t.highlight
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                {checkoutPlan === t.name.toLowerCase()
                  ? "Redirecting…"
                  : t.cta}
              </button>
            </div>
          ))}
        </div>
        {checkoutError && (
          <div className="mx-auto mt-6 max-w-xl rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            Checkout failed: {checkoutError}
          </div>
        )}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Is this just another accessibility overlay?",
      a: "No — and we're aggressive about it. Overlay widgets got accessiBe a $1M FTC fine in January 2025. axle never injects runtime JavaScript into your page. We scan, we suggest source-code diffs, you merge.",
    },
    {
      q: "Does it replace a human accessibility audit?",
      a: "No. Automated scanners (axe-core included) catch ~57% of WCAG issues. axle is the continuous, fast, cheap layer. Book a human auditor for the final 43%.",
    },
    {
      q: "What's the accuracy of the AI fixes?",
      a: "High confidence on attribute fixes and most ARIA issues; lower confidence on contrast, focus order, and structural fixes. Every fix ships with a confidence score and a manual-review flag. You approve before it merges.",
    },
    {
      q: "Will this work on my non-Next.js site?",
      a: "Yes. The GitHub Action accepts any URL — localhost build, Vercel preview, Netlify preview, or a deployed domain. Works on WordPress, Shopify storefronts, static sites, Rails, Django, etc.",
    },
    {
      q: "Can I use it without signing up?",
      a: "Yes. The quick scan at the top of this page and the Hebrew statement generator both run without an account. Sign up is only required for CI integration, nightly monitoring, and billing-tracked AI fixes.",
    },
  ];
  return (
    <section className="border-t border-slate-200 bg-white py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-center text-3xl font-bold sm:text-4xl">FAQ</h2>
        <div className="mt-10 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50">
          {items.map((it) => (
            <details key={it.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                <span>{it.q}</span>
                <span className="text-slate-400 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-slate-700">{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-900 text-white">
                a
              </span>
              <span className="text-lg tracking-tight">axle</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Continuous WCAG compliance for the modern web. Real code fixes. No widgets.
            </p>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Product
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="#features" className="text-slate-700 hover:underline">Features</a></li>
              <li><a href="#integrations" className="text-slate-700 hover:underline">Integrations</a></li>
              <li><a href="/pricing" className="text-slate-700 hover:underline">Pricing</a></li>
              <li><a href="/docs" className="text-slate-700 hover:underline">Docs</a></li>
              <li><a href="/free-scan" className="text-slate-700 hover:underline">Free scan</a></li>
              <li><a href="/statement" className="text-slate-700 hover:underline">Hebrew statement</a></li>
              <li><a href="/partners" className="text-slate-700 hover:underline">Partners (30% recurring)</a></li>
              <li><a href="/changelog" className="text-slate-700 hover:underline">Changelog</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resources
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="/guides" className="text-slate-700 hover:underline">Guides (EAA / stacks)</a></li>
              <li><a href="/faq" className="text-slate-700 hover:underline">FAQ</a></li>
              <li><a href="/wcag-checker" className="text-slate-700 hover:underline">WCAG checker</a></li>
              <li><a href="/accessibility-checker" className="text-slate-700 hover:underline">Accessibility checker</a></li>
              <li><a href="/section-508-checker" className="text-slate-700 hover:underline">Section 508 checker</a></li>
              <li><a href="/web-accessibility-audit" className="text-slate-700 hover:underline">Audit guide</a></li>
              <li><a href="/vpat-template" className="text-slate-700 hover:underline">VPAT template guide</a></li>
              <li><a href="/ada-demand-letter" className="text-slate-700 hover:underline">Got an ADA letter?</a></li>
              <li><a href="/why-not-overlay" className="text-slate-700 hover:underline">Why not overlays</a></li>
              <li><a href="/checklist/wcag-2-2-aa" className="text-slate-700 hover:underline">WCAG 2.2 checklist</a></li>
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Legal
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              <li><a href="/privacy" className="text-slate-700 hover:underline">Privacy policy</a></li>
              <li><a href="/terms" className="text-slate-700 hover:underline">Terms</a></li>
              <li className="text-xs text-slate-500">
                axle provides remediation assistance. It is not a substitute for legal advice or a
                human accessibility audit, and does not issue compliance certificates.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ScanResultPanel({
  result,
  fixes,
  totalViolations,
  totalNodes,
  onFix,
}: {
  result: ScanResult;
  fixes: Record<string, FixState>;
  totalViolations: number;
  totalNodes: number;
  onFix: (v: AxeViolation, i: number) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
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
          {result.passes} checks passed · {result.incomplete} need manual review · {totalNodes} elements
        </div>
        {result.permalink ? <ShareResultRow permalink={result.permalink} /> : null}
      </div>

      {result.violations.map((v) => (
        <article
          key={v.id}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold">{v.help}</h3>
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
                        Selector: <code className="font-mono">{n.target.join(" ")}</code>
                      </div>
                      {fixState.status === "idle" && (
                        <button
                          onClick={() => onFix(v, i)}
                          className="shrink-0 rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700"
                        >
                          ✨ Generate fix
                        </button>
                      )}
                      {fixState.status === "loading" && (
                        <div className="shrink-0 text-xs text-slate-500">
                          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 align-middle" />{" "}
                          Generating…
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
                          <span className="font-semibold">AI suggested fix</span>
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
                <p className="text-xs text-slate-500">
                  + {v.nodes.length - 5} more
                </p>
              )}
            </div>
          </details>
        </article>
      ))}

      {totalViolations === 0 && (
        <div className="rounded-xl border border-green-300 bg-green-50 p-6 text-center text-green-900">
          <p className="text-lg font-semibold">No automated violations detected.</p>
          <p className="mt-2 text-sm">
            Automated tools catch ~57% of WCAG issues. Manual review is still recommended.
          </p>
        </div>
      )}
    </div>
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

/**
 * Public-result share row. Rendered only when the API returned a permalink
 * (i.e. the URL was publicly resolvable so we persisted a /r/<id> page).
 * The shareable URL is stored 30 days. We surface it explicitly so the user
 * actively decides to share — internal/staging URLs that we don't persist
 * never get this row.
 */
function ShareResultRow({ permalink }: { permalink: string }) {
  const [copied, setCopied] = useState(false);
  const fullUrl =
    typeof window !== "undefined" ? `${window.location.origin}${permalink}` : permalink;

  async function copy() {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may be blocked — fall through and let the user select.
    }
  }

  return (
    <div className="mt-5 flex flex-col gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm sm:flex-row sm:items-center">
      <span className="font-semibold text-emerald-900">Share this result:</span>
      <code
        className="flex-1 select-all overflow-x-auto rounded border border-emerald-200 bg-white px-2 py-1 text-xs text-emerald-900"
        data-testid="result-permalink"
      >
        {fullUrl}
      </code>
      <button
        type="button"
        onClick={copy}
        className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
      >
        {copied ? "Copied ✓" : "Copy link"}
      </button>
      <a
        href={permalink}
        target="_blank"
        rel="noopener"
        className="rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-900 hover:bg-emerald-100"
      >
        Open page →
      </a>
    </div>
  );
}
