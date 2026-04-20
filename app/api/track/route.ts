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

export async function POST(req: Request) {
  const redis = kv();
  if (!redis) return NextResponse.json({ ok: true, kv: false });

  let payload: { source?: string; event?: string } = {};
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 });
  }

  const source = normalizeSource(payload.source);
  const event = typeof payload.event === "string" ? payload.event : "page_view";
  const day = new Date().toISOString().slice(0, 10);

  const ops: Promise<unknown>[] = [
    redis.incr("axle:stats:views:all"),
    redis.incr(`axle:stats:views:${day}`),
  ];
  if (source) {
    ops.push(redis.incr(`axle:stats:views:src:${source}`));
    ops.push(redis.incr(`axle:stats:views:src:${source}:${day}`));
  }
  if (event === "scan_complete" && source) {
    ops.push(redis.incr(`axle:stats:scans:src:${source}`));
  }

  try {
    await Promise.all(ops);
    await redis.expire(`axle:stats:views:${day}`, 60 * 60 * 48);
  } catch {
    /* no-op */
  }
  return NextResponse.json({ ok: true });
}
