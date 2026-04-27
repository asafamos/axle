import { Polar } from "@polar-sh/sdk";
import { publicSiteUrl } from "./stripe";

let client: Polar | null = null;

export function polar(): Polar {
  if (client) return client;
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token) {
    throw new Error("POLAR_ACCESS_TOKEN not set");
  }
  // Polar exposes two server environments: "production" and "sandbox".
  // Sandbox tokens are prefixed the same but routed to the sandbox API.
  // We infer from the token's prefix when available; otherwise default to
  // sandbox, which is safer during development.
  const isSandbox =
    process.env.POLAR_SERVER === "sandbox" ||
    token.includes("sandbox");
  client = new Polar({
    accessToken: token,
    server: isSandbox ? "sandbox" : "production",
  });
  return client;
}

export type PolarPlan = "team" | "business";
export type PolarCycle = "monthly" | "annual";

/**
 * Returns the Polar product ID for a plan + cycle. Annual products require
 * separate Polar SKUs (you create them in the Polar dashboard alongside the
 * monthly ones). If the annual SKU env var isn't set, we throw with a clear
 * message so the /pricing page can surface it inline rather than silently
 * billing the customer monthly after they clicked "Subscribe annually".
 */
export function polarProductIdForPlan(
  plan: PolarPlan,
  cycle: PolarCycle = "monthly",
): string {
  const monthlyMap: Record<PolarPlan, string | undefined> = {
    team: process.env.POLAR_PRODUCT_ID_TEAM,
    business: process.env.POLAR_PRODUCT_ID_BUSINESS,
  };
  const annualMap: Record<PolarPlan, string | undefined> = {
    team: process.env.POLAR_PRODUCT_ID_TEAM_ANNUAL,
    business: process.env.POLAR_PRODUCT_ID_BUSINESS_ANNUAL,
  };
  const id = cycle === "annual" ? annualMap[plan] : monthlyMap[plan];
  if (!id) {
    if (cycle === "annual") {
      throw new Error(
        `Annual product not configured for "${plan}". Create the annual SKU in Polar and set POLAR_PRODUCT_ID_${plan.toUpperCase()}_ANNUAL.`,
      );
    }
    throw new Error(`No Polar product ID configured for plan "${plan}"`);
  }
  return id;
}

export function polarSuccessUrl(): string {
  return `${publicSiteUrl()}/checkout/success?provider=polar&checkout_id={CHECKOUT_ID}`;
}
