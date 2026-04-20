import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";

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
] as const;

export async function GET() {
  const redis = kv();
  const empty = {
    scans_today: 0,
    scans_all_time: 0,
    fixes_all_time: 0,
    by_source: Object.fromEntries(SOURCES.map((s) => [s, 0])) as Record<
      (typeof SOURCES)[number],
      number
    >,
    page_views: { all_time: 0, today: 0 },
    updated_at: new Date().toISOString(),
  };
  const headers = {
    "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    "Access-Control-Allow-Origin": "*",
  };
  if (!redis) return NextResponse.json(empty, { headers });

  const day = new Date().toISOString().slice(0, 10);
  const [scansToday, scansAll, fixesAll, viewsAll, viewsToday, ...bySrcArr] =
    await Promise.all([
      redis.get<number>(`axle:stats:scans:${day}`).catch(() => 0),
      redis.get<number>("axle:stats:scans:all").catch(() => 0),
      redis.get<number>("axle:stats:fixes:all").catch(() => 0),
      redis.get<number>("axle:stats:views:all").catch(() => 0),
      redis.get<number>(`axle:stats:views:${day}`).catch(() => 0),
      ...SOURCES.map((s) =>
        redis.get<number>(`axle:stats:scans:src:${s}`).catch(() => 0)
      ),
    ]);

  const by_source = Object.fromEntries(
    SOURCES.map((s, i) => [s, Number(bySrcArr[i] ?? 0)])
  ) as Record<(typeof SOURCES)[number], number>;

  return NextResponse.json(
    {
      scans_today: Number(scansToday ?? 0),
      scans_all_time: Number(scansAll ?? 0),
      fixes_all_time: Number(fixesAll ?? 0),
      by_source,
      page_views: {
        all_time: Number(viewsAll ?? 0),
        today: Number(viewsToday ?? 0),
      },
      updated_at: new Date().toISOString(),
    },
    { headers }
  );
}
