import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in Denmark — Lov om tilgængelighed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "EAA · Danmark",
    title: "Lov om tilgængelighed — til udviklere.",
    subtitle:
      "Digitaliseringsstyrelsen + Forbrugerombudsmanden, Ligebehandlingsnævnet, tilgængelighedserklæring, CI pipeline.",
    footer: "axle-iota.vercel.app  ·  EN 301 549 · WCAG 2.1 AA  ·  28. juni 2025",
  });
}
