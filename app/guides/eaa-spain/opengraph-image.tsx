import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA en España — Ley 11/2023 para desarrolladores";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "España · Ley 11/2023",
    title: "EAA en España — guía para desarrolladores.",
    subtitle:
      "Sanciones hasta 1.000.000 € · UNE-EN 301 549 · Observatorio de Accesibilidad Web",
    footer: "axle-iota.vercel.app  ·  WCAG 2.1 AA  ·  EN 301 549",
  });
}
