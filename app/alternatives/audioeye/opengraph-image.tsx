import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "axle vs AudioEye — source-first accessibility CI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "Compare · vs AudioEye",
    title: "axle vs AudioEye — source-first, not hybrid overlay.",
    subtitle:
      "Same WCAG coverage, zero runtime script, $49/mo instead of enterprise pricing.",
    footer: "axle-iota.vercel.app  ·  CI-time scan  ·  EAA 2025 ready",
  });
}
