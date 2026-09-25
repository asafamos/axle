import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";
import { isInternalEmail } from "@/lib/internal";
import {
  sendLeadNotificationEmail,
  sendScanReportEmail,
} from "@/lib/billing/email";
import { scanUrl } from "@/lib/scanner";

export const runtime = "nodejs";
export const maxDuration = 60;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_MAX = 500;
const SUSPICIOUS_TLD = /\.(local|test|invalid|example)$/i;

/**
 * /api/free-scan — accepts a URL + email, RUNS the scan now, emails the report,
 * and returns the results so the page can show them inline immediately.
 *
 * This replaces the previous design, which only queued the request for a human
 * operator to pick up from /admin and email manually — in practice that step
 * never happened, so every "check your inbox" promise went unfulfilled. Now the
 * scan runs synchronously (maxDuration 60s), results come straight back to the
 * caller, and the email is a best-effort copy (never blocks the response).
 *
 * Anti-abuse: URL must parse as http/https and not be an internal hostname;
 * per-email rate limit of 5 scans/day.
 */
export async function POST(req: Request) {
  let body: { email?: string; url?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const rawUrl = String(body.url || "").trim();
  if (!rawUrl || rawUrl.length > URL_MAX) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Could not parse URL" }, { status: 400 });
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return NextResponse.json(
      { error: "Only http/https URLs are accepted" },
      { status: 400 },
    );
  }
  if (
    parsed.hostname === "localhost" ||
    parsed.hostname.startsWith("127.") ||
    parsed.hostname.startsWith("192.168.") ||
    parsed.hostname.startsWith("10.") ||
    SUSPICIOUS_TLD.test(parsed.hostname)
  ) {
    return NextResponse.json(
      {
        error:
          "Internal/test hostnames are not accepted on the public scan endpoint",
      },
      { status: 400 },
    );
  }

  const redis = kv();

  // Per-email per-day rate limit (best-effort; never blocks on infra failure).
  if (redis) {
    try {
      const day = new Date().toISOString().slice(0, 10);
      const rateKey = `axle:free-scan:rate:${email}:${day}`;
      const used = Number((await redis.get(rateKey)) || 0);
      if (used >= 5) {
        return NextResponse.json(
          {
            error:
              "Daily free-scan limit reached for this email. Try again tomorrow.",
          },
          { status: 429 },
        );
      }
      await redis.incr(rateKey);
      await redis.expire(rateKey, 60 * 60 * 26);
    } catch {
      /* rate-limit infra down — do not block the user */
    }
  }

  const source =
    typeof body.source === "string" ? body.source.slice(0, 40) : "free-scan-page";

  // Capture the lead + counters (best-effort). Done before the scan so a lead is
  // never lost even if the scan then fails.
  const isNew = redis
    ? !(await redis.get(`axle:lead:${email}`).catch(() => "x"))
    : true;
  if (redis) {
    try {
      const now = Date.now();
      const day = new Date().toISOString().slice(0, 10);
      await redis.set(
        `axle:lead:${email}`,
        JSON.stringify({
          email,
          url: parsed.toString().slice(0, URL_MAX),
          source: `free-scan:${source}`,
          created_at: now,
          created_at_iso: new Date(now).toISOString(),
        }),
      );
      await redis.lpush("axle:leads:list", email);
      await redis.incr("axle:stats:free-scan:all");
      await redis.incr(`axle:stats:free-scan:${day}`);
      await redis.expire(`axle:stats:free-scan:${day}`, 60 * 60 * 48);
      await redis.incr("axle:stats:leads:all");
      await redis.incr(`axle:stats:leads:${day}`);
      await redis.expire(`axle:stats:leads:${day}`, 60 * 60 * 48);
    } catch {
      /* lead capture failed — continue; the scan is the priority */
    }
  }

  // Notify the founder of a genuinely new external lead (best-effort).
  if (isNew && !isInternalEmail(email)) {
    await sendLeadNotificationEmail({
      email,
      url: parsed.toString(),
      source: `free-scan:${source}`,
    });
  }

  // Run the scan now.
  let result;
  try {
    result = await scanUrl(parsed.toString());
  } catch (err) {
    console.warn(
      `[free-scan] scan failed for ${parsed.hostname}: ${err instanceof Error ? err.message : String(err)}`,
    );
    return NextResponse.json({
      ok: true,
      scanned: false,
      host: parsed.hostname,
      message:
        "We couldn't load that URL to scan it. Make sure it's a public page (not behind a login) and try again.",
    });
  }

  const violations = result.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    help: v.help,
    helpUrl: v.helpUrl,
    nodeCount: Array.isArray(v.nodes) ? v.nodes.length : 0,
  }));

  // Best-effort emailed copy (never blocks / throws).
  await sendScanReportEmail({
    to: email,
    url: result.url,
    violations,
    summary: result.summary,
    permalink: result.permalink ?? null,
  });

  return NextResponse.json({
    ok: true,
    scanned: true,
    host: parsed.hostname,
    title: result.title,
    total: violations.length,
    summary: result.summary,
    // Cap the inline list; the email carries the same top slice.
    violations: violations.slice(0, 20),
    emailed: email,
  });
}
