import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in the Netherlands — Implementatiewet toegankelijkheid";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "EAA · Nederland",
    title: "Implementatiewet toegankelijkheid — voor developers.",
    subtitle:
      "ACM-handhaving, boetes tot €900.000, toegankelijkheidsverklaring en CI-pipeline.",
    footer: "axle-iota.vercel.app  ·  EN 301 549 · WCAG 2.1 AA  ·  28 juni 2025",
  });
}
