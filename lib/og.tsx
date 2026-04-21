import { ImageResponse } from "next/og";

/**
 * Shared OG-image generator for axle's SEO guide pages. Takes a badge
 * (country / stack name), a main title, and an optional subtitle. All
 * per-page opengraph-image.tsx files thin-wrap this helper so the brand
 * treatment stays identical across the site.
 */
export function renderGuideOg(args: {
  badge: string;
  title: string;
  subtitle?: string;
  footer?: string;
}): ImageResponse {
  const { badge, title, subtitle, footer } = args;
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
            {badge}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1020,
            }}
          >
            {title}
          </div>
          {subtitle ? (
            <div
              style={{
                marginTop: 24,
                fontSize: 28,
                color: "#cbd5e1",
                maxWidth: 900,
              }}
            >
              {subtitle}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "flex",
            gap: 24,
            fontSize: 22,
            color: "#94a3b8",
          }}
        >
          {(footer ?? "axle-iota.vercel.app  ·  WCAG 2.1 / 2.2 AA  ·  EAA 2025").split("  ·  ").flatMap((part, i, arr) =>
            i < arr.length - 1
              ? [<div key={i}>{part}</div>, <div key={`sep-${i}`}>·</div>]
              : [<div key={i}>{part}</div>]
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
