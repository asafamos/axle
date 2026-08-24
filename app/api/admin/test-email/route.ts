import { NextResponse } from "next/server";
import { sendApiKeyEmail } from "@/lib/billing/email";

export const runtime = "nodejs";

/**
 * Admin-only: send a real welcome/key email through the exact customer path
 * (sendApiKeyEmail → fromAddress → Resend) to a chosen address. Used to prove
 * end-to-end deliverability after changing RESEND_FROM, without faking a
 * purchase. Guarded by ADMIN_TOKEN, same as /api/admin/summary. The key in the
 * email is an obvious throwaway (`axle_test_…`), never a real provisioned key.
 */
function checkAuth(req: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return false;
  const header = req.headers.get("authorization") || "";
  const provided = header.replace(/^Bearer\s+/i, "");
  return provided.length > 0 && provided === token;
}

export async function POST(req: Request) {
  if (!checkAuth(req)) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Send 'Authorization: Bearer <ADMIN_TOKEN>'.",
      },
      { status: 401 },
    );
  }

  const body = (await req.json().catch(() => ({}))) as {
    to?: string;
    plan?: "site" | "team" | "business";
  };
  const to = (body.to || "").trim();
  if (!to || !to.includes("@")) {
    return NextResponse.json(
      { error: "Provide a valid 'to' email in the JSON body." },
      { status: 400 },
    );
  }
  const plan =
    body.plan === "team" || body.plan === "business" ? body.plan : "site";

  try {
    // Throwaway key so a recipient can never mistake this for a live one.
    const testKey = `axle_test_${Math.round(Date.now() / 1000).toString(36)}`;
    await sendApiKeyEmail({ to, apiKey: testKey, plan });
    return NextResponse.json({
      ok: true,
      to,
      plan,
      from: process.env.RESEND_FROM ?? null,
      note: "Resend accepted the send. If RESEND_FROM is a verified domain, it will deliver.",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err),
        from: process.env.RESEND_FROM ?? null,
      },
      { status: 502 },
    );
  }
}
