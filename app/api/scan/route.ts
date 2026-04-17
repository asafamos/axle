import { NextResponse } from "next/server";
import { scanUrl } from "@/lib/scanner";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const url = String(body?.url || "").trim();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const normalized = /^https?:\/\//i.test(url) ? url : `https://${url}`;

    try {
      new URL(normalized);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    const result = await scanUrl(normalized);
    return NextResponse.json(result);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during scan";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
