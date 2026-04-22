import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "axle FAQ — accessibility compliance CI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Reference · FAQ",
    title: "axle — frequently asked questions.",
    subtitle:
      "How it differs from overlays, EAA/ADA/תקנה 35 scope, pricing, deployment, privacy.",
    footer: "axle-iota.vercel.app  ·  axe-core 4.11  ·  WCAG 2.1 / 2.2 AA",
  });
}
