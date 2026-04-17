import { NextResponse } from "next/server";
import { generateFix } from "@/lib/fixer";
import type { AxeViolation } from "@/lib/scanner";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      violation?: AxeViolation;
      nodeIndex?: number;
    };

    if (!body?.violation) {
      return NextResponse.json(
        { error: "violation is required" },
        { status: 400 }
      );
    }

    const nodeIndex = body.nodeIndex ?? 0;
    const fix = await generateFix(body.violation, nodeIndex);
    return NextResponse.json(fix);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error during fix";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
