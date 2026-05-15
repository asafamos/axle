import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";

export const runtime = "nodejs";
export const maxDuration = 60;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app";

/**
 * /api/slack/command — handler for the /axle slash command.
 *
 * Slack will POST application/x-www-form-urlencoded with these fields:
 *   token             (deprecated; we don't use it)
 *   team_id           workspace id
 *   channel_id        channel where the command was invoked
 *   user_id           who invoked it
 *   command           "/axle"
 *   text              the argument string ("scan https://example.com")
 *   response_url      one-time webhook to POST the async result to
 *   trigger_id        for modals (unused here)
 *
 * Slack requires a response within 3 seconds, so:
 *   1. Verify the request signature (HMAC-SHA256 of timestamp + body).
 *   2. Parse the command; reject malformed early with ephemeral message.
 *   3. Acknowledge with an ephemeral "scanning..." block immediately.
 *   4. Spawn the actual scan in the background and POST the rich result
 *      to response_url when it completes (up to 5 follow-up messages
 *      allowed within 30 min, per Slack rules).
 */
export async function POST(req: Request): Promise<Response> {
  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  if (!signingSecret) {
    return NextResponse.json(
      { error: "Slack integration is not configured on this deployment." },
      { status: 503 }
    );
  }

  const rawBody = await req.text();

  // --- 1. signature verification --------------------------------------
  const timestamp = req.headers.get("x-slack-request-timestamp") || "";
  const signature = req.headers.get("x-slack-signature") || "";
  if (!verifySlackSignature({ signingSecret, timestamp, signature, rawBody })) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // --- 2. parse command ----------------------------------------------
  const params = new URLSearchParams(rawBody);
  const text = (params.get("text") || "").trim();
  const responseUrl = params.get("response_url") || "";
  const teamId = params.get("team_id") || "";
  const userId = params.get("user_id") || "";

  const match = /^scan\s+(\S+)/i.exec(text);
  if (!match) {
    return NextResponse.json(
      slackEphemeral(
        "Usage: `/axle scan <url>` — e.g. `/axle scan https://example.com`",
      ),
    );
  }

  let url = match[1];
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;
  try {
    new URL(url);
  } catch {
    return NextResponse.json(
      slackEphemeral(`Couldn't parse \`${match[1]}\` as a URL.`),
    );
  }

  // --- 3. ack within 3s ----------------------------------------------
  // Slack times out anything after 3 seconds. Kick off the scan in the
  // background and return an ephemeral "scanning" placeholder. The real
  // result lands via response_url after the scan completes (~15-30s).
  scheduleScanAndRespond(url, responseUrl, { teamId, userId }).catch((err) => {
    // Best-effort recovery: POST the error back to response_url so the user
    // sees something. If response_url is dead, silent log.
    fetch(responseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        slackInChannel(
          `:warning: axle scan failed: ${
            err?.message ?? String(err)
          }. Try the web form at ${SITE_URL}/free-scan if this keeps happening.`,
        ),
      ),
    }).catch(() => {
      // Swallow — we already lost the request channel.
    });
  });

  return NextResponse.json(
    slackEphemeral(`:mag: Scanning ${url} for WCAG 2.2 AA violations...`),
  );
}

function verifySlackSignature({
  signingSecret,
  timestamp,
  signature,
  rawBody,
}: {
  signingSecret: string;
  timestamp: string;
  signature: string;
  rawBody: string;
}): boolean {
  if (!timestamp || !signature) return false;
  // Reject replays > 5 minutes old
  const fiveMin = 60 * 5;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > fiveMin) return false;

  const baseString = `v0:${timestamp}:${rawBody}`;
  const expected =
    "v0=" +
    createHmac("sha256", signingSecret).update(baseString).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function slackEphemeral(text: string) {
  return {
    response_type: "ephemeral" as const,
    text,
  };
}

function slackInChannel(text: string) {
  return {
    response_type: "in_channel" as const,
    text,
  };
}

async function scheduleScanAndRespond(
  url: string,
  responseUrl: string,
  meta: { teamId: string; userId: string },
): Promise<void> {
  // We invoke our own hosted /api/scan endpoint so the scan runs in the
  // same environment as web / GH Action / VS Code / MCP — same engine, same
  // rate limits, same persistence.
  const res = await fetch(`${SITE_URL}/api/scan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": `axle-slack/0.1 team=${meta.teamId}`,
    },
    body: JSON.stringify({ url, source: "axle-slack" }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    await fetch(responseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        slackInChannel(
          `:x: axle scan returned ${res.status} for ${url}.${
            errText ? ` (${errText.slice(0, 200)})` : ""
          }`,
        ),
      ),
    });
    return;
  }

  const data = await res.json();
  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(renderResultMessage(url, data)),
  });
}

type ScanResp = {
  url?: string;
  result_id?: string | null;
  permalink?: string | null;
  summary?: {
    critical?: number;
    serious?: number;
    moderate?: number;
    minor?: number;
  };
  violations?: Array<{
    id: string;
    impact?: string;
    help: string;
    helpUrl?: string;
    nodes?: unknown[];
    tags?: string[];
  }>;
};

function renderResultMessage(scannedUrl: string, data: ScanResp) {
  const s = data.summary || { critical: 0, serious: 0, moderate: 0, minor: 0 };
  const total =
    (s.critical || 0) + (s.serious || 0) + (s.moderate || 0) + (s.minor || 0);
  const permalink =
    data.permalink && data.permalink.startsWith("/")
      ? `${SITE_URL}${data.permalink}`
      : data.permalink || null;

  if (total === 0) {
    return {
      response_type: "in_channel" as const,
      text: `:white_check_mark: ${scannedUrl} passed the axle WCAG 2.2 AA scan.`,
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:white_check_mark: *${scannedUrl}* passed the axle WCAG 2.2 AA scan.\n\nNo automated violations detected. Manual review by a human auditor is still recommended for full conformance — automated tools catch ~57% of WCAG issues.${
              permalink ? `\n\n<${permalink}|View certificate page →>` : ""
            }`,
          },
        },
      ],
    };
  }

  const violations = (data.violations || []).slice(0, 3);
  const violationLines = violations
    .map((v) => {
      const impact = (v.impact || "minor").toUpperCase();
      const nodeCount = Array.isArray(v.nodes) ? v.nodes.length : 0;
      return `*${impact}* — \`${v.id}\` · ${v.help} (${nodeCount} element${nodeCount === 1 ? "" : "s"})`;
    })
    .join("\n");

  const overflow = (data.violations?.length || 0) - violations.length;
  const overflowLine = overflow > 0 ? `\n\n_…and ${overflow} more — see full report._` : "";

  return {
    response_type: "in_channel" as const,
    text: `axle scan: ${scannedUrl} — ${total} violations`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `:warning: *${scannedUrl}*\n*${total}* violations · :red_circle: ${s.critical || 0} critical · :large_orange_circle: ${s.serious || 0} serious · :large_yellow_circle: ${s.moderate || 0} moderate · :large_blue_circle: ${s.minor || 0} minor`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: violationLines + overflowLine,
        },
      },
      ...(permalink
        ? [
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "Full report" },
                  url: permalink,
                  style: "primary",
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "How to fix" },
                  url: `${SITE_URL}/why-axle`,
                },
              ],
            },
          ]
        : []),
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Powered by <${SITE_URL}|axle> · <${SITE_URL}/mcp|MCP server> · <${SITE_URL}/why-axle|Why axle>`,
          },
        ],
      },
    ],
  };
}
