import { NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";
export const maxDuration = 60;

const SOURCE_ALLOWLIST = new Set([
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
]);

function normalizeSource(raw: unknown): string {
  const s = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  return SOURCE_ALLOWLIST.has(s) ? s : "unknown";
}

async function bumpScanStats(source: string): Promise<void> {
  const redis = kv();
  if (!redis) return;
  const day = new Date().toISOString().slice(0, 10);
  // Fire-and-forget — never let stats errors block a scan.
  try {
    await Promise.all([
      redis.incr(`axle:stats:scans:${day}`),
      redis.incr("axle:stats:scans:all"),
      redis.incr(`axle:stats:scans:src:${source}`),
      redis.incr(`axle:stats:scans:src:${source}:${day}`),
    ]);
    // Expire the per-day keys in ~2 days so we don't accumulate forever.
    await redis.expire(`axle:stats:scans:${day}`, 60 * 60 * 48);
    await redis.expire(`axle:stats:scans:src:${source}:${day}`, 60 * 60 * 48);
  } catch {
    /* no-op */
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = String(body?.url || "").trim();
    const source = normalizeSource(body?.source);

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    try {
      new URL(normalized);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const result = await scanUrl(normalized);
    await bumpScanStats(source);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
