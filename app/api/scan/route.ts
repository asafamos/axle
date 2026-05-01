import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { scanUrl } from "@/lib/scanner";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";
export const maxDuration = 60;

// Public-result URL: every scan is persisted under axle:result:<id> with a
// 30-day TTL and the response includes a permalink the user can share. The
// ID is 12 random bytes (96 bits) base64url-encoded — unguessable, no PII.
// Sharing is opt-in: we just include the permalink in the response, the UI
// only shows it after the user clicks "share". Internal-hostname scans
// (localhost, private ranges) are not persisted to avoid accidentally
// exposing staging URLs through link-sharing.
const RESULT_TTL_SECONDS = 60 * 60 * 24 * 30;

function newResultId(): string {
  return randomBytes(12).toString("base64url");
}

function isInternalHostname(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".test") ||
    hostname.endsWith(".invalid") ||
    hostname.endsWith(".internal") ||
    /^127\./.test(hostname) ||
    /^10\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

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

    // Persist the scan for 30 days under an unguessable ID so the user can
    // share the result via /r/<id>. Skip for internal hostnames so we don't
    // create shareable URLs of someone's localhost / staging by accident.
    let resultId: string | null = null;
    let permalink: string | null = null;
    try {
      const hostname = new URL(normalized).hostname.toLowerCase();
      if (!isInternalHostname(hostname)) {
        const redis = kv();
        if (redis) {
          const id = newResultId();
          // Persisted record uses snake_case keys for the public /r/<id>
          // page schema; the in-flight ScanResult uses camelCase. We
          // explicitly map between them here so the two schemas can evolve
          // independently.
          const totalViolations = (result.violations || []).length;
          const record = {
            id,
            url: result.url || normalized,
            scanned_at: result.scannedAt || new Date().toISOString(),
            engine: "axe-core 4.11",
            summary: {
              violations: totalViolations,
              critical: result.summary?.critical ?? 0,
              serious: result.summary?.serious ?? 0,
              moderate: result.summary?.moderate ?? 0,
              minor: result.summary?.minor ?? 0,
              passes: result.passes ?? 0,
            },
            violations: result.violations || [],
            source,
          };
          await redis.set(`axle:result:${id}`, JSON.stringify(record), {
            ex: RESULT_TTL_SECONDS,
          });
          resultId = id;
          permalink = `/r/${id}`;
        }
      }
    } catch {
      // Persisting is best-effort. A failure here must not break the scan
      // response — the user still gets their results, just without a
      // shareable URL.
    }

    return NextResponse.json({ ...result, result_id: resultId, permalink });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
