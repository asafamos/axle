import { Resend } from "resend";

let client: Resend | null = null;

function resend(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

/**
 * The customer-facing canonical URL. Reads from NEXT_PUBLIC_SITE_URL — same
 * value used for canonical / sitemap / OG metadata. Hardcoding a dead domain
 * (axle.dev didn't resolve as of 2026-04-27) cost us at least one
 * subscription refund: the customer paid, opened the welcome email, every
 * link 404'd, and they refunded.
 */
function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app").replace(/\/$/, "");
}

const SANDBOX_FROM = "axle <onboarding@resend.dev>";

/**
 * Is e-mail delivery configured well enough to reach a real customer?
 *
 * Returns a human-readable reason when it is not. Callers use this to tell a
 * permanent misconfiguration (never worth retrying) apart from a transient send
 * failure (worth retrying).
 */
export function emailConfigProblem(): string | null {
  if (!process.env.RESEND_API_KEY) return "RESEND_API_KEY is not set";
  const configured = process.env.RESEND_FROM?.trim();
  if (!configured || configured === SANDBOX_FROM) {
    return (
      "RESEND_FROM is not set to a verified domain — Resend's sandbox sender only " +
      "delivers to addresses verified in the dashboard, so customers get nothing"
    );
  }
  return null;
}

/**
 * Sender for internal alerts to ourselves. Unlike {@link fromAddress} this must
 * never throw and never give up: the alert it carries is often *about*
 * RESEND_FROM being unset, so refusing to send without RESEND_FROM would
 * suppress exactly the message a human needs. The sandbox sender is legitimate
 * here because the recipient is our own dashboard-verified address.
 */
function internalAlertFrom(): string {
  return process.env.RESEND_FROM?.trim() || SANDBOX_FROM;
}

/**
 * A Resend rejection, tagged with whether retrying could ever help.
 *
 * `permanent` means the request will be rejected identically forever — an
 * unverified sending domain, a malformed address, a restricted API key. Retrying
 * those just spins the provider's webhook queue for three days while the
 * customer sits there having paid, so callers should escalate to a human
 * instead. Everything else (rate limits, 5xx, network) is transient.
 */
export class EmailSendError extends Error {
  readonly permanent: boolean;
  constructor(message: string, permanent: boolean) {
    super(message);
    this.name = "EmailSendError";
    this.permanent = permanent;
  }
}

/** Resend error names/status codes that no amount of retrying will fix. */
function isPermanentSendError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  const { name, statusCode } = error as { name?: string; statusCode?: number };
  const permanentNames = new Set([
    "validation_error", // malformed from/to
    "invalid_from_address", // domain not verified for sending
    "restricted_api_key", // key lacks send permission
    "missing_api_key",
    "invalid_api_key",
    "not_found",
  ]);
  if (name && permanentNames.has(name)) return true;
  // 4xx other than 429 is a client-side problem we cannot retry our way out of.
  return typeof statusCode === "number" && statusCode >= 400 && statusCode < 500 && statusCode !== 429;
}

/**
 * Resend's `onboarding@resend.dev` is a SANDBOX domain that only delivers to
 * email addresses verified in the Resend dashboard. If we silently use it
 * for live customers, their welcome emails get rejected by Resend with no
 * surface-level error and the customer never receives their API key — direct
 * cause of refunds. RESEND_FROM must be explicitly set in production to a
 * verified domain (e.g. "axle <hello@axle-iota.vercel.app>" or a custom
 * verified domain).
 */
function fromAddress(): string {
  const configured = process.env.RESEND_FROM?.trim();
  if (configured && configured !== SANDBOX_FROM) return configured;
  // In dev / preview we're OK falling through to the sandbox; in production
  // we make the failure loud so it's caught at deploy time, not at the
  // moment a customer pays.
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_SANDBOX_EMAIL) {
    throw new Error(
      "RESEND_FROM is not configured (or still set to the Resend sandbox address). " +
        "Customers will not receive their API keys. Set RESEND_FROM in Vercel " +
        "env to a verified domain. Set ALLOW_SANDBOX_EMAIL=1 to bypass for testing.",
    );
  }
  return SANDBOX_FROM;
}

/**
 * Notify the founder when a *genuinely external* lead is captured (a stranger
 * leaves their email under a scan result — not a self-test or health probe).
 * Best-effort: this must NEVER throw or block a lead capture. Without it, the
 * first real lead sat undiscovered for 3 days (found only on a manual /admin
 * refresh). Recipient defaults to the human reply-to; override with
 * LEAD_NOTIFY_TO. Requires RESEND_API_KEY + RESEND_FROM (already set in prod
 * for welcome emails); silently no-ops if email isn't configured.
 */
export async function sendLeadNotificationEmail(lead: {
  email: string;
  url?: string;
  critical?: number;
  serious?: number;
  violations?: number;
  source?: string;
}): Promise<void> {
  try {
    const r = resend();
    if (!r) return; // no RESEND_API_KEY — nothing to do
    const to = process.env.LEAD_NOTIFY_TO?.trim() || "asaf@amoss.co.il";
    const site = siteUrl();
    const host = (() => {
      try {
        return lead.url ? new URL(lead.url).hostname : "";
      } catch {
        return "";
      }
    })();
    const sev =
      lead.critical != null || lead.serious != null
        ? `${lead.critical ?? 0} critical · ${lead.serious ?? 0} serious`
        : lead.violations != null
          ? `${lead.violations} violations`
          : "";
    const subject = `🎯 New external lead: ${lead.email}${host ? ` (${host})` : ""}`;
    const lines = [
      "A non-internal email just landed under a scan result.",
      "",
      `Email:  ${lead.email}`,
      lead.url ? `Site:   ${lead.url}` : "",
      sev ? `Found:  ${sev}` : "",
      lead.source ? `Source: ${lead.source}` : "",
      "",
      `Full dashboard: ${site}/admin`,
    ].filter(Boolean);
    const { error } = await r.emails.send({
      from: fromAddress(),
      to,
      subject,
      text: lines.join("\n"),
    });
    if (error) {
      console.warn(
        `[email] lead notification failed for ${lead.email}: ${
          typeof error === "object" ? JSON.stringify(error) : String(error)
        }`,
      );
    }
  } catch (err) {
    // Swallow everything — a lead capture must never fail because the
    // founder-notification email errored (e.g. RESEND_FROM unset in prod).
    console.warn(
      `[email] lead notification threw for ${lead.email}: ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
  }
}

export async function sendApiKeyEmail(opts: {
  to: string;
  apiKey: string;
  plan: "team" | "business";
}): Promise<void> {
  const r = resend();
  if (!r) {
    console.warn("[email] RESEND_API_KEY missing — skipping email send");
    return;
  }
  const planName = opts.plan === "business" ? "Business" : "Team";
  const site = siteUrl();
  const accountUrl = `${site}/account`;
  const from = fromAddress();
  const { error } = await r.emails.send({
    from,
    to: opts.to,
    subject: `Your axle API key — welcome to ${planName}`,
    text: [
      `Welcome to axle ${planName}.`,
      "",
      "Your API key (copy now — we won't show it again):",
      "",
      opts.apiKey,
      "",
      "How to use it:",
      "• GitHub Action: add it as the 'AXLE_API_KEY' repo secret, then pass `axle-api-key: ${{ secrets.AXLE_API_KEY }}` to asafamos/axle-action@v1.",
      "• CLI: `export AXLE_API_KEY=<key>` before running `npx axle-cli scan ...`.",
      `• Web: visit ${accountUrl} and paste the key once to unlock unlimited fixes in the browser.`,
      "",
      `Manage your subscription anytime at ${accountUrl}.`,
      "",
      "If anything's broken, just reply to this email — it goes to a real human. asaf@amoss.co.il",
      "",
      "axle provides remediation assistance, not a compliance certificate.",
    ].join("\n"),
    html: [
      `<p>Welcome to <strong>axle ${planName}</strong>.</p>`,
      `<p>Your API key (copy now — we won't show it again):</p>`,
      `<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-family:monospace;user-select:all;word-break:break-all;">${opts.apiKey}</pre>`,
      `<h3>How to use it</h3>`,
      `<ul>`,
      `<li><strong>GitHub Action:</strong> add it as the <code>AXLE_API_KEY</code> repo secret, then pass it to <code>asafamos/axle-action@v1</code>.</li>`,
      `<li><strong>CLI:</strong> <code>export AXLE_API_KEY=&lt;key&gt;</code> before running <code>npx axle-cli scan ...</code>.</li>`,
      `<li><strong>Web:</strong> paste at <a href="${accountUrl}">${accountUrl}</a> once to unlock unlimited fixes in the browser.</li>`,
      `</ul>`,
      `<p><a href="${accountUrl}">Manage your subscription</a> anytime.</p>`,
      `<p>If anything's broken, just reply to this email — it goes to a real human at <a href="mailto:asaf@amoss.co.il">asaf@amoss.co.il</a>.</p>`,
      `<p style="color:#888;font-size:12px;">axle provides remediation assistance, not a compliance certificate.</p>`,
    ].join(""),
  });
  if (error) {
    // Loud-fail so the webhook handler can decide what to do. Tagged with
    // whether a retry could ever succeed: transient failures are worth
    // redelivering, permanent ones need a human, not another attempt.
    throw new EmailSendError(
      `[email] Resend send failed for ${opts.to}: ${typeof error === "object" ? JSON.stringify(error) : String(error)}`,
      isPermanentSendError(error),
    );
  }
}

/**
 * Tell a human that someone paid and did not get their key.
 *
 * Best-effort by construction: it never throws, and it falls back to both a
 * default recipient and the sandbox sender, because the situations it reports
 * are precisely the ones where LEAD_NOTIFY_TO or RESEND_FROM may be missing.
 * An alert that silently no-ops in the one case it was written for is worse
 * than no alert at all — it looks like coverage that isn't there.
 */
export async function sendKeyDeliveryFailureAlert(alert: {
  email: string;
  plan: string;
  customerId: string;
  apiKey: string;
  reason: string;
}): Promise<void> {
  try {
    const r = resend();
    if (!r) {
      // No API key at all: the console is genuinely the only channel left.
      console.error(
        `[email] CANNOT ALERT (no RESEND_API_KEY) — ${alert.email} paid and did not receive key ${alert.apiKey}: ${alert.reason}`,
      );
      return;
    }
    const to = process.env.LEAD_NOTIFY_TO?.trim() || "asaf@amoss.co.il";
    const payload = {
      to,
      subject: `⚠️ axle: ${alert.email} paid but did NOT receive their key`,
      text: [
        `Customer:    ${alert.email}`,
        `Plan:        ${alert.plan}`,
        `Customer ID: ${alert.customerId}`,
        `API key:     ${alert.apiKey}`,
        "",
        `Reason:      ${alert.reason}`,
        "",
        "Send this key to them manually, then fix the cause above.",
      ].join("\n"),
    };

    const primaryFrom = internalAlertFrom();
    const { error } = await r.emails.send({ from: primaryFrom, ...payload });
    if (!error) return;

    // The most likely reason this alert failed is the same reason the customer's
    // e-mail failed: RESEND_FROM names a domain that was never verified. Fall
    // back to the sandbox sender, which does reach a dashboard-verified address.
    if (primaryFrom !== SANDBOX_FROM) {
      const retry = await r.emails.send({ from: SANDBOX_FROM, ...payload });
      if (!retry.error) return;
    }
    console.error(
      `[email] delivery-failure alert itself failed for ${alert.email}: ${
        typeof error === "object" ? JSON.stringify(error) : String(error)
      } — key was ${alert.apiKey}`,
    );
  } catch (err) {
    // Alerting must never be the thing that fails the webhook.
    console.error(
      `[email] delivery-failure alert threw for ${alert.email}: ${
        err instanceof Error ? err.message : String(err)
      } — key was ${alert.apiKey}`,
    );
  }
}
