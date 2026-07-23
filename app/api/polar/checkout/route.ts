import { NextResponse } from "next/server";
import {
  CheckoutUnavailableError,
  polar,
  polarProductIdForPlan,
  polarSuccessUrl,
  SALES_CONTACT_EMAIL,
  type PolarPlan,
  type PolarCycle,
} from "@/lib/billing/polar";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      plan?: PolarPlan;
      cycle?: PolarCycle;
      email?: string;
    };
    const plan: PolarPlan = body.plan === "business" ? "business" : "team";
    const cycle: PolarCycle = body.cycle === "annual" ? "annual" : "monthly";

    // Throws CheckoutUnavailableError if the SKU for this plan+cycle isn't
    // configured, so the customer is told we cannot take the order instead of
    // being silently billed monthly after clicking annual.
    const productId = polarProductIdForPlan(plan, cycle);

    const checkout = await polar().checkouts.create({
      products: [productId],
      successUrl: polarSuccessUrl(),
      customerEmail: body.email || undefined,
      metadata: { plan, cycle },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Always log the internal detail — it names the exact env var to set.
    console.error("[polar checkout]", message);

    if (err instanceof CheckoutUnavailableError) {
      // A plan we simply cannot sell yet. 503, not 500: nothing is broken,
      // it just isn't set up, and the customer gets a way to reach a human.
      return NextResponse.json(
        { error: err.customerMessage, contact: SALES_CONTACT_EMAIL },
        { status: 503 },
      );
    }

    // Anything else is a genuine fault. Never echo the raw message to the
    // browser — it has previously carried internal configuration details.
    return NextResponse.json(
      {
        error: `Something went wrong starting checkout. Please try again, or email ${SALES_CONTACT_EMAIL} and we'll help.`,
        contact: SALES_CONTACT_EMAIL,
      },
      { status: 500 },
    );
  }
}
