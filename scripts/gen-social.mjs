import sharp from "sharp";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="1280" height="640" fill="url(#bg)"/>
  <!-- logo square -->
  <rect x="90" y="220" width="220" height="220" rx="40" fill="#0b1220"/>
  <text x="200" y="400" text-anchor="middle" fill="white" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="200" font-weight="800">a</text>
  <!-- headline -->
  <text x="360" y="290" fill="white" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="92" font-weight="800">axle</text>
  <text x="360" y="370" fill="#cbd5e1" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="42" font-weight="500">Accessibility compliance CI</text>
  <text x="360" y="435" fill="#94a3b8" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="28" font-weight="400">WCAG 2.1 / 2.2 AA · EAA 2025 · ADA · תקנה 35</text>
  <text x="360" y="482" fill="#64748b" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="24" font-weight="400">One scanner · every pipeline · no overlay widgets</text>
  <!-- green check -->
  <circle cx="1095" cy="320" r="110" fill="#10b981"/>
  <path d="M1047 322 L1082 358 L1150 286" stroke="white" stroke-width="20" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('/tmp/axle-icons/social-preview.png');
console.log("regenerated social preview 1280x640");
