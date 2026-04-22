import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in Austria — Barrierefreiheitsgesetz (BaFG)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "EAA · Österreich",
    title: "Barrierefreiheitsgesetz — für Entwickler:innen.",
    subtitle:
      "Sozialministeriumservice, VStG-Strafen bis €80.000, BGStG-Zivilklagen, CI-Pipeline.",
    footer: "axle-iota.vercel.app  ·  EN 301 549 · WCAG 2.1 AA  ·  28. Juni 2025",
  });
}
