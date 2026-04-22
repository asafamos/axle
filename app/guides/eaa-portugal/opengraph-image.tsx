import { renderGuideOg } from "@/lib/og";

export const runtime = "edge";
export const alt = "EAA in Portugal — Decreto-Lei 82/2022";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return renderGuideOg({
    badge: "EAA · Portugal",
    title: "Decreto-Lei 82/2022 — para developers.",
    subtitle:
      "AMA / ASAE, contraordenações até €44.891, declaração de acessibilidade, CI pipeline.",
    footer: "axle-iota.vercel.app  ·  EN 301 549 · WCAG 2.1 AA  ·  28 junho 2025",
  });
}
