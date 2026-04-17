import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "axle — Accessibility compliance CI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
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
              width: 64,
              height: 64,
              borderRadius: 12,
              background: "#fff",
              color: "#0f172a",
              fontSize: 40,
              fontWeight: 900,
            }}
          >
            a
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>
            axle
          </div>
          <div
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              borderRadius: 999,
              background: "#10b981",
              color: "#052e1d",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            EAA 2025 ready
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            Ship accessible code.
          </div>
          <div
            style={{
              fontSize: 80,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              background: "linear-gradient(90deg, #fff 0%, #94a3b8 100%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Automatically.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 28,
              color: "#cbd5e1",
              maxWidth: 900,
            }}
          >
            Scan every PR for WCAG 2.1 / 2.2 AA. Real code fixes, not widgets. Lawyer-ready artifacts included.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          <div>GitHub Action</div>
          <div>·</div>
          <div>Netlify / Vercel / Cloudflare</div>
          <div>·</div>
          <div>Hebrew statement generator</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
