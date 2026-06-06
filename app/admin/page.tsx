"use client";

import { useEffect, useState } from "react";

type LeadRecord = {
  email: string;
  url: string;
  violations: number;
  critical: number;
  serious: number;
  source: string;
  created_at: number;
  created_at_iso?: string;
  is_internal?: boolean;
};

type Summary = {
  stats?:
    | {
        scans_all_time: number;
        scans_today: number;
        fixes_all_time: number;
        views_all_time: number;
        views_today: number;
        leads_all_time: number;
        leads_external_count?: number;
        leads_internal_count?: number;
        leads_today: number;
        scans_by_source: Record<string, number>;
        views_by_source: Record<string, number>;
        leads_recent: LeadRecord[];
      }
    | { note: string };
  polar?:
    | {
        order_count: number;
        order_count_external?: number;
        order_count_internal?: number;
        revenue_total_minor: number;
        revenue_external_minor?: number;
        revenue_currency: string;
        recent: Array<{
          id: string;
          amount_minor: number;
          currency: string;
          created_at: string;
          status: string;
          product_id: string;
          customer_email?: string;
          is_internal?: boolean;
        }>;
      }
    | { error: string };
  npm?: {
    packages: Array<{
      package: string;
      last_week: number;
      last_month: number;
    }>;
    totals: { last_week: number; last_month: number };
  };
  marketplace?: {
    extensions: Array<{
      extension: string;
      installs: number;
      downloads: number;
      rating: number;
      rating_count: number;
    }>;
    totals: { installs: number; downloads: number };
  };
  generated_at: string;
};

const TOKEN_KEY = "axle:admin-token";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read the saved admin token AFTER mount (not via a lazy useState
    // initializer) so the server and initial client render match — reading
    // localStorage during render would cause a hydration mismatch on the
    // controlled password input below.
    const saved = window.localStorage.getItem(TOKEN_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setToken(saved);
  }, []);

  async function load() {
    setError(null);
    setLoading(true);
    try {
      window.localStorage.setItem(TOKEN_KEY, token);
      const res = await fetch("/api/admin/summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = (await res.json()) as Summary & { error?: string };
      if (!res.ok) {
        throw new Error(json.error || "Request failed");
      }
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  const stats = data?.stats && "scans_all_time" in data.stats ? data.stats : null;
  const polar = data?.polar && "order_count" in data.polar ? data.polar : null;
  const polarError = data?.polar && "error" in data.polar ? data.polar.error : null;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold">axle — admin</h1>
      <p className="mt-1 text-sm text-slate-600">
        Private dashboard. Token lives in localStorage. Set{" "}
        <code className="rounded bg-slate-100 px-1">ADMIN_TOKEN</code> in Vercel env.
      </p>

      <div className="mt-6 flex gap-2">
        <input
          type="password"
          placeholder="Admin token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="button"
          disabled={!token || loading}
          onClick={load}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {data && (
        <div className="mt-8 space-y-8">
          {data.npm && (
            <section>
              <h2 className="text-lg font-semibold">npm downloads</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
                <Stat
                  label="Total · last 7 days"
                  value={fmt(data.npm.totals.last_week)}
                />
                <Stat
                  label="Total · last 30 days"
                  value={fmt(data.npm.totals.last_month)}
                />
              </div>
              <table className="mt-4 w-full text-sm">
                <thead className="text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Package</th>
                    <th className="text-right">Last week</th>
                    <th className="text-right">Last month</th>
                  </tr>
                </thead>
                <tbody>
                  {data.npm.packages.map((p) => (
                    <tr key={p.package} className="border-t border-slate-100">
                      <td className="py-2 font-mono text-xs">{p.package}</td>
                      <td className="text-right">{fmt(p.last_week)}</td>
                      <td className="text-right">{fmt(p.last_month)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          {data.marketplace && data.marketplace.extensions.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">VS Code Marketplace</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-2">
                <Stat
                  label="Total installs"
                  value={fmt(data.marketplace.totals.installs)}
                />
                <Stat
                  label="Total downloads"
                  value={fmt(data.marketplace.totals.downloads)}
                />
              </div>
              <table className="mt-4 w-full text-sm">
                <thead className="text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="py-2">Extension</th>
                    <th className="text-right">Installs</th>
                    <th className="text-right">Downloads</th>
                    <th className="text-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.marketplace.extensions.map((e) => (
                    <tr key={e.extension} className="border-t border-slate-100">
                      <td className="py-2 font-mono text-xs">{e.extension}</td>
                      <td className="text-right">{fmt(e.installs)}</td>
                      <td className="text-right">{fmt(e.downloads)}</td>
                      <td className="text-right">
                        {e.rating_count > 0
                          ? `${e.rating.toFixed(1)}★ (${e.rating_count})`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}
          <section>
            <h2 className="text-lg font-semibold">Revenue (Polar)</h2>
            {polarError && (
              <p className="mt-2 text-sm text-red-700">
                Polar fetch failed: {polarError}
              </p>
            )}
            {polar && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Stat
                    label="Orders · external"
                    value={(polar.order_count_external ?? polar.order_count).toString()}
                    sub={
                      polar.order_count_internal
                        ? `+ ${polar.order_count_internal} internal/test`
                        : undefined
                    }
                  />
                  <Stat
                    label={`Revenue · external (${polar.revenue_currency})`}
                    value={(
                      (polar.revenue_external_minor ?? polar.revenue_total_minor) /
                      100
                    ).toFixed(2)}
                    sub={
                      polar.revenue_external_minor !== undefined &&
                      polar.revenue_external_minor !== polar.revenue_total_minor
                        ? `gross all orders: ${(polar.revenue_total_minor / 100).toFixed(2)}`
                        : undefined
                    }
                  />
                  <Stat
                    label="Avg order"
                    value={
                      polar.order_count
                        ? (
                            polar.revenue_total_minor /
                            polar.order_count /
                            100
                          ).toFixed(2)
                        : "—"
                    }
                  />
                </div>
                {(polar.order_count_external ?? polar.order_count) === 0 ? (
                  <div className="mt-3 rounded-md border border-rose-300 bg-rose-50 p-3 text-sm text-rose-900">
                    <strong>No external paid orders yet.</strong> All Polar
                    activity above is founder self-tests or production health
                    probes. The day the first non-internal email shows up here,
                    something real shipped.
                  </div>
                ) : null}
                {polar.recent.length > 0 && (
                  <table className="mt-4 w-full text-sm">
                    <thead className="text-left text-xs uppercase text-slate-500">
                      <tr>
                        <th className="py-2">Date</th>
                        <th>ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {polar.recent.map((o) => (
                        <tr
                          key={o.id}
                          className={`border-t border-slate-100 ${
                            o.is_internal ? "opacity-50" : ""
                          }`}
                        >
                          <td className="py-2">
                            {new Date(o.created_at).toLocaleDateString()}
                          </td>
                          <td className="font-mono text-xs">
                            {o.id.slice(0, 16)}…
                            {o.is_internal ? (
                              <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                                internal
                              </span>
                            ) : null}
                          </td>
                          <td>
                            {(o.amount_minor / 100).toFixed(2)} {o.currency}
                          </td>
                          <td>{o.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </section>

          <section>
            <h2 className="text-lg font-semibold">Usage</h2>
            {stats ? (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                  <Stat label="Scans (all time)" value={fmt(stats.scans_all_time)} />
                  <Stat label="Scans (today)" value={fmt(stats.scans_today)} />
                  <Stat label="AI fixes" value={fmt(stats.fixes_all_time)} />
                  <Stat label="Views (all time)" value={fmt(stats.views_all_time)} />
                  <Stat
                    label="Leads · external"
                    value={fmt(stats.leads_external_count ?? 0)}
                    sub={
                      (stats.leads_internal_count ?? 0) > 0
                        ? `+ ${fmt(stats.leads_internal_count ?? 0)} internal/test`
                        : undefined
                    }
                  />
                  <Stat label="Leads (today)" value={fmt(stats.leads_today ?? 0)} />
                </div>
                {(stats.leads_external_count ?? 0) === 0 ? (
                  <div className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                    <strong>No external leads yet.</strong> The leads count
                    above is internal/test traffic (founder self-tests,
                    production health probes). Real lead funnel starts when
                    a stranger fills in the email prompt under a scan result
                    — drive traffic to /free-scan via cold email / Bluesky /
                    GH Marketplace and watch this number move.
                  </div>
                ) : null}
                <h3 className="mt-6 text-sm font-semibold text-slate-700">
                  Scans by source
                </h3>
                <SourceTable data={stats.scans_by_source} />
                <h3 className="mt-6 text-sm font-semibold text-slate-700">
                  Page views by source
                </h3>
                <SourceTable data={stats.views_by_source} />

                <h3 className="mt-6 text-sm font-semibold text-slate-700">
                  Recent leads (scan-result subscribers)
                </h3>
                {stats.leads_recent && stats.leads_recent.length > 0 ? (
                  <table className="mt-2 w-full text-sm">
                    <thead className="text-left text-xs uppercase text-slate-500">
                      <tr>
                        <th className="py-2">When</th>
                        <th>Email</th>
                        <th>URL</th>
                        <th className="text-right">Critical</th>
                        <th className="text-right">Serious</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.leads_recent.map((l) => (
                        <tr
                          key={l.email + l.created_at}
                          className={`border-t border-slate-100 ${
                            l.is_internal ? "opacity-50" : ""
                          }`}
                        >
                          <td className="py-1 text-xs text-slate-600">
                            {new Date(l.created_at).toLocaleString()}
                          </td>
                          <td className="font-mono text-xs">
                            {l.email}
                            {l.is_internal ? (
                              <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
                                internal
                              </span>
                            ) : null}
                          </td>
                          <td className="truncate text-xs text-slate-600" title={l.url}>
                            {l.url.length > 40 ? l.url.slice(0, 40) + "…" : l.url}
                          </td>
                          <td className="text-right text-xs">{l.critical}</td>
                          <td className="text-right text-xs">{l.serious}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="mt-2 text-sm text-slate-500">
                    No leads captured yet. The prompt appears under a scan
                    result when the scan finds at least one violation.
                  </p>
                )}
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                KV not configured — no usage stats available.
              </p>
            )}
          </section>
          <p className="text-xs text-slate-500">
            Generated {new Date(data.generated_at).toLocaleString()}
          </p>
        </div>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
      {sub ? <div className="mt-1 text-[11px] text-slate-500">{sub}</div> : null}
    </div>
  );
}

function SourceTable({ data }: { data: Record<string, number> }) {
  const rows = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = rows.reduce((s, [, n]) => s + n, 0);
  return (
    <table className="mt-2 w-full text-sm">
      <tbody>
        {rows.map(([src, n]) => (
          <tr key={src} className="border-t border-slate-100">
            <td className="py-1 font-mono text-xs">{src}</td>
            <td className="w-20 text-right">{fmt(n)}</td>
            <td className="w-16 text-right text-xs text-slate-500">
              {total ? Math.round((n / total) * 100) : 0}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function fmt(n: number) {
  return n.toLocaleString();
}
