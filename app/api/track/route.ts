import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";

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

function normalizeSource(raw: unknown): string | null {
  const s = typeof raw === "string" ? raw.trim().toLowerCase() : "";
  if (!s) return null;
  return SOURCE_ALLOWLIST.has(s) ? s : "unknown";
}

/**
 * User-agent heuristics for "not a person in a browser": crawlers, link
 * previewers, uptime monitors, HTTP libraries/CLIs and headless browsers (our
 * own scanner and CI run Chromium headless). An empty UA counts as automated.
 * This is a heuristic, not a guarantee — a bot that spoofs a normal browser UA
 * will still count as human. It exists so the dashboard can answer "were there
 * real visits?" with a number that is much closer to the truth than the raw
 * counter.
 */
const AUTOMATED_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|facebookexternalhit|whatsapp|telegram|discord|preview|embed|curl|wget|python|node-fetch|undici|axios|go-http|okhttp|java\/|libwww|httpclient|vercel|phantomjs|playwright|puppeteer|selenium|semrush|ahrefs|mj12|dotbot|bytespider|petalbot|yandex|baidu|ccbot|gptbot|claudebot|perplexity|amazonbot|applebot/i;

function isAutomated(ua: string | null): boolean {
  return !ua || AUTOMATED_UA.test(ua);
}

// Only the two hosts we actually serve are tracked by name (bounded keyspace).
function normalizeHost(raw: string | null): string {
  const h = (raw || "").split(":")[0].trim().toLowerCase();
  if (h === "axlescan.com" || h === "www.axlescan.com") return "axlescan.com";
  if (h === "axle-iota.vercel.app") return "axle-iota.vercel.app";
  return "other";
}

// Path only (no query/fragment), conservative charset + length so the per-day
// hash stays bounded and nothing user-controlled ends up unvalidated in Redis.
function normalizePath(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const p = raw.split(/[?#]/)[0].trim();
  if (!p.startsWith("/") || p.length > 100) return null;
  return /^\/[A-Za-z0-9/_\-.%]*$/.test(p) ? p : null;
}

const DAY_SECONDS = 60 * 60 * 24;
const HISTORY_TTL = DAY_SECONDS * 100;

export async function POST(req: Request) {
  const redis = kv();
  if (!redis) return NextResponse.json({ ok: true, kv: false });

  let payload: { source?: string; event?: string; ref?: string; path?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const source = normalizeSource(payload.source);
  const event = typeof payload.event === "string" ? payload.event : "page_view";
  const day = new Date().toISOString().slice(0, 10);
  const automated = isAutomated(req.headers.get("user-agent"));
  const host = normalizeHost(
    req.headers.get("x-forwarded-host") || req.headers.get("host"),
  );
  const path = normalizePath(payload.path);

  // External referrer host (validated to a hostname shape to keep the hash
  // bounded and injection-safe). This is the "which channel actually drives
  // traffic" signal — the one thing to watch once outreach starts. Automated
  // traffic is excluded so crawlers can't inflate it.
  const refRaw = typeof payload.ref === "string" ? payload.ref.trim().toLowerCase() : "";
  const ref =
    !automated && refRaw && refRaw.length <= 100 && /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/.test(refRaw)
      ? refRaw
      : null;

  // Legacy counters are left exactly as they were so existing dashboards and
  // history keep meaning the same thing.
  const ops: Promise<unknown>[] = [
    redis.incr("axle:stats:views:all"),
    redis.incr(`axle:stats:views:${day}`),
  ];
  if (source) {
    ops.push(redis.incr(`axle:stats:views:src:${source}`));
    ops.push(redis.incr(`axle:stats:views:src:${source}:${day}`));
  }
  if (ref) {
    ops.push(redis.hincrby("axle:stats:referrers", ref, 1));
    ops.push(redis.hincrby(`axle:stats:referrers:${day}`, ref, 1));
    ops.push(redis.expire(`axle:stats:referrers:${day}`, DAY_SECONDS * 14));
  }
  if (event === "scan_complete" && source) {
    ops.push(redis.incr(`axle:stats:scans:src:${source}`));
  }

  // Human-vs-automated split with 100-day daily history (the legacy per-day
  // counter above expires after 48h, so it can't answer "what happened last
  // week?"). `since` records when the split started, so the dashboard can say
  // honestly that older traffic was never classified.
  if (event === "page_view") {
    const kind = automated ? "auto" : "human";
    ops.push(redis.incr(`axle:stats:split:${kind}:${day}`));
    ops.push(redis.expire(`axle:stats:split:${kind}:${day}`, HISTORY_TTL));
    ops.push(redis.set("axle:stats:split:since", day, { nx: true }));
    if (!automated) {
      ops.push(redis.hincrby(`axle:stats:split:host:${day}`, host, 1));
      ops.push(redis.expire(`axle:stats:split:host:${day}`, HISTORY_TTL));
      if (path) {
        ops.push(redis.hincrby(`axle:stats:split:paths:${day}`, path, 1));
        ops.push(redis.expire(`axle:stats:split:paths:${day}`, HISTORY_TTL));
      }
    }
  }

  try {
    await Promise.all(ops);
    await redis.expire(`axle:stats:views:${day}`, 60 * 60 * 48);
  } catch {
    /* no-op */
  }
  return NextResponse.json({ ok: true });
}
