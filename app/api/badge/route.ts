import { NextResponse } from "next/server";
import {
  renderBadgeSvg,
  statusToBadge,
  statusToEndpoint,
  type ComplianceStatus,
} from "@/lib/badge";

export const runtime = "nodejs";

/**
 * GET /api/badge?url=https://example.com[&format=svg|json][&standard=WCAG+2.1+AA]
 *
 * Returns either:
 * - an SVG badge (default) — embed directly in README / website
 * - a shields.io endpoint-compatible JSON — for users who prefer shields.io
 *
 * Today status is "pending" for unknown URLs; once scan history persistence
 * is wired, this reads the latest cached scan per URL and maps violations
 * to passing / issues / failing.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");
  const format = (url.searchParams.get("format") || "svg").toLowerCase();
  const standard = url.searchParams.get("standard") || "WCAG 2.1 AA";
  const override = url.searchParams.get("status") as ComplianceStatus | null;
  const VALID: ComplianceStatus[] = [
    "passing",
    "issues",
    "failing",
    "pending",
    "unknown",
  ];
  const status: ComplianceStatus =
    override && VALID.includes(override)
      ? override
      : target
      ? "pending"
      : "unknown";

  if (format === "json") {
    return NextResponse.json(statusToEndpoint(status, standard), {
      headers: {
        "Cache-Control": "public, max-age=60",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  const svg = renderBadgeSvg(statusToBadge(status, standard));
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
