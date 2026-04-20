import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const svgSquare = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <!-- check/shield mark: bottom-right green accent -->
  <circle cx="380" cy="380" r="72" fill="#10b981"/>
  <path d="M348 382 L372 406 L420 358" stroke="white" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <!-- 'a' lettermark -->
  <text x="256" y="336" text-anchor="middle" fill="white" font-family="-apple-system, 'SF Pro Display', 'Inter', system-ui, sans-serif" font-size="300" font-weight="800">a</text>
</svg>`;

const svgBanner = `
<svg xmlns="http://www.w3.org/2000/svg" width="1544" height="500" viewBox="0 0 1544 500">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/>
      <stop offset="1" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="1544" height="500" fill="url(#bg)"/>
  <!-- logo square -->
  <rect x="100" y="150" width="200" height="200" rx="36" fill="#0b1220"/>
  <text x="200" y="320" text-anchor="middle" fill="white" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="180" font-weight="800">a</text>
  <!-- tagline -->
  <text x="360" y="230" fill="white" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="68" font-weight="800">axle</text>
  <text x="360" y="300" fill="#94a3b8" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="34" font-weight="500">Accessibility compliance CI</text>
  <text x="360" y="355" fill="#64748b" font-family="-apple-system, 'SF Pro Display', system-ui, sans-serif" font-size="24" font-weight="400">WCAG 2.1 / 2.2 AA · EAA 2025 · ADA · תקנה 35</text>
  <!-- green check on right -->
  <circle cx="1350" cy="250" r="100" fill="#10b981"/>
  <path d="M1305 252 L1340 286 L1405 218" stroke="white" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

async function toPng(svg, size, out) {
  const buf = Buffer.from(svg);
  await sharp(buf).png().toFile(out);
  console.log("wrote", out);
}

async function main() {
  for (const s of [16, 32, 48, 128, 256, 512]) {
    await toPng(svgSquare(s), s, `/tmp/axle-icons/icon-${s}.png`);
  }
  // wp.org wants specific filenames:
  await toPng(svgSquare(128), 128, `/tmp/axle-icons/icon-128x128.png`);
  await toPng(svgSquare(256), 256, `/tmp/axle-icons/icon-256x256.png`);
  // raycast wants 512x512 as command-icon
  await toPng(svgSquare(512), 512, `/tmp/axle-icons/command-icon.png`);
  // GH social preview: 1280x640
  const svgSocial = svgBanner.replace('1544" height="500"', '1280" height="640"').replace('viewBox="0 0 1544 500"', 'viewBox="0 0 1280 640"');
  const socialBuf = Buffer.from(svgSocial);
  await sharp(socialBuf).resize(1280, 640).png().toFile('/tmp/axle-icons/social-preview.png');
  console.log("wrote /tmp/axle-icons/social-preview.png");
  // wp.org banner
  const bannerBuf = Buffer.from(svgBanner);
  await sharp(bannerBuf).png().toFile('/tmp/axle-icons/banner-1544x500.png');
  await sharp(bannerBuf).resize(772, 250).png().toFile('/tmp/axle-icons/banner-772x250.png');
  console.log("wrote wp banners");
}

main().catch(e => { console.error(e); process.exit(1); });
