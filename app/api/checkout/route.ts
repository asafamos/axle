import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Dispatcher — forwards the checkout request to the active billing provider.
 * Toggle via BILLING_PROVIDER env: "stripe" (default) or "polar".
 * The client calls /api/checkout without knowing which provider is active.
 */
export async function POST(req: Request) {
  const provider = (process.env.BILLING_PROVIDER || "stripe").toLowerCase();
  const target =
    provider === "polar" ? "/api/polar/checkout" : "/api/stripe/checkout";

  // Build an absolute URL to hit our own handler within the same deployment.
  // Use req.url so we follow the host the client came in on (preview vs prod).
  const url = new URL(target, req.url);

  const body = await req.text();
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type":
        req.headers.get("content-type") || "application/json",
    },
    body,
  });
  const payload = await res.text();
  return new NextResponse(payload, {
    status: res.status,
    headers: { "Content-Type": res.headers.get("content-type") || "application/json" },
  });
}
