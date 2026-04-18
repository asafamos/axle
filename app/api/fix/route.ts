import { NextResponse } from "next/server";
import { generateFix } from "@/lib/fixer";
import type { AxeViolation } from "@/lib/scanner";
import { consumeFreeFix, lookupKey } from "@/lib/billing/keys";

export const runtime = "nodejs";
export const maxDuration = 60;

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      violation?: AxeViolation;
      nodeIndex?: number;
    };

    if (!body?.violation) {
      return NextResponse.json(
        { error: "violation is required" },
        { status: 400 }
      );
    }

    // Tiered access:
    // 1. A subscriber API key (header or cookie) → unlimited, using our
    //    Anthropic key.
    // 2. Anonymous / no key → 3 free fixes per IP per day. After that, 402.
    const headerKey = req.headers.get("x-axle-key") || "";
    const cookie = req.headers.get("cookie") || "";
    const cookieKey = /(?:^|;\s*)axle_key=([^;]+)/.exec(cookie)?.[1] || "";
    const candidate = (headerKey || cookieKey).trim();

    let tier: "subscriber" | "free" = "free";
    if (candidate) {
      const record = await lookupKey(candidate);
      if (record && (record.status === "active" || record.status === "trialing")) {
        tier = "subscriber";
      } else if (record && record.status !== "active") {
        return NextResponse.json(
          { error: `Your subscription is ${record.status}. Update billing at /account.` },
          { status: 402 }
        );
      }
      // If record is null, fall through to free-tier flow.
    }

    if (tier === "free") {
      const ip = clientIp(req);
      const quota = await consumeFreeFix(ip);
      if (!quota.allowed) {
        return NextResponse.json(
          {
            error: `Free tier limit reached (${quota.limit} AI fixes per day). Upgrade at /#pricing for unlimited.`,
            remaining: 0,
            limit: quota.limit,
            upgrade_url: "/#pricing",
          },
          { status: 402 }
        );
      }
      const nodeIndex = body.nodeIndex ?? 0;
      const fix = await generateFix(body.violation, nodeIndex);
      return NextResponse.json({ ...fix, tier, remaining: quota.remaining, limit: quota.limit });
    }

    const nodeIndex = body.nodeIndex ?? 0;
    const fix = await generateFix(body.violation, nodeIndex);
    return NextResponse.json({ ...fix, tier });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during fix";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
