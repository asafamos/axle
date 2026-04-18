import Stripe from "stripe";

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (client) return client;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY not set");
  }
  client = new Stripe(key);
  return client;
}

export type Plan = "team" | "business";

export function priceIdForPlan(plan: Plan): string {
  const map: Record<Plan, string | undefined> = {
    team: process.env.STRIPE_PRICE_ID_TEAM,
    business: process.env.STRIPE_PRICE_ID_BUSINESS,
  };
  const id = map[plan];
  if (!id) {
    throw new Error(`No price ID configured for plan "${plan}"`);
  }
  return id;
}

export function publicSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"
  );
}
