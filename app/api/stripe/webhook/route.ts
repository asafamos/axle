import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/billing/stripe";
import {
  generatePlaintextKey,
  storeKey,
  updateStatusByCustomerId,
  type KeyRecord,
} from "@/lib/billing/keys";
import { sendApiKeyEmail } from "@/lib/billing/email";

export const runtime = "nodejs";

/**
 * Stripe webhook. Handles:
 * - checkout.session.completed → provisions API key, emails it to the customer.
 * - customer.subscription.updated → syncs status (active / past_due / canceled).
 * - customer.subscription.deleted → marks the key as canceled.
 *
 * Signature verification requires STRIPE_WEBHOOK_SECRET in env. Set it after
 * creating the webhook endpoint on Stripe dashboard (one-shot).
 */
export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers.get("stripe-signature");
  if (!secret || !sig) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 400 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutComplete(session);
        break;
      }
      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const status = mapStatus(sub.status);
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await updateStatusByCustomerId(customerId, status);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;
        await updateStatusByCustomerId(customerId, "canceled");
        break;
      }
      default:
        // ignore
        break;
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Handler failed";
    console.error("[stripe webhook]", message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleCheckoutComplete(
  session: Stripe.Checkout.Session
): Promise<void> {
  if (session.mode !== "subscription") return;
  const email =
    session.customer_details?.email ||
    session.customer_email ||
    undefined;
  if (!email) throw new Error("Checkout completed without an email");

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;
  if (!customerId) throw new Error("Checkout completed without a customer ID");

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id || null;

  const plan = (session.metadata?.plan === "business"
    ? "business"
    : "team") as "team" | "business";

  const plaintextKey = generatePlaintextKey();
  const record: KeyRecord = {
    email,
    customerId,
    subscriptionId,
    plan,
    status: "active",
    createdAt: Date.now(),
  };

  await storeKey(plaintextKey, record);
  await sendApiKeyEmail({ to: email, apiKey: plaintextKey, plan });
}

function mapStatus(status: Stripe.Subscription.Status): KeyRecord["status"] {
  switch (status) {
    case "active":
    case "trialing":
    case "past_due":
    case "canceled":
    case "incomplete":
      return status;
    default:
      return "incomplete";
  }
}
