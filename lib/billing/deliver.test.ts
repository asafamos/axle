import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { KeyRecord } from "./keys";

/**
 * These cover the failure mode that shipped to production: a paid checkout whose
 * welcome e-mail could not be sent, redelivered by Stripe/Polar, minting a fresh
 * API key on every attempt. The invariants worth protecting are that a customer
 * ends up with exactly one key, and that the webhook only asks for a retry when
 * a retry could actually succeed.
 */

const kv = new Map<string, string>();

vi.mock("./keys", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./keys")>();
  return {
    ...actual,
    storeKey: vi.fn(async (plaintext: string, record: KeyRecord) => {
      kv.set(`delivery:${record.customerId}`, plaintext);
      kv.set(`key:${actual.hashKey(plaintext)}`, JSON.stringify(record));
    }),
    lookupDeliveryKey: vi.fn(async (customerId: string) => kv.get(`delivery:${customerId}`) ?? null),
  };
});

vi.mock("./email", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./email")>();
  return {
    ...actual,
    sendApiKeyEmail: vi.fn(async () => {}),
    sendKeyDeliveryFailureAlert: vi.fn(async () => {}),
  };
});

const { deliverKey } = await import("./deliver");
const { storeKey } = await import("./keys");
const { EmailSendError, sendApiKeyEmail, sendKeyDeliveryFailureAlert } = await import("./email");

const record: KeyRecord = {
  email: "buyer@example.com",
  customerId: "cus_test_1",
  subscriptionId: "sub_test_1",
  plan: "team",
  status: "active",
  createdAt: 1_700_000_000_000,
};

/** Every distinct plaintext key ever persisted for this customer. */
function keysMintedFor(customerId: string): Set<string> {
  const minted = new Set<string>();
  for (const call of vi.mocked(storeKey).mock.calls) {
    if (call[1].customerId === customerId) minted.add(call[0]);
  }
  return minted;
}

beforeEach(() => {
  kv.clear();
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
  process.env.RESEND_API_KEY = "re_test";
  process.env.RESEND_FROM = "axle <hello@verified.example>";
});

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_FROM;
});

describe("deliverKey", () => {
  it("sends the key and reports delivery on the happy path", async () => {
    const result = await deliverKey(record);

    expect(result.delivered).toBe(true);
    expect(result.key).toMatch(/^axle_(live|test)_/);
    expect(sendApiKeyEmail).toHaveBeenCalledOnce();
    expect(vi.mocked(sendApiKeyEmail).mock.calls[0][0]).toMatchObject({
      to: "buyer@example.com",
      apiKey: result.key,
      plan: "team",
    });
  });

  describe("when e-mail is misconfigured (RESEND_FROM unset)", () => {
    beforeEach(() => {
      delete process.env.RESEND_FROM;
    });

    it("does not throw, so the webhook returns 200 and the provider stops retrying", async () => {
      await expect(deliverKey(record)).resolves.toMatchObject({ delivered: false });
      expect(sendApiKeyEmail).not.toHaveBeenCalled();
    });

    it("escalates to a human with the key that the customer never received", async () => {
      const result = await deliverKey(record);

      expect(sendKeyDeliveryFailureAlert).toHaveBeenCalledOnce();
      expect(vi.mocked(sendKeyDeliveryFailureAlert).mock.calls[0][0]).toMatchObject({
        email: "buyer@example.com",
        customerId: "cus_test_1",
        apiKey: result.key,
      });
      expect(result.reason).toContain("RESEND_FROM");
    });

    it("mints exactly one key no matter how many times the webhook is redelivered", async () => {
      const first = await deliverKey(record);
      const second = await deliverKey(record);
      const third = await deliverKey(record);

      expect(second.key).toBe(first.key);
      expect(third.key).toBe(first.key);
      expect(keysMintedFor("cus_test_1").size).toBe(1);
    });
  });

  describe("when the send fails transiently", () => {
    beforeEach(() => {
      vi.mocked(sendApiKeyEmail).mockRejectedValue(
        new EmailSendError("Resend 503", false),
      );
    });

    it("rethrows so the provider redelivers the webhook", async () => {
      await expect(deliverKey(record)).rejects.toThrow("Resend 503");
    });

    it("reuses the same key across the whole retry storm", async () => {
      for (let i = 0; i < 5; i++) {
        await expect(deliverKey(record)).rejects.toThrow();
      }

      expect(keysMintedFor("cus_test_1").size).toBe(1);
    });

    it("still hands the key to a human on the way out", async () => {
      await expect(deliverKey(record)).rejects.toThrow();
      expect(sendKeyDeliveryFailureAlert).toHaveBeenCalledOnce();
    });
  });

  describe("when the send fails permanently (e.g. unverified sending domain)", () => {
    beforeEach(() => {
      vi.mocked(sendApiKeyEmail).mockRejectedValue(
        new EmailSendError("domain not verified", true),
      );
    });

    it("does not throw — retrying an unverified domain never succeeds", async () => {
      await expect(deliverKey(record)).resolves.toMatchObject({
        delivered: false,
        reason: expect.stringContaining("domain not verified"),
      });
    });

    it("escalates instead of retrying", async () => {
      await deliverKey(record);
      expect(sendKeyDeliveryFailureAlert).toHaveBeenCalledOnce();
    });
  });

  it("keeps a key already minted for the customer rather than issuing a second one", async () => {
    kv.set("delivery:cus_test_1", "axle_test_previously_issued");

    const result = await deliverKey(record);

    expect(result.key).toBe("axle_test_previously_issued");
    expect(keysMintedFor("cus_test_1")).toEqual(new Set(["axle_test_previously_issued"]));
  });
});
