import { NextResponse } from "next/server";
import {
  polar,
  polarProductIdForPlan,
  polarSuccessUrl,
  type PolarPlan,
} from "@/lib/billing/polar";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as {
      plan?: PolarPlan;
      email?: string;
    };
    const plan: PolarPlan = body.plan === "business" ? "business" : "team";
    const productId = polarProductIdForPlan(plan);

    const checkout = await polar().checkouts.create({
      products: [productId],
      successUrl: polarSuccessUrl(),
      customerEmail: body.email || undefined,
      metadata: { plan },
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[polar checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
