import { NextResponse } from "next/server";
import {
  polar,
  polarProductIdForPlan,
  polarSuccessUrl,
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

    // Throws with a clear message if the annual SKU isn't configured. The
    // /pricing client catches the error and surfaces it inline so the user
    // knows to wait / contact us instead of being silently billed monthly
    // after clicking annual.
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
    console.error("[polar checkout]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
