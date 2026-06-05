/**
 * Internal traffic detection — shared between the admin dashboard (which
 * splits "real human" from "founder self-test / prod health probe") and the
 * lead-capture routes (which only notify the founder for *genuinely external*
 * leads). Keep this logic in one place so the two never drift apart.
 *
 *   ADMIN_INTERNAL_EMAILS   comma-separated exact-match list, e.g.
 *                           "asaf@paprikadjs.com,oncall@axle.dev"
 *   ADMIN_INTERNAL_PATTERNS comma-separated glob-style fragments matched as
 *                           substrings, e.g. "@axle-test.local", "verify".
 *
 * Defaults cover the cases already seen in prod KV; the env vars are additive
 * (they don't override the defaults).
 */
export const DEFAULT_INTERNAL_EMAILS = new Set<string>([
  "asaf@paprikadjs.com",
  "asaf@amoss.co.il",
]);

export const DEFAULT_INTERNAL_PATTERNS = [
  "@axle-test.local",
  "verify-prod-check",
  "test+verify", // founder plus-addressed verify self-tests, e.g. test+verify-2026-05-24@gmail.com
  "@example.com",
  "@example.org",
];

export type InternalConfig = { emails: Set<string>; patterns: string[] };

export function loadInternalConfig(): InternalConfig {
  const emails = new Set(DEFAULT_INTERNAL_EMAILS);
  const patterns = [...DEFAULT_INTERNAL_PATTERNS];

  const extraEmails = process.env.ADMIN_INTERNAL_EMAILS || "";
  for (const e of extraEmails.split(",")) {
    const trimmed = e.trim().toLowerCase();
    if (trimmed) emails.add(trimmed);
  }
  const extraPatterns = process.env.ADMIN_INTERNAL_PATTERNS || "";
  for (const p of extraPatterns.split(",")) {
    const trimmed = p.trim().toLowerCase();
    if (trimmed) patterns.push(trimmed);
  }
  return { emails, patterns };
}

export function isInternalEmail(email: string, cfg?: InternalConfig): boolean {
  const resolved = cfg ?? loadInternalConfig();
  const e = (email || "").toLowerCase();
  if (!e) return true; // empty email = test / synthetic
  if (resolved.emails.has(e)) return true;
  for (const p of resolved.patterns) {
    if (e.includes(p)) return true;
  }
  return false;
}
