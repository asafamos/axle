import { NextResponse } from "next/server";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app";

/**
 * /api/slack/oauth — Slack OAuth callback.
 *
 * Flow:
 *   1. User clicks "Add to Slack" at /slack
 *   2. Slack redirects to https://slack.com/oauth/v2/authorize?... with our
 *      client_id and the bot scopes
 *   3. User approves → Slack redirects back here with ?code=...
 *   4. We exchange the code for an access token at slack.com/api/oauth.v2.access
 *   5. We persist { team_id, bot_token, bot_user_id, installer_user_id }
 *      into KV under axle:slack:team:<team_id> so the command handler can
 *      authenticate outgoing chat.postMessage calls (if/when we move away
 *      from response_url for delayed responses)
 *   6. Redirect the user to /slack/installed for the welcome page
 */
export async function GET(req: Request): Promise<Response> {
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Slack OAuth is not configured on this deployment." },
      { status: 503 }
    );
  }

  const u = new URL(req.url);
  const code = u.searchParams.get("code");
  const err = u.searchParams.get("error");
  if (err) {
    return NextResponse.redirect(
      `${SITE_URL}/slack?install_error=${encodeURIComponent(err)}`,
      302
    );
  }
  if (!code) {
    return NextResponse.json({ error: "Missing ?code" }, { status: 400 });
  }

  const exchangeRes = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${SITE_URL}/api/slack/oauth`,
    }),
  });

  const data = (await exchangeRes.json()) as {
    ok: boolean;
    error?: string;
    team?: { id: string; name: string };
    access_token?: string;
    bot_user_id?: string;
    authed_user?: { id: string };
  };

  if (!data.ok) {
    return NextResponse.redirect(
      `${SITE_URL}/slack?install_error=${encodeURIComponent(data.error || "exchange_failed")}`,
      302
    );
  }

  // Persist install record (best-effort; missing KV doesn't break the flow,
  // we just can't deliver async messages outside the response_url window).
  const redis = kv();
  if (redis && data.team?.id) {
    await redis
      .set(
        `axle:slack:team:${data.team.id}`,
        JSON.stringify({
          team_id: data.team.id,
          team_name: data.team.name,
          bot_token: data.access_token,
          bot_user_id: data.bot_user_id,
          installer_user_id: data.authed_user?.id,
          installed_at: new Date().toISOString(),
        }),
        { ex: 60 * 60 * 24 * 365 }, // 1 year — refreshed on any re-install
      )
      .catch(() => {
        // Non-fatal: install still works for response_url-driven flows.
      });
  }

  return NextResponse.redirect(`${SITE_URL}/slack?installed=1`, 302);
}
