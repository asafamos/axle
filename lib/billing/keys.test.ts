import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { generatePlaintextKey, liveOrTest } from "./keys";

/**
 * Billing moved from Stripe to Polar, but the key prefix still looked only at
 * STRIPE_SECRET_KEY. A real paid subscription on 2026-11-08 was issued
 * `axle_test_…`, which tells a paying customer their key is a throwaway.
 */

const ENV_KEYS = ["STRIPE_SECRET_KEY", "POLAR_ACCESS_TOKEN", "POLAR_SERVER"] as const;

// liveOrTest() only checks that a token is present and does not say "sandbox",
// so a neutral placeholder is enough. Deliberately not shaped like a vendor
// token: a lookalike made secret scanners flag the first version of this file.
const PLACEHOLDER_POLAR_TOKEN = "placeholder-not-a-credential";

beforeEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
});

afterEach(() => {
  for (const k of ENV_KEYS) delete process.env[k];
});

describe("liveOrTest", () => {
  it("is live for a production Polar token", () => {
    process.env.POLAR_ACCESS_TOKEN = PLACEHOLDER_POLAR_TOKEN;
    expect(liveOrTest()).toBe("live");
  });

  it("is test when Polar points at the sandbox", () => {
    process.env.POLAR_ACCESS_TOKEN = PLACEHOLDER_POLAR_TOKEN;
    process.env.POLAR_SERVER = "sandbox";
    expect(liveOrTest()).toBe("test");
  });

  it("is test when no billing credentials are configured", () => {
    expect(liveOrTest()).toBe("test");
  });

  it("is live for a live Stripe key even without Polar", () => {
    process.env.STRIPE_SECRET_KEY = "sk_live_123";
    expect(liveOrTest()).toBe("live");
  });

  it("ignores a Stripe test key when Polar is in production", () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_123";
    process.env.POLAR_ACCESS_TOKEN = PLACEHOLDER_POLAR_TOKEN;
    expect(liveOrTest()).toBe("live");
  });
});

describe("generatePlaintextKey", () => {
  it("prefixes with the environment and is unique", () => {
    process.env.POLAR_ACCESS_TOKEN = PLACEHOLDER_POLAR_TOKEN;
    const a = generatePlaintextKey();
    const b = generatePlaintextKey();
    expect(a).toMatch(/^axle_live_[A-Za-z0-9_-]{32}$/);
    expect(a).not.toBe(b);
  });
});
