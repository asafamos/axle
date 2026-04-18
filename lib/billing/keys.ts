import { createHash, randomBytes } from "node:crypto";
import { kv } from "./kv";

/**
 * Axle API key format: `axle_<env>_<base64url>`. The plaintext is shown to
 * the user once (via email after checkout). We store only the sha256 hash
 * keyed under `axle:key:<hash>`, so a leaked KV never exposes raw keys.
 */

export type KeyRecord = {
  email: string;
  customerId: string;
  subscriptionId: string | null;
  plan: "team" | "business";
  status: "active" | "past_due" | "canceled" | "trialing" | "incomplete";
  createdAt: number;
};

function liveOrTest(): "live" | "test" {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_")
    ? "live"
    : "test";
}

export function generatePlaintextKey(): string {
  const random = randomBytes(24).toString("base64url");
  return `axle_${liveOrTest()}_${random}`;
}

export function hashKey(plaintext: string): string {
  return createHash("sha256").update(plaintext).digest("hex");
}

export async function storeKey(
  plaintext: string,
  record: KeyRecord
): Promise<void> {
  const redis = kv();
  if (!redis) throw new Error("KV not configured");
  const hash = hashKey(plaintext);
  await redis.set(`axle:key:${hash}`, JSON.stringify(record));
  await redis.set(
    `axle:customer:${record.customerId}`,
    JSON.stringify({ hash, plan: record.plan, status: record.status })
  );
}

export async function lookupKey(plaintext: string): Promise<KeyRecord | null> {
  const redis = kv();
  if (!redis) return null;
  const hash = hashKey(plaintext);
  const raw = await redis.get<string>(`axle:key:${hash}`);
  if (!raw) return null;
  // Upstash JSON-decodes by default when the value looks like JSON.
  if (typeof raw === "object") return raw as unknown as KeyRecord;
  try {
    return JSON.parse(raw) as KeyRecord;
  } catch {
    return null;
  }
}

export async function updateStatusByCustomerId(
  customerId: string,
  status: KeyRecord["status"]
): Promise<void> {
  const redis = kv();
  if (!redis) return;
  const customerRaw = await redis.get<string | { hash: string; plan: string; status: string }>(
    `axle:customer:${customerId}`
  );
  if (!customerRaw) return;
  const parsed =
    typeof customerRaw === "object"
      ? customerRaw
      : JSON.parse(customerRaw as string);
  const keyRaw = await redis.get<string | KeyRecord>(`axle:key:${parsed.hash}`);
  if (!keyRaw) return;
  const record: KeyRecord =
    typeof keyRaw === "object"
      ? (keyRaw as KeyRecord)
      : (JSON.parse(keyRaw as string) as KeyRecord);
  record.status = status;
  await redis.set(`axle:key:${parsed.hash}`, JSON.stringify(record));
  await redis.set(
    `axle:customer:${customerId}`,
    JSON.stringify({ hash: parsed.hash, plan: record.plan, status })
  );
}

const FREE_LIMIT_PER_DAY = 3;

/** Returns the number of remaining free fixes for this IP today. */
export async function consumeFreeFix(ip: string): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const redis = kv();
  if (!redis) {
    // Fail-open when KV is down — better than locking out users.
    return { allowed: true, remaining: FREE_LIMIT_PER_DAY, limit: FREE_LIMIT_PER_DAY };
  }
  const day = new Date().toISOString().slice(0, 10);
  const key = `axle:freefix:${day}:${ip}`;
  const count = await redis.incr(key);
  if (count === 1) {
    // Expire at end of day UTC (+1s buffer)
    await redis.expire(key, 86401);
  }
  const remaining = Math.max(0, FREE_LIMIT_PER_DAY - count);
  return {
    allowed: count <= FREE_LIMIT_PER_DAY,
    remaining,
    limit: FREE_LIMIT_PER_DAY,
  };
}
