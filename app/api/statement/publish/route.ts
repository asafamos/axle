import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { kv } from "@/lib/billing/kv";
import { lookupKey, hashKey } from "@/lib/billing/keys";
import type { StatementInput } from "@/lib/statement/hebrew-template";

export const runtime = "nodejs";

export type PublishedStatement = {
  id: string;
  createdAt: number;
  organizationName: string;
  customerKeyHash: string;
  plan: "team" | "business";
  input: StatementInput;
};

function newId(): string {
  // URL-safe 10-char ID. At 10 chars, ~60 bits of entropy — collision-free
  // within any realistic published-statement volume.
  return randomBytes(8).toString("base64url").slice(0, 10);
}

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return NextResponse.json(
      { error: "Missing API key. Add 'Authorization: Bearer <axle key>'." },
      { status: 401 }
    );
  }

  const record = await lookupKey(token);
  if (!record || record.status !== "active") {
    return NextResponse.json(
      { error: "Invalid or inactive API key. Get one at /#pricing." },
      { status: 403 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    input?: StatementInput;
  } | null;
  if (!body?.input || typeof body.input !== "object") {
    return NextResponse.json(
      { error: "Body must be { input: StatementInput }" },
      { status: 400 }
    );
  }
  const input = body.input;
  if (!input.organisationName || !input.websiteUrl) {
    return NextResponse.json(
      { error: "organisationName and websiteUrl are required" },
      { status: 400 }
    );
  }

  const redis = kv();
  if (!redis) {
    return NextResponse.json(
      { error: "Storage unavailable" },
      { status: 503 }
    );
  }

  const id = newId();
  const published: PublishedStatement = {
    id,
    createdAt: Date.now(),
    organizationName: input.organisationName,
    customerKeyHash: hashKey(token),
    plan: record.plan,
    input,
  };

  await redis.set(`axle:statement:${id}`, JSON.stringify(published));
  // Index by customer so /account can list their publications.
  await redis.lpush(`axle:customer:${record.customerId}:statements`, id);

  const site =
    process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app";
  return NextResponse.json({
    id,
    url: `${site}/s/${id}`,
    created_at: new Date(published.createdAt).toISOString(),
  });
}
