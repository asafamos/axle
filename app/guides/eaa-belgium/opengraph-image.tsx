import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in Belgium — Loi / Wet 28 novembre 2022";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "EAA · Belgique / België",
    title: "EAA in Belgium — the 28 November 2022 law.",
    subtitle:
      "SPF Économie / FOD Economie enforcement, €80k fines, FR/NL/DE statements, CI pipeline.",
    footer: "axle-iota.vercel.app  ·  EN 301 549 · WCAG 2.1 AA  ·  28 June 2025",
  });
}
