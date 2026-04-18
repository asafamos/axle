import { Redis } from "@upstash/redis";

// Lazily constructed so that missing env vars don't crash on import.
// Returns null when Upstash isn't configured — callers must handle that
// (typically by falling back to a fail-open or fail-closed mode).
let client: Redis | null = null;
let attempted = false;

export function kv(): Redis | null {
  if (attempted) return client;
  attempted = true;
  // Vercel's Upstash integration exposes these as KV_REST_API_*; a
  // hand-rolled Upstash setup uses UPSTASH_REDIS_REST_*. Try both.
  const url =
    process.env.KV_REST_API_URL ||
    process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ||
    process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  client = new Redis({ url, token });
  return client;
}
