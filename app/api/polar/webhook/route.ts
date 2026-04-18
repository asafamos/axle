import { NextResponse } from "next/server";
import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import {
  generatePlaintextKey,
  storeKey,
  updateStatusByCustomerId,
  type KeyRecord,
} from "@/lib/billing/keys";
import { sendApiKeyEmail } from "@/lib/billing/email";

export const runtime = "nodejs";

/**
 * Polar webhook. Events we act on:
 * - subscription.created → provision API key + email customer.
 * - subscription.active / updated → sync status.
 * - subscription.canceled / revoked → mark canceled.
 *
 * Signature verification uses the shared secret stored in
 * POLAR_WEBHOOK_SECRET. Polar uses the Standard Webhooks spec, so we pass
 * the raw body, headers and secret to validateEvent and let the SDK decide.
 */
export async function POST(req: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "POLAR_WEBHOOK_SECRET not configured" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let event: Awaited<ReturnType<typeof validateEvent>>;
  try {
    event = validateEvent(rawBody, headers, secret);
  } catch (err) {
    if (err instanceof WebhookVerificationError) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }
    throw err;
  }

  try {
    switch (event.type) {
      case "subscription.created": {
        const sub = event.data as PolarSubscription;
        await provisionFromSubscription(sub);
        break;
      }
      case "subscription.active":
      case "subscription.updated": {
        const sub = event.data as PolarSubscription;
        const customerId = sub.customerId || sub.customer?.id;
        if (customerId) {
          await updateStatusByCustomerId(customerId, mapPolarStatus(sub.status));
        }
        break;
      }
      case "subscription.canceled":
      case "subscription.revoked": {
        const sub = event.data as PolarSubscription;
        const customerId = sub.customerId || sub.customer?.id;
        if (customerId) await updateStatusByCustomerId(customerId, "canceled");
        break;
      }
      default:
        // Ignore other events (order.created, etc.) for now.
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Handler failed";
    console.error("[polar webhook]", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

type PolarSubscription = {
  id: string;
  status: string;
  customerId?: string;
  customer?: { id: string; email?: string };
  metadata?: Record<string, string | number | boolean | null>;
  productId?: string;
  product?: { id: string };
};

async function provisionFromSubscription(sub: PolarSubscription): Promise<void> {
  const customerId = sub.customerId || sub.customer?.id;
  const email = sub.customer?.email;
  if (!customerId) throw new Error("subscription.created without customerId");
  if (!email) throw new Error("subscription.created without customer email");

  const planMeta = typeof sub.metadata?.plan === "string" ? sub.metadata.plan : "team";
  const plan = planMeta === "business" ? "business" : "team";

  const plaintextKey = generatePlaintextKey();
  const record: KeyRecord = {
    email,
    customerId,
    subscriptionId: sub.id,
    plan,
    status: "active",
    createdAt: Date.now(),
  };

  await storeKey(plaintextKey, record);
  await sendApiKeyEmail({ to: email, apiKey: plaintextKey, plan });
}

function mapPolarStatus(status: string): KeyRecord["status"] {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "canceled":
    case "revoked":
      return "canceled";
    case "incomplete":
      return "incomplete";
    default:
      return "incomplete";
  }
}
