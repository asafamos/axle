import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";

/**
 * Public stats endpoint — aggregates from Upstash keys we already write.
 * - scans_today: increments on every successful /api/scan call
 * - scans_all_time: cumulative
 * - fixes_all_time: cumulative AI fix calls (paid + free)
 *
 * Returns rounded, human-friendly numbers for social-proof display.
 */
export async function GET() {
  const redis = kv();
  if (!redis) {
    return NextResponse.json(
      {
        scans_today: 0,
        scans_all_time: 0,
        fixes_all_time: 0,
        updated_at: new Date().toISOString(),
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }

  const day = new Date().toISOString().slice(0, 10);
  const [scansToday, scansAll, fixesAll] = await Promise.all([
    redis.get<number>(`axle:stats:scans:${day}`).catch(() => 0),
    redis.get<number>("axle:stats:scans:all").catch(() => 0),
    redis.get<number>("axle:stats:fixes:all").catch(() => 0),
  ]);

  return NextResponse.json(
    {
      scans_today: Number(scansToday ?? 0),
      scans_all_time: Number(scansAll ?? 0),
      fixes_all_time: Number(fixesAll ?? 0),
      updated_at: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
