import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in Ireland — S.I. 636/2023 for developers";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Ireland · S.I. 636/2023",
    title: "EAA in Ireland — the practical guide.",
    subtitle:
      "Fines up to €60,000. Director liability. Enforced 28 June 2025. NDA coordinates, CCPC + sector regulators enforce.",
    footer: "axle-iota.vercel.app  ·  EN 301 549  ·  WCAG 2.1 AA",
  });
}
