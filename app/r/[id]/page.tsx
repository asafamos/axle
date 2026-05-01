import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";
export const revalidate = 300;

type StoredViolation = {
  id: string;
  impact?: string | null;
  help?: string;
  helpUrl?: string;
  wcag?: string[];
  nodes?: Array<{ html?: string; target?: string[]; failureSummary?: string }>;
};

type StoredResult = {
  id: string;
  url: string;
  scanned_at: string;
  engine: string;
  summary: {
    violations?: number;
    critical?: number;
    serious?: number;
    moderate?: number;
    minor?: number;
    passes?: number;
  } | null;
  violations: StoredViolation[];
  source?: string;
};

async function getResult(id: string): Promise<StoredResult | null> {
  const redis = kv();
  if (!redis) return null;
  const raw = await redis.get<string | StoredResult>(`axle:result:${id}`);
  if (!raw) return null;
  if (typeof raw === "object") return raw as StoredResult;
  try {
    return JSON.parse(raw) as StoredResult;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) {
    return {
      title: "Scan result not found",
      robots: { index: false, follow: false },
    };
  }
  const total = result.summary?.violations ?? 0;
  const critical = result.summary?.critical ?? 0;
  const serious = result.summary?.serious ?? 0;
  const status =
    critical + serious === 0
      ? "passing"
      : critical > 0
        ? "critical issues"
        : "issues";
  let host = result.url;
  try {
    host = new URL(result.url).hostname;
  } catch {
    // keep raw url if parse fails
  }
  return {
    title: `${host} — accessibility scan: ${status} (${total} issues)`,
    description: `WCAG 2.2 AA accessibility scan of ${host}. ${total} violations found (${critical} critical, ${serious} serious). Scanned ${new Date(
      result.scanned_at,
    ).toISOString().slice(0, 10)} via axle.`,
    openGraph: {
      title: `${host} — accessibility scan: ${status}`,
      description: `${total} WCAG 2.2 AA violations · ${critical} critical · ${serious} serious`,
      type: "website",
      locale: "en_US",
    },
    alternates: { canonical: `/r/${id}` },
  };
}

const SEVERITY_BADGE: Record<string, string> = {
  critical: "bg-rose-600 text-white",
  serious: "bg-amber-500 text-black",
  moderate: "bg-yellow-300 text-black",
  minor: "bg-slate-300 text-slate-900",
};

export default async function PublicResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getResult(id);
  if (!result) notFound();

  const total = result.summary?.violations ?? 0;
  const critical = result.summary?.critical ?? 0;
  const serious = result.summary?.serious ?? 0;
  const moderate = result.summary?.moderate ?? 0;
  const minor = result.summary?.minor ?? 0;
  const passes = result.summary?.passes ?? 0;

  let host = result.url;
  try {
    host = new URL(result.url).hostname;
  } catch {
    // keep raw url
  }

  const overallPass = critical + serious === 0;
  const headlineColour = overallPass
    ? "text-emerald-700"
    : critical > 0
      ? "text-rose-700"
      : "text-amber-700";
  const headlineText = overallPass
    ? `Passing — no critical or serious WCAG 2.2 AA violations`
    : critical > 0
      ? `${critical} critical, ${serious} serious WCAG 2.2 AA violations`
      : `${serious} serious WCAG 2.2 AA violations`;

  return (
    <main className="min-h-screen bg-slate-50">
      <article className="mx-auto max-w-3xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          axle · public scan result
        </p>
        <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {host}
        </h1>
        <p className={`mt-3 text-lg font-semibold ${headlineColour}`}>
          {headlineText}
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Scanned {new Date(result.scanned_at).toUTCString()} · {result.engine}
        </p>

        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="Critical" value={critical} colour="text-rose-700" />
          <Stat label="Serious" value={serious} colour="text-amber-700" />
          <Stat label="Moderate" value={moderate} colour="text-slate-700" />
          <Stat label="Minor" value={minor} colour="text-slate-600" />
        </section>

        <p className="mt-3 text-xs text-slate-500">
          {total} total violation{total === 1 ? "" : "s"} · {passes} passing
          rules · automated checks cover ~57% of WCAG criteria, the rest
          require a human auditor.
        </p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-slate-900">
            Violations ({total})
          </h2>
          {total === 0 ? (
            <p className="mt-3 text-slate-700">
              axe-core 4.11 found no automated violations on this page. This
              is the easy 57% — for full WCAG 2.2 AA conformance, a human
              audit is still recommended.{" "}
              <Link href="/web-accessibility-audit" className="underline">
                Audit cost guide →
              </Link>
            </p>
          ) : (
            <ol className="mt-4 space-y-4">
              {result.violations.map((v, i) => (
                <li
                  key={`${v.id}-${i}`}
                  className="rounded-lg border border-slate-200 bg-white p-5"
                >
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        SEVERITY_BADGE[v.impact ?? "minor"] ??
                        SEVERITY_BADGE.minor
                      }`}
                    >
                      {v.impact ?? "minor"}
                    </span>
                    <code className="text-sm text-slate-700">{v.id}</code>
                    {v.wcag && v.wcag.length ? (
                      <span className="text-xs text-slate-500">
                        WCAG {v.wcag.join(", ")}
                      </span>
                    ) : null}
                    <span className="ms-auto text-xs text-slate-500">
                      {(v.nodes?.length ?? 0)} occurrence
                      {(v.nodes?.length ?? 0) === 1 ? "" : "s"}
                    </span>
                  </div>
                  {v.help ? (
                    <p className="mt-2 text-slate-800">{v.help}</p>
                  ) : null}
                  {v.helpUrl ? (
                    <a
                      href={v.helpUrl}
                      target="_blank"
                      rel="noopener"
                      className="mt-2 inline-block text-sm text-emerald-700 underline"
                    >
                      How to fix →
                    </a>
                  ) : null}
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="mt-12 rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Run your own scan
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            This scan was generated by axle — a continuous WCAG 2.2 AA
            compliance pipeline. Free, no signup, runs axe-core 4.11 against
            any public URL.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/free-scan"
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Free scan →
            </Link>
            <a
              href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
              target="_blank"
              rel="noopener"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Continuous CI on every PR →
            </a>
            <Link
              href="/why-not-overlay"
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Why not overlays
            </Link>
          </div>
        </section>

        <footer className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          Public scan result. axle stores this report for 30 days. Anyone with
          this URL can view it. No PII collected. axle is not a compliance
          certificate; automated checks catch ~57% of WCAG criteria, the rest
          require a qualified human auditor.
        </footer>
      </article>
    </main>
  );
}

function Stat({
  label,
  value,
  colour,
}: {
  label: string;
  value: number;
  colour: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className={`mt-1 text-3xl font-bold tabular-nums ${colour}`}>
        {value}
      </p>
    </div>
  );
}
