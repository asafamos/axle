import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_MAX = 500;
const SUSPICIOUS_TLD = /\.(local|test|invalid|example)$/i;

/**
 * /api/free-scan — accepts a URL + email pair, queues a deeper scan,
 * and the scan output is delivered to the email. The actual scan run
 * happens out-of-band (current implementation: stored as a queue
 * entry; an operator picks up via /admin and triggers the email).
 *
 * For the Wave 7 launch, we get the email captured + queued; the
 * delivery side is wired through the existing scan + email pipeline.
 *
 * Anti-abuse: lightweight URL validation (must parse, http/https only,
 * no obvious internal hostnames). Email format check. Per-email rate
 * limit at 5 scans / day to prevent the form being used as an
 * adversarial scanner against arbitrary targets.
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
    return NextResponse.json({ error: "Only http/https URLs are accepted" }, { status: 400 });
  }
  if (
    parsed.hostname === "localhost" ||
    parsed.hostname.startsWith("127.") ||
    parsed.hostname.startsWith("192.168.") ||
    parsed.hostname.startsWith("10.") ||
    SUSPICIOUS_TLD.test(parsed.hostname)
  ) {
    return NextResponse.json(
      { error: "Internal/test hostnames are not accepted on the public scan endpoint" },
      { status: 400 },
    );
  }

  const redis = kv();
  if (!redis) {
    return NextResponse.json({ ok: true, queued: false });
  }

  // Per-email per-day rate limit
  try {
    const day = new Date().toISOString().slice(0, 10);
    const rateKey = `axle:free-scan:rate:${email}:${day}`;
    const used = Number((await redis.get(rateKey)) || 0);
    if (used >= 5) {
      return NextResponse.json(
        { error: "Daily free-scan limit reached for this email. Try again tomorrow." },
        { status: 429 },
      );
    }
    await redis.incr(rateKey);
    await redis.expire(rateKey, 60 * 60 * 26);
  } catch {
    // If rate-limit infra fails, do not block the user.
  }

  const record = {
    email,
    url: parsed.toString().slice(0, URL_MAX),
    host: parsed.hostname,
    source: typeof body.source === "string" ? body.source.slice(0, 40) : "free-scan-page",
    status: "queued" as const,
    queued_at: Date.now(),
    queued_at_iso: new Date().toISOString(),
    ua: req.headers.get("user-agent")?.slice(0, 200) || "",
  };

  try {
    // The job ID is the queued_at timestamp prefixed by the email — unique enough.
    const id = `${record.queued_at}-${email}`;
    await redis.set(`axle:free-scan:job:${id}`, JSON.stringify(record));
    await redis.lpush("axle:free-scan:queue", id);

    // Also write the email into the general lead pipeline so the
    // /admin dashboard sees a unified leads view.
    await redis.set(`axle:lead:${email}`, JSON.stringify({
      email,
      url: record.url,
      source: `free-scan:${record.source}`,
      created_at: record.queued_at,
      created_at_iso: record.queued_at_iso,
    }));
    await redis.lpush("axle:leads:list", email);

    const day = new Date().toISOString().slice(0, 10);
    await redis.incr("axle:stats:free-scan:all");
    await redis.incr(`axle:stats:free-scan:${day}`);
    await redis.expire(`axle:stats:free-scan:${day}`, 60 * 60 * 48);
    await redis.incr("axle:stats:leads:all");
    await redis.incr(`axle:stats:leads:${day}`);
    await redis.expire(`axle:stats:leads:${day}`, 60 * 60 * 48);
  } catch {
    return NextResponse.json({ ok: true, queued: false });
  }

  return NextResponse.json({ ok: true, queued: true });
}
