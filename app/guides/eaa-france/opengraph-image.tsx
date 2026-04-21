import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "RGAA + EAA — guide pour développeurs en France";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "France · RGAA 4.1",
    title: "RGAA + EAA pour développeurs.",
    subtitle:
      "Loi 11-2023 · Sanctions 25 000 € · Référentiel Général d'Amélioration de l'Accessibilité 4.1.2",
    footer: "axle-iota.vercel.app  ·  WCAG 2.1 AA  ·  DINUM  ·  Défenseur des droits",
  });
}
