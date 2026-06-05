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

  return NextResponse.json({
    stats: kvData,
    polar: polarData,
    npm: { packages: npmData, totals: npmTotals },
    generated_at: new Date().toISOString(),
  });
}
