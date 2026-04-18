import { Resend } from "resend";

let client: Resend | null = null;

function resend(): Resend | null {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  client = new Resend(key);
  return client;
}

const FROM =
  process.env.RESEND_FROM ||
  "axle <onboarding@resend.dev>"; // works out of the box in sandbox; replace with verified domain later.

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
  const { error } = await r.emails.send({
    from: FROM,
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
      "• Web: visit https://axle.dev/account and paste the key once to unlock unlimited fixes in the browser.",
      "",
      "Manage your subscription anytime at https://axle.dev/account.",
      "",
      "axle provides remediation assistance, not a compliance certificate.",
    ].join("\n"),
    html: [
      `<p>Welcome to <strong>axle ${planName}</strong>.</p>`,
      `<p>Your API key (copy now — we won't show it again):</p>`,
      `<pre style="background:#f5f5f5;padding:12px;border-radius:6px;font-family:monospace;user-select:all;">${opts.apiKey}</pre>`,
      `<h3>How to use it</h3>`,
      `<ul>`,
      `<li><strong>GitHub Action:</strong> add it as the <code>AXLE_API_KEY</code> repo secret, then pass it to <code>asafamos/axle-action@v1</code>.</li>`,
      `<li><strong>CLI:</strong> <code>export AXLE_API_KEY=&lt;key&gt;</code> before running <code>npx axle-cli scan ...</code>.</li>`,
      `<li><strong>Web:</strong> paste at <a href="https://axle.dev/account">axle.dev/account</a> once to unlock unlimited fixes in the browser.</li>`,
      `</ul>`,
      `<p><a href="https://axle.dev/account">Manage your subscription</a> anytime.</p>`,
      `<p style="color:#888;font-size:12px;">axle provides remediation assistance, not a compliance certificate.</p>`,
    ].join(""),
  });
  if (error) {
    console.error("[email] send failed", error);
  }
}
