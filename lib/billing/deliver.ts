import {
  generatePlaintextKey,
  lookupDeliveryKey,
  storeKey,
  type KeyRecord,
} from "./keys";
import {
  EmailSendError,
  emailConfigProblem,
  sendApiKeyEmail,
  sendKeyDeliveryFailureAlert,
} from "./email";

/**
 * The one place a paid checkout turns into a delivered API key.
 *
 * It exists because the previous inline version had two faults that only show
 * up once real money is involved:
 *
 * 1. It minted a fresh random key on every call. The webhook returns 500 when
 *    the welcome e-mail fails, the provider then redelivers, and each redelivery
 *    minted and stored *another* key for the same customer. Here the key is
 *    looked up first, so a redelivery reuses it for as long as the provider
 *    might still retry.
 *
 * 2. It treated every e-mail failure as retryable. A transient Resend outage is
 *    worth a retry; a missing RESEND_FROM or an unverified sending domain is
 *    not — that configuration cannot fix itself, so retrying just spins the
 *    provider's queue for days while the customer sits there having paid.
 *    Permanent failures are recorded and escalated to a human instead, and the
 *    webhook is allowed to succeed.
 */
export type Delivery = {
  key: string;
  delivered: boolean;
  /** Why delivery failed, when it did. Absent on success. */
  reason?: string;
};

export async function deliverKey(record: KeyRecord): Promise<Delivery> {
  // Reuse the key already minted for this customer if one exists — this is what
  // makes redelivery of the same webhook safe. storeKey refreshes the lookup's
  // TTL on every call, so a run of retries keeps converging on the same key.
  const existing = await lookupDeliveryKey(record.customerId);
  const key = existing ?? generatePlaintextKey();
  await storeKey(key, record);

  // Checked before sending, because a send attempt would only produce a less
  // specific version of the same diagnosis.
  const configProblem = emailConfigProblem();
  if (configProblem) {
    console.error("[deliver] cannot send — permanent config problem:", configProblem);
    await escalate(record, key, configProblem);
    // Deliberately NOT throwing: no number of retries will set an env var.
    return { key, delivered: false, reason: configProblem };
  }

  try {
    await sendApiKeyEmail({ to: record.email, apiKey: key, plan: record.plan });
    return { key, delivered: true };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    const permanent = err instanceof EmailSendError && err.permanent;
    console.error(`[deliver] send failed (${permanent ? "permanent" : "transient"}):`, reason);
    await escalate(record, key, reason);
    if (permanent) {
      // e.g. RESEND_FROM points at a domain that was never verified in Resend.
      // Three days of identical rejections help nobody; a human now does.
      return { key, delivered: false, reason };
    }
    // Transient (Resend down, rate limited): a retry is worth having, and it is
    // safe because the key above is stable across the provider's retry window.
    throw err;
  }
}

/** Make sure a paying customer who got nothing reaches a human. */
async function escalate(record: KeyRecord, key: string, reason: string) {
  await sendKeyDeliveryFailureAlert({
    email: record.email,
    plan: record.plan,
    customerId: record.customerId,
    apiKey: key,
    reason,
  });
}
