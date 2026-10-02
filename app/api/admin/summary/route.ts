import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";
import { polar } from "@/lib/billing/polar";
import { loadInternalConfig, isInternalEmail } from "@/lib/internal";

export const runtime = "nodejs";

const SOURCES = [
  "web",
  "axle-cli",
  "axle-action",
  "axle-netlify",
  "axle-cloudflare",
  "axle-vercel",
  "axle-raycast",
  "axle-chrome",
  "axle-wordpress",
  "axle-shopify",
  "unknown",
];

function checkAuth(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") || "";
  const provided = header.replace(/^Bearer\s+/i, "");
  return provided.length > 0 && provided === token;
}

export async function GET(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Set ADMIN_TOKEN in Vercel env and send 'Authorization: Bearer <token>'.",
      },
      { status: 401 }
    );
  }

  const redis = kv();
  const day = new Date().toISOString().slice(0, 10);

  const kvData = redis
    ? await (async () => {
        const keys = [
          redis.get<number>("axle:stats:scans:all"),
          redis.get<number>(`axle:stats:scans:${day}`),
          redis.get<number>("axle:stats:fixes:all"),
          redis.get<number>("axle:stats:views:all"),
          redis.get<number>(`axle:stats:views:${day}`),
          redis.get<number>("axle:stats:leads:all"),
          redis.get<number>(`axle:stats:leads:${day}`),
          ...SOURCES.map((s) =>
            redis.get<number>(`axle:stats:scans:src:${s}`)
          ),
          ...SOURCES.map((s) =>
            redis.get<number>(`axle:stats:views:src:${s}`)
          ),
        ];
        const results = await Promise.all(keys.map((p) => p.catch(() => 0)));
        const [
          scansAll,
          scansToday,
          fixesAll,
          viewsAll,
          viewsToday,
          leadsAll,
          leadsToday,
        ] = results;
        const srcStart = 7;
        const views_by_source: Record<string, number> = {};
        const scans_by_source: Record<string, number> = {};
        SOURCES.forEach((s, i) => {
          scans_by_source[s] = Number(results[srcStart + i] ?? 0);
          views_by_source[s] = Number(
            results[srcStart + SOURCES.length + i] ?? 0
          );
        });

        // Recent lead emails (keep it to 20 — enough to eyeball, not so much
        // that the admin response bloats).
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
        const internalCfg = loadInternalConfig();
        let leads_recent: LeadRecord[] = [];
        try {
          const emails = await redis.lrange<string>("axle:leads:list", 0, 49);
          const records = await Promise.all(
            emails.map((e) =>
              redis.get<string | LeadRecord>(`axle:lead:${e}`).catch(() => null)
            )
          );
          leads_recent = records
            .map((r) => {
              if (!r) return null;
              const parsed =
                typeof r === "object"
                  ? (r as LeadRecord)
                  : (() => {
                      try {
                        return JSON.parse(r as string) as LeadRecord;
                      } catch {
                        return null;
                      }
                    })();
              if (!parsed) return null;
              parsed.is_internal = isInternalEmail(parsed.email, internalCfg);
              return parsed;
            })
            .filter((r): r is LeadRecord => r !== null);
        } catch {
          /* no-op */
        }

        // Honest counters: separate the "axle's own founder testing the
        // signup flow" from the "real human gave us their email" signal.
        const leads_external = leads_recent.filter((l) => !l.is_internal);
        const leads_internal = leads_recent.filter((l) => l.is_internal);

        // Where traffic actually comes from (external referrer hosts) — the
        // channel-attribution signal to watch once outreach starts.
        let top_referrers: Array<{ referrer: string; count: number }> = [];
        try {
          const refs = (await redis.hgetall("axle:stats:referrers")) as Record<
            string,
            number | string
          > | null;
          if (refs) {
            top_referrers = Object.entries(refs)
              .map(([referrer, count]) => ({ referrer, count: Number(count) || 0 }))
              .filter((r) => r.count > 0)
              .sort((a, b) => b.count - a.count)
              .slice(0, 20);
          }
        } catch {
          /* no-op */
        }

        // Human vs automated page views with daily history (see /api/track).
        // Classification is a user-agent heuristic and only exists from
        // `since` onward — earlier traffic was never split, so `since` is
        // returned for the dashboard to say so instead of implying a total.
        let traffic: {
          since: string | null;
          daily: Array<{ day: string; human: number; automated: number }>;
          human_7d: number;
          automated_7d: number;
          by_host_7d: Array<{ host: string; count: number }>;
          top_landing_pages_7d: Array<{ path: string; count: number }>;
        } | null = null;
        try {
          const days = Array.from({ length: 14 }, (_, i) =>
            new Date(Date.now() - i * 86_400_000).toISOString().slice(0, 10)
          ); // newest first
          const last7 = days.slice(0, 7);
          const [humanCounts, autoCounts, since, hostMaps, pathMaps] =
            await Promise.all([
              Promise.all(
                days.map((d) =>
                  redis.get<number>(`axle:stats:split:human:${d}`).catch(() => 0)
                )
              ),
              Promise.all(
                days.map((d) =>
                  redis.get<number>(`axle:stats:split:auto:${d}`).catch(() => 0)
                )
              ),
              redis.get<string>("axle:stats:split:since").catch(() => null),
              Promise.all(
                last7.map((d) =>
                  redis.hgetall(`axle:stats:split:host:${d}`).catch(() => null)
                )
              ),
              Promise.all(
                last7.map((d) =>
                  redis.hgetall(`axle:stats:split:paths:${d}`).catch(() => null)
                )
              ),
            ]);

          const merge = (maps: Array<Record<string, unknown> | null>) => {
            const out: Record<string, number> = {};
            for (const m of maps) {
              if (!m) continue;
              for (const [k, v] of Object.entries(m)) {
                out[k] = (out[k] || 0) + (Number(v) || 0);
              }
            }
            return Object.entries(out).sort((a, b) => b[1] - a[1]);
          };

          const daily = days.map((day, i) => ({
            day,
            human: Number(humanCounts[i] ?? 0),
            automated: Number(autoCounts[i] ?? 0),
          }));
          traffic = {
            since: typeof since === "string" ? since : null,
            daily,
            human_7d: daily.slice(0, 7).reduce((n, d) => n + d.human, 0),
            automated_7d: daily.slice(0, 7).reduce((n, d) => n + d.automated, 0),
            by_host_7d: merge(hostMaps).map(([host, count]) => ({ host, count })),
            top_landing_pages_7d: merge(pathMaps)
              .slice(0, 15)
              .map(([path, count]) => ({ path, count })),
          };
        } catch {
          /* no-op */
        }

        return {
          scans_all_time: Number(scansAll ?? 0),
          scans_today: Number(scansToday ?? 0),
          fixes_all_time: Number(fixesAll ?? 0),
          views_all_time: Number(viewsAll ?? 0),
          views_today: Number(viewsToday ?? 0),
          leads_all_time: Number(leadsAll ?? 0),
          leads_today: Number(leadsToday ?? 0),
          leads_external_count: leads_external.length,
          leads_internal_count: leads_internal.length,
          scans_by_source,
          views_by_source,
          top_referrers,
          traffic,
          leads_recent,
        };
      })()
    : { note: "KV not configured" };

  let polarData:
    | {
        order_count: number;
        order_count_external: number;
        order_count_internal: number;
        revenue_total_minor: number;
        revenue_external_minor: number;
        revenue_currency: string;
        recent: Array<{
          id: string;
          amount_minor: number;
          currency: string;
          created_at: string;
          status: string;
          product_id: string;
          customer_email: string;
          is_internal: boolean;
        }>;
      }
    | { error: string };
  try {
    const p = polar();
    type PolarOrder = {
      id: string;
      status: string;
      totalAmount: number;
      netAmount: number;
      currency: string;
      createdAt: string | Date;
      productId: string | null;
      product?: { id: string } | null;
      customer?: { email?: string } | null;
      customerEmail?: string | null;
    };
    const iter = await p.orders.list({ limit: 100 });
    const orders: PolarOrder[] = [];
    for await (const page of iter) {
      const items = (
        page as unknown as { result?: { items?: PolarOrder[] } }
      )?.result?.items;
      if (Array.isArray(items)) orders.push(...items);
      if (orders.length >= 100) break;
    }

    const internalCfg = loadInternalConfig();
    const orderEmail = (o: PolarOrder) =>
      (o.customer?.email || o.customerEmail || "").toLowerCase();
    const ordersInternal = orders.filter((o) =>
      isInternalEmail(orderEmail(o), internalCfg),
    );
    const ordersExternal = orders.filter(
      (o) => !isInternalEmail(orderEmail(o), internalCfg),
    );
    // Net non-refunded counts the customer paid for. Refunds reduce
    // both the gross and the external/internal slices proportionally.
    const isPaid = (o: PolarOrder) =>
      o.status === "paid" || o.status === "completed";
    const revenue = orders
      .filter(isPaid)
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const revenueExternal = ordersExternal
      .filter(isPaid)
      .reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
    const currency = orders[0]?.currency || "USD";
    polarData = {
      order_count: orders.length,
      order_count_external: ordersExternal.length,
      order_count_internal: ordersInternal.length,
      revenue_total_minor: revenue,
      revenue_external_minor: revenueExternal,
      revenue_currency: currency,
      recent: orders.slice(0, 10).map((o) => {
        const email = orderEmail(o);
        return {
          id: o.id,
          amount_minor: Number(o.totalAmount) || 0,
          currency: o.currency,
          created_at:
            o.createdAt instanceof Date
              ? o.createdAt.toISOString()
              : String(o.createdAt),
          status: o.status,
          product_id: o.productId || o.product?.id || "",
          customer_email: email,
          is_internal: isInternalEmail(email, internalCfg),
        };
      }),
    };
  } catch (err) {
    polarData = {
      error:
        err instanceof Error
          ? err.message
          : "Failed to fetch Polar orders",
    };
  }

  const NPM_PACKAGES = [
    "axle-cli",
    "axle-netlify-plugin",
    "axle-cloudflare-plugin",
    "axle-vercel-plugin",
    "axle-mcp",
    "axle-storybook",
  ];
  const npmData = await Promise.all(
    NPM_PACKAGES.map(async (pkg) => {
      try {
        const [weekRes, monthRes] = await Promise.all([
          fetch(
            `https://api.npmjs.org/downloads/point/last-week/${pkg}`,
            { cache: "no-store" }
          ),
          fetch(
            `https://api.npmjs.org/downloads/point/last-month/${pkg}`,
            { cache: "no-store" }
          ),
        ]);
        const weekJson = (await weekRes.json()) as { downloads?: number };
        const monthJson = (await monthRes.json()) as { downloads?: number };
        return {
          package: pkg,
          last_week: Number(weekJson.downloads ?? 0),
          last_month: Number(monthJson.downloads ?? 0),
        };
      } catch {
        return { package: pkg, last_week: 0, last_month: 0 };
      }
    })
  );
  const npmTotals = npmData.reduce(
    (acc, row) => ({
      last_week: acc.last_week + row.last_week,
      last_month: acc.last_month + row.last_month,
    }),
    { last_week: 0, last_month: 0 }
  );

  // VS Code Marketplace — the one distribution channel npm can't see. Public
  // gallery API; resilient (any failure yields zeros, never breaks the page).
  const VSCODE_EXTENSIONS = ["asafamos.axle-a11y"];
  const marketplaceData = await Promise.all(
    VSCODE_EXTENSIONS.map(async (ext) => {
      try {
        const res = await fetch(
          "https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery",
          {
            method: "POST",
            cache: "no-store",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json;api-version=3.0-preview.1",
            },
            body: JSON.stringify({
              filters: [{ criteria: [{ filterType: 7, value: ext }] }],
              flags: 914,
            }),
          }
        );
        const json = (await res.json()) as {
          results?: Array<{
            extensions?: Array<{
              statistics?: Array<{ statisticName: string; value: number }>;
            }>;
          }>;
        };
        const stats = json?.results?.[0]?.extensions?.[0]?.statistics ?? [];
        const stat = (name: string) =>
          Number(stats.find((s) => s.statisticName === name)?.value ?? 0);
        return {
          extension: ext,
          installs: stat("install"),
          downloads: stat("downloadCount"),
          rating: stat("averagerating"),
          rating_count: stat("ratingcount"),
        };
      } catch {
        return {
          extension: ext,
          installs: 0,
          downloads: 0,
          rating: 0,
          rating_count: 0,
        };
      }
    })
  );
  const marketplaceTotals = marketplaceData.reduce(
    (acc, row) => ({
      installs: acc.installs + row.installs,
      downloads: acc.downloads + row.downloads,
    }),
    { installs: 0, downloads: 0 }
  );

  return NextResponse.json({
    stats: kvData,
    polar: polarData,
    npm: { packages: npmData, totals: npmTotals },
    marketplace: { extensions: marketplaceData, totals: marketplaceTotals },
    generated_at: new Date().toISOString(),
  });
}
