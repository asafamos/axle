import { NextResponse } from "next/server";
import { stripe, priceIdForPlan, publicSiteUrl, type Plan } from "@/lib/billing/stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      plan?: Plan;
      email?: string;
    };
    const plan: Plan = body.plan === "business" ? "business" : "team";
    const priceId = priceIdForPlan(plan);
    const site = publicSiteUrl();

    const session = await stripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      customer_email: body.email || undefined,
      subscription_data: {
        metadata: { plan },
      },
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
