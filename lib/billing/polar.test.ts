import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  CheckoutUnavailableError,
  polarProductIdForPlan,
  SALES_CONTACT_EMAIL,
} from "./polar";

/**
 * /pricing advertises an annual cycle with concrete savings, but the annual
 * Polar SKUs were never created. Clicking "Subscribe annually" therefore threw,
 * and the pricing page rendered the thrown message verbatim — so a visitor on
 * the one screen where we ask to be paid was told to
 * "set POLAR_PRODUCT_ID_TEAM_ANNUAL".
 *
 * These lock in the two things that matter: an unsellable plan is refused
 * rather than silently downgraded to monthly, and nothing we show the customer
 * leaks internal configuration.
 */

const ENV_KEYS = [
  "POLAR_PRODUCT_ID_TEAM",
  "POLAR_PRODUCT_ID_BUSINESS",
  "POLAR_PRODUCT_ID_TEAM_ANNUAL",
  "POLAR_PRODUCT_ID_BUSINESS_ANNUAL",
] as const;

beforeEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
  process.env.POLAR_PRODUCT_ID_TEAM = "prod_team_monthly";
  process.env.POLAR_PRODUCT_ID_BUSINESS = "prod_business_monthly";
});

afterEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
});

describe("polarProductIdForPlan", () => {
  it("returns the monthly SKU when one is configured", () => {
    expect(polarProductIdForPlan("team", "monthly")).toBe("prod_team_monthly");
    expect(polarProductIdForPlan("business", "monthly")).toBe("prod_business_monthly");
  });

  it("returns the annual SKU once it is configured", () => {
    process.env.POLAR_PRODUCT_ID_TEAM_ANNUAL = "prod_team_annual";
    expect(polarProductIdForPlan("team", "annual")).toBe("prod_team_annual");
  });

  describe("when the annual SKU is missing", () => {
    it("refuses rather than quietly falling back to the monthly price", () => {
      // The customer clicked "Subscribe annually". Billing them the monthly
      // SKU would be charging them for something they did not agree to.
      expect(() => polarProductIdForPlan("team", "annual")).toThrow(
        CheckoutUnavailableError,
      );
      expect(() => polarProductIdForPlan("team", "annual")).not.toThrow(
        /prod_team_monthly/,
      );
    });

    it.each(["team", "business"] as const)(
      "keeps internal configuration out of what the %s customer sees",
      (plan) => {
        try {
          polarProductIdForPlan(plan, "annual");
          throw new Error("expected polarProductIdForPlan to throw");
        } catch (err) {
          expect(err).toBeInstanceOf(CheckoutUnavailableError);
          const { customerMessage, message } = err as CheckoutUnavailableError;

          // What the browser may render: no env vars, no vendor internals.
          expect(customerMessage).not.toMatch(/POLAR_PRODUCT_ID/);
          expect(customerMessage).not.toMatch(/env|SKU|Polar/i);
          expect(customerMessage).toContain(SALES_CONTACT_EMAIL);

          // What the log gets: the exact variable to set.
          expect(message).toContain(`POLAR_PRODUCT_ID_${plan.toUpperCase()}_ANNUAL`);
        }
      },
    );
  });

  it("also shields the customer when a monthly SKU is missing", () => {
    delete process.env.POLAR_PRODUCT_ID_BUSINESS;
    try {
      polarProductIdForPlan("business", "monthly");
      throw new Error("expected polarProductIdForPlan to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(CheckoutUnavailableError);
      const { customerMessage } = err as CheckoutUnavailableError;
      expect(customerMessage).not.toMatch(/POLAR_PRODUCT_ID/);
      expect(customerMessage).toContain(SALES_CONTACT_EMAIL);
    }
  });
});
