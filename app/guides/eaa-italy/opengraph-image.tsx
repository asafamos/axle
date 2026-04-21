import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "Legge Stanca + EAA 2025 — guida per sviluppatori in Italia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Italia · Legge Stanca",
    title: "Legge Stanca + EAA 2025 per sviluppatori.",
    subtitle:
      "D.lgs. 82/2022 · Sanzioni fino al 5% del fatturato · Monitoraggio AgID",
    footer: "axle-iota.vercel.app  ·  EN 301 549  ·  WCAG 2.1 AA  ·  AgID",
  });
}
