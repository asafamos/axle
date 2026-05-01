import { ImageResponse } from "next/og";
import { kv } from "@/lib/billing/kv";

export const runtime = "nodejs";
export const alt = "axle accessibility scan result";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Stored = {
  url?: string;
  scanned_at?: string;
  summary?: {
    violations?: number;
    critical?: number;
    serious?: number;
    moderate?: number;
    minor?: number;
  } | null;
};

async function getStored(id: string): Promise<Stored | null> {
  const redis = kv();
  if (!redis) return null;
  const raw = await redis.get<string | Stored>(`axle:result:${id}`);
  if (!raw) return null;
  if (typeof raw === "object") return raw as Stored;
  try {
    return JSON.parse(raw) as Stored;
  } catch {
    return null;
  }
}

export default async function ResultOg({
  params,
}: {
  params: { id: string };
}) {
  const stored = await getStored(params.id);
  let host = "Unknown URL";
  let total = 0;
  let critical = 0;
  let serious = 0;
  let moderate = 0;
  let minor = 0;
  let dateLine = "";
  if (stored) {
    try {
      host = stored.url ? new URL(stored.url).hostname : "Unknown URL";
    } catch {
      host = stored.url || "Unknown URL";
    }
    total = stored.summary?.violations ?? 0;
    critical = stored.summary?.critical ?? 0;
    serious = stored.summary?.serious ?? 0;
    moderate = stored.summary?.moderate ?? 0;
    minor = stored.summary?.minor ?? 0;
    dateLine = stored.scanned_at
      ? new Date(stored.scanned_at).toISOString().slice(0, 10)
      : "";
  }

  const passing = critical + serious === 0;
  const headline = passing
    ? "Passing"
    : critical > 0
      ? `${critical} critical`
      : `${serious} serious`;
  const headlineColour = passing ? "#10b981" : critical > 0 ? "#e11d48" : "#f59e0b";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          padding: 64,
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 12,
              background: "#fff",
              color: "#0f172a",
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            a
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
            axle
          </div>
          <div
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              borderRadius: 999,
              background: headlineColour,
              color: passing ? "#052e1d" : "#fff",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {headline}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 24,
              color: "#94a3b8",
              fontFamily: "monospace",
            }}
          >
            WCAG 2.2 AA accessibility scan
          </div>
          <div
            style={{
              marginTop: 12,
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              wordBreak: "break-all",
              maxWidth: 1080,
            }}
          >
            {host}
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 28,
              color: passing ? "#10b981" : "#cbd5e1",
            }}
          >
            {passing
              ? "No critical or serious automated violations"
              : `${total} total · ${critical} critical · ${serious} serious · ${moderate} moderate · ${minor} minor`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 20,
            color: "#94a3b8",
          }}
        >
          <div>axle-iota.vercel.app</div>
          <div>·</div>
          <div>axe-core 4.11</div>
          {dateLine ? (
            <>
              <div>·</div>
              <div>{dateLine}</div>
            </>
          ) : null}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
