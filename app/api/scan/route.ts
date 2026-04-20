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

const FREE_WEB_SCAN_LIMIT_PER_DAY = 3;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]?.trim() || "unknown";
  const realIp = req.headers.get("x-real-ip");
  return realIp?.trim() || "unknown";
}

/**
 * Web-form rate limit for the free tier. Only applies when source === "web":
 * CLI / Action / plugin traffic already pays the scan cost on their own
 * infra (they run axe-core locally) and don't hit this endpoint in the
 * common case. Authenticated requests (Authorization: Bearer <axle key>)
 * bypass the limit — the key itself represents a paid subscription.
 */
async function checkWebRateLimit(
  req: Request,
  source: string
): Promise<{ allowed: true } | { allowed: false; used: number; limit: number }> {
  if (source !== "web") return { allowed: true };
  if (req.headers.get("authorization")?.startsWith("Bearer "))
    return { allowed: true };
  const redis = kv();
  if (!redis) return { allowed: true };
  const ip = clientIp(req);
  const day = new Date().toISOString().slice(0, 10);
  const key = `axle:rl:scan:${ip}:${day}`;
  const used = await redis.incr(key).catch(() => 0);
  await redis.expire(key, 60 * 60 * 36).catch(() => {});
  if (used > FREE_WEB_SCAN_LIMIT_PER_DAY) {
    return { allowed: false, used, limit: FREE_WEB_SCAN_LIMIT_PER_DAY };
  }
  return { allowed: true };
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

    const limit = await checkWebRateLimit(req, source);
    if (!limit.allowed) {
      return NextResponse.json(
        {
          error: `Free tier: ${limit.limit} scans per day. Upgrade to Team for unlimited scans, trend history, and hosted AI fixes.`,
          code: "rate_limited",
          used: limit.used,
          limit: limit.limit,
          upgrade_url: "/#pricing",
        },
        { status: 402 }
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
