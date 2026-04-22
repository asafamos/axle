import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in Poland — Ustawa o dostępności";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "EAA · Polska",
    title: "Ustawa o dostępności — dla developerów.",
    subtitle:
      "UOKiK, kary do 10% obrotu, deklaracja dostępności, CI pipeline.",
    footer: "axle-iota.vercel.app  ·  EN 301 549 · WCAG 2.1 AA  ·  28 czerwca 2025",
  });
}
