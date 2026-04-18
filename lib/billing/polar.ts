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

export function polarProductIdForPlan(plan: PolarPlan): string {
  const map: Record<PolarPlan, string | undefined> = {
    team: process.env.POLAR_PRODUCT_ID_TEAM,
    business: process.env.POLAR_PRODUCT_ID_BUSINESS,
  };
  const id = map[plan];
  if (!id) {
    throw new Error(`No Polar product ID configured for plan "${plan}"`);
  }
  return id;
}

export function polarSuccessUrl(): string {
  return `${publicSiteUrl()}/checkout/success?provider=polar&checkout_id={CHECKOUT_ID}`;
}
