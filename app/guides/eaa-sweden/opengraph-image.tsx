import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in Sweden — Tillgänglighetslagen";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "EAA · Sverige",
    title: "Tillgänglighetslagen — för utvecklare.",
    subtitle:
      "DIGG-tillsyn, sanktionsavgift upp till 10 MSEK, tillgänglighetsredogörelse, CI-pipeline.",
    footer: "axle-iota.vercel.app  ·  EN 301 549 · WCAG 2.1 AA  ·  28 juni 2025",
  });
}
