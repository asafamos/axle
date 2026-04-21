import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "Why accessibility overlay widgets don't work";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "The evidence · Apr 2026",
    title: "Why accessibility overlay widgets don't work.",
    subtitle:
      "FTC $1M settlement. Princeton study. Regulators scan served HTML, not runtime overlays.",
    footer: "axle-iota.vercel.app  ·  Real fixes, not widgets  ·  EAA 2025 ready",
  });
}
