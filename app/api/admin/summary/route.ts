import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";
import { polar } from "@/lib/billing/polar";

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
          ...SOURCES.map((s) =>
            redis.get<number>(`axle:stats:scans:src:${s}`)
          ),
          ...SOURCES.map((s) =>
            redis.get<number>(`axle:stats:views:src:${s}`)
          ),
        ];
        const results = await Promise.all(keys.map((p) => p.catch(() => 0)));
        const [scansAll, scansToday, fixesAll, viewsAll, viewsToday] = results;
        const srcStart = 5;
        const views_by_source: Record<string, number> = {};
        const scans_by_source: Record<string, number> = {};
        SOURCES.forEach((s, i) => {
          scans_by_source[s] = Number(results[srcStart + i] ?? 0);
          views_by_source[s] = Number(
            results[srcStart + SOURCES.length + i] ?? 0
          );
        });
        return {
          scans_all_time: Number(scansAll ?? 0),
          scans_today: Number(scansToday ?? 0),
          fixes_all_time: Number(fixesAll ?? 0),
          views_all_time: Number(viewsAll ?? 0),
          views_today: Number(viewsToday ?? 0),
          scans_by_source,
          views_by_source,
        };
      })()
    : { note: "KV not configured" };

  let polarData:
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
    const revenue = orders.reduce(
      (sum, o) => sum + (Number(o.totalAmount) || 0),
      0
    );
    const currency = orders[0]?.currency || "USD";
    polarData = {
      order_count: orders.length,
      revenue_total_minor: revenue,
      revenue_currency: currency,
      recent: orders.slice(0, 10).map((o) => ({
        id: o.id,
        amount_minor: Number(o.totalAmount) || 0,
        currency: o.currency,
        created_at:
          o.createdAt instanceof Date
            ? o.createdAt.toISOString()
            : String(o.createdAt),
        status: o.status,
        product_id: o.productId || o.product?.id || "",
      })),
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
