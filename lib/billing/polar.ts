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

/** Where a customer should turn when they cannot complete a purchase. */
export const SALES_CONTACT_EMAIL = "asaf@amoss.co.il";

/**
 * A plan the customer asked for that we cannot sell them right now.
 *
 * Carries two messages on purpose. `message` is for our logs and names the
 * exact env var to set; `customerMessage` is what may be shown in the browser.
 * They are separate because the previous single-message version was rendered
 * straight into the pricing page, so a visitor clicking "Subscribe annually"
 * was told to "set POLAR_PRODUCT_ID_TEAM_ANNUAL" — an internal instruction they
 * can do nothing with, on the one screen where we are asking to be paid.
 */
export class CheckoutUnavailableError extends Error {
  readonly customerMessage: string;
  constructor(message: string, customerMessage: string) {
    super(message);
    this.name = "CheckoutUnavailableError";
    this.customerMessage = customerMessage;
  }
}

/**
 * Returns the Polar product ID for a plan + cycle. Annual products require
 * separate Polar SKUs (you create them in the Polar dashboard alongside the
 * monthly ones). If the annual SKU env var isn't set, we throw so the customer
 * is told we cannot take the order, rather than being silently billed monthly
 * after they clicked "Subscribe annually".
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
      throw new CheckoutUnavailableError(
        `Annual product not configured for "${plan}". Create the annual SKU in Polar and set POLAR_PRODUCT_ID_${plan.toUpperCase()}_ANNUAL.`,
        `Annual billing isn't available to buy online yet — but we can still set it up for you. Email ${SALES_CONTACT_EMAIL} and we'll get you started, or switch to monthly to subscribe right now.`,
      );
    }
    throw new CheckoutUnavailableError(
      `No Polar product ID configured for plan "${plan}"`,
      `We couldn't start checkout for the ${plan} plan. Email ${SALES_CONTACT_EMAIL} and we'll sort it out straight away.`,
    );
  }
  return id;
}

export function polarSuccessUrl(): string {
  return `${publicSiteUrl()}/checkout/success?provider=polar&checkout_id={CHECKOUT_ID}`;
}
