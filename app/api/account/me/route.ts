import { NextResponse } from "next/server";
import { lookupKey } from "@/lib/billing/keys";
import { kv } from "@/lib/billing/kv";
import type { PublishedStatement } from "@/app/api/statement/publish/route";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") || "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return NextResponse.json({ error: "Missing API key" }, { status: 401 });
  }

  const record = await lookupKey(token);
  if (!record) {
    return NextResponse.json({ error: "Invalid key" }, { status: 403 });
  }

  const redis = kv();
  let statements: Array<{
    id: string;
    url: string;
    organization_name: string;
    created_at: string;
  }> = [];

  if (redis) {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app";
    const ids = await redis
      .lrange<string>(`axle:customer:${record.customerId}:statements`, 0, 49)
      .catch(() => []);
    const entries = await Promise.all(
      ids.map(async (id) => {
        const raw = await redis
          .get<string | PublishedStatement>(`axle:statement:${id}`)
          .catch(() => null);
        if (!raw) return null;
        const parsed =
          typeof raw === "object"
            ? (raw as PublishedStatement)
            : (JSON.parse(raw as string) as PublishedStatement);
        return {
          id: parsed.id,
          url: `${site}/s/${parsed.id}`,
          organization_name: parsed.organizationName,
          created_at: new Date(parsed.createdAt).toISOString(),
        };
      })
    );
    statements = entries.filter(
      (s): s is NonNullable<typeof s> => s !== null
    );
  }

  return NextResponse.json({
    plan: record.plan,
    status: record.status,
    email: record.email,
    created_at: new Date(record.createdAt).toISOString(),
    statements,
  });
}
