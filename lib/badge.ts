/**
 * Minimal dependency-free SVG badge generator (shields.io visual style).
 * Used both for our own-brand compliance badges and for a
 * shields.io-compatible endpoint that any consumer can embed.
 */

export type BadgeInput = {
  label: string;
  message: string;
  color: BadgeColor;
  labelColor?: string;
};

export type BadgeColor =
  | "brightgreen"
  | "green"
  | "yellow"
  | "orange"
  | "red"
  | "lightgrey"
  | "blue";

const PALETTE: Record<BadgeColor, string> = {
  brightgreen: "#4c1",
  green: "#97ca00",
  yellow: "#dfb317",
  orange: "#fe7d37",
  red: "#e05d44",
  lightgrey: "#9f9f9f",
  blue: "#007ec6",
};

// Approximate character-width table in 110-unit shields.io units.
// Good enough for ASCII + common Latin characters.
const CHAR_WIDTH = 6;

function textWidth(s: string): number {
  return Math.max(20, s.length * CHAR_WIDTH + 10);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function renderBadgeSvg(input: BadgeInput): string {
  const label = escapeXml(input.label);
  const message = escapeXml(input.message);
  const labelColor = input.labelColor ?? "#555";
  const msgColor = PALETTE[input.color] ?? PALETTE.lightgrey;
  const lw = textWidth(label);
  const mw = textWidth(message);
  const total = lw + mw;
  const labelX = lw / 2;
  const msgX = lw + mw / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="20" role="img" aria-label="${label}: ${message}">
  <title>${label}: ${message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${total}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${lw}" height="20" fill="${labelColor}"/>
    <rect x="${lw}" width="${mw}" height="20" fill="${msgColor}"/>
    <rect width="${total}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${labelX}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelX}" y="14">${label}</text>
    <text aria-hidden="true" x="${msgX}" y="15" fill="#010101" fill-opacity=".3">${message}</text>
    <text x="${msgX}" y="14">${message}</text>
  </g>
</svg>`;
}

export type ComplianceStatus =
  | "passing"
  | "issues"
  | "failing"
  | "pending"
  | "unknown";

export function statusToBadge(
  status: ComplianceStatus,
  standard: string = "WCAG 2.1 AA"
): BadgeInput {
  switch (status) {
    case "passing":
      return { label: standard, message: "passing", color: "brightgreen" };
    case "issues":
      return { label: standard, message: "issues", color: "yellow" };
    case "failing":
      return { label: standard, message: "failing", color: "red" };
    case "pending":
      return { label: standard, message: "pending scan", color: "blue" };
    default:
      return { label: standard, message: "unknown", color: "lightgrey" };
  }
}

/** shields.io endpoint-badge response shape. */
export type EndpointResponse = {
  schemaVersion: 1;
  label: string;
  message: string;
  color: string;
  namedLogo?: string;
  logoSvg?: string;
};

export function statusToEndpoint(
  status: ComplianceStatus,
  standard: string = "WCAG 2.1 AA"
): EndpointResponse {
  const b = statusToBadge(status, standard);
  return {
    schemaVersion: 1,
    label: b.label,
    message: b.message,
    color: b.color,
  };
}
