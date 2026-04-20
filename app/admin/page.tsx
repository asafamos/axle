"use client";

import { useEffect, useState } from "react";

type Summary = {
  stats?:
    | {
        scans_all_time: number;
        scans_today: number;
        fixes_all_time: number;
        views_all_time: number;
        views_today: number;
        scans_by_source: Record<string, number>;
        views_by_source: Record<string, number>;
      }
    | { note: string };
  polar?:
    | {
        order_count: number;
        revenue_total_minor: number;
        revenue_currency: string;
        recent: Array<{
          id: string;
          amount_minor: number;
          currency: string;
          created_at: string;
          status: string;
          product_id: string;
        }>;
      }
    | { error: string };
  generated_at: string;
};

const TOKEN_KEY = "axle:admin-token";

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(TOKEN_KEY);
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
                  <Stat label="Orders" value={polar.order_count.toString()} />
                  <Stat
                    label={`Revenue (${polar.revenue_currency})`}
                    value={(polar.revenue_total_minor / 100).toFixed(2)}
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
                        <tr key={o.id} className="border-t border-slate-100">
                          <td className="py-2">
                            {new Date(o.created_at).toLocaleDateString()}
                          </td>
                          <td className="font-mono text-xs">
                            {o.id.slice(0, 16)}…
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
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Stat label="Scans (all time)" value={fmt(stats.scans_all_time)} />
                  <Stat label="Scans (today)" value={fmt(stats.scans_today)} />
                  <Stat label="AI fixes" value={fmt(stats.fixes_all_time)} />
                  <Stat label="Views (all time)" value={fmt(stats.views_all_time)} />
                </div>
                <h3 className="mt-6 text-sm font-semibold text-slate-700">
                  Scans by source
                </h3>
                <SourceTable data={stats.scans_by_source} />
                <h3 className="mt-6 text-sm font-semibold text-slate-700">
                  Page views by source
                </h3>
                <SourceTable data={stats.views_by_source} />
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
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
