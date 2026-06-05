import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";
import { isInternalEmail } from "@/lib/internal";
import { sendLeadNotificationEmail } from "@/lib/billing/email";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: {
    email?: string;
    url?: string;
    violations?: number;
    critical?: number;
    serious?: number;
    source?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const redis = kv();
  if (!redis) {
    // If KV is down we still accept the submission so the user sees success;
    // we just lose the lead. Better than blocking a signup on infra issues.
    return NextResponse.json({ ok: true, stored: false });
  }

  const record = {
    email,
    url: typeof body.url === "string" ? body.url.slice(0, 500) : "",
    violations: Number.isFinite(body.violations) ? Number(body.violations) : 0,
    critical: Number.isFinite(body.critical) ? Number(body.critical) : 0,
    serious: Number.isFinite(body.serious) ? Number(body.serious) : 0,
    source: typeof body.source === "string" ? body.source.slice(0, 40) : "scan-result",
    created_at: Date.now(),
    created_at_iso: new Date().toISOString(),
    ua: req.headers.get("user-agent")?.slice(0, 200) || "",
  };

  // Is this a brand-new email (vs an idempotent re-subscribe)? Checked before
  // the set so we only ping the founder once per lead. Fail-closed: if the
  // lookup errors, treat as not-new and skip the notification.
  const isNew = !(await redis.get(`axle:lead:${email}`).catch(() => "x"));

  try {
    // Store as the latest record keyed by email (idempotent — re-subscribe updates).
    await redis.set(`axle:lead:${email}`, JSON.stringify(record));
    // Append email to a list for easy retrieval in admin.
    await redis.lpush("axle:leads:list", email);
    // Counters for /admin insight.
    const day = new Date().toISOString().slice(0, 10);
    await redis.incr("axle:stats:leads:all");
    await redis.incr(`axle:stats:leads:${day}`);
    await redis.expire(`axle:stats:leads:${day}`, 60 * 60 * 48);
  } catch {
    return NextResponse.json({ ok: true, stored: false });
  }

  // Brand-new *external* lead → notify the founder so it isn't discovered days
  // late on a manual /admin refresh. Internal self-tests are skipped.
  if (isNew && !isInternalEmail(email)) {
    await sendLeadNotificationEmail(record);
  }

  return NextResponse.json({ ok: true, stored: true });
}
