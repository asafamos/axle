/**
 * Screenshot + mockup generator for axle-action README.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "/tmp/axle-screenshots";
await mkdir(OUT, { recursive: true });

// ─────────────────────────────────────────────────────────────────────────
// 1. PR-comment mockup (inline-attribute SVG to avoid class redeclarations)
// ─────────────────────────────────────────────────────────────────────────

const BODY = 'font-family="-apple-system, system-ui, sans-serif"';
const MONO = 'font-family="ui-monospace, Menlo, monospace"';

const prComment = `<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="950" viewBox="0 0 1400 950">
  <rect width="1400" height="950" fill="#f8fafc"/>
  <rect x="60" y="40" width="1280" height="870" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Header: axle-bot avatar + name + timestamp -->
  <circle cx="100" cy="88" r="20" fill="#0f172a"/>
  <text x="96" y="95" ${BODY} font-size="18" font-weight="800" fill="#ffffff">a</text>
  <text x="132" y="82" ${BODY} font-size="16" font-weight="700" fill="#0f172a">axle-bot</text>
  <text x="132" y="102" ${BODY} font-size="13" fill="#64748b">commented on PR #42 · pushed 3 minutes ago</text>

  <!-- Severity summary header -->
  <rect x="80" y="140" width="1240" height="60" rx="8" fill="#fef2f2" stroke="#fecaca" stroke-width="1"/>
  <text x="104" y="178" ${BODY} font-size="18" font-weight="700" fill="#991b1b">❌ Accessibility check failed · serious threshold</text>
  <text x="1080" y="178" ${BODY} font-size="14" fill="#991b1b">3 critical · 5 serious · 2 moderate</text>

  <!-- Severity counter pills -->
  <rect x="80" y="220" width="160" height="60" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <text x="160" y="250" text-anchor="middle" ${BODY} font-size="28" font-weight="800" fill="#dc2626">3</text>
  <text x="160" y="268" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">CRITICAL</text>

  <rect x="250" y="220" width="160" height="60" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <text x="330" y="250" text-anchor="middle" ${BODY} font-size="28" font-weight="800" fill="#ea580c">5</text>
  <text x="330" y="268" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">SERIOUS</text>

  <rect x="420" y="220" width="160" height="60" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <text x="500" y="250" text-anchor="middle" ${BODY} font-size="28" font-weight="800" fill="#d97706">2</text>
  <text x="500" y="268" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">MODERATE</text>

  <rect x="590" y="220" width="160" height="60" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <text x="670" y="250" text-anchor="middle" ${BODY} font-size="28" font-weight="800" fill="#2563eb">4</text>
  <text x="670" y="268" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">MINOR</text>

  <rect x="760" y="220" width="200" height="60" rx="8" fill="#ecfdf5" stroke="#bbf7d0"/>
  <text x="860" y="250" text-anchor="middle" ${BODY} font-size="28" font-weight="800" fill="#15803d">142</text>
  <text x="860" y="268" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#64748b" letter-spacing="1">PASSES</text>

  <!-- First violation -->
  <rect x="80" y="310" width="1240" height="220" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <rect x="80" y="310" width="4" height="220" fill="#dc2626"/>
  <text x="104" y="342" ${MONO} font-size="14" font-weight="700" fill="#0f172a">aria-labeledby</text>
  <rect x="244" y="328" width="60" height="20" rx="10" fill="#fee2e2"/>
  <text x="274" y="342" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#991b1b">CRITICAL</text>
  <text x="104" y="364" ${BODY} font-size="14" fill="#475569">Elements with ARIA labelledby references must exist and include valid IDs</text>

  <!-- AI fix diff card -->
  <rect x="104" y="380" width="1192" height="130" rx="6" fill="#f8fafc" stroke="#e2e8f0"/>
  <text x="116" y="402" ${BODY} font-size="12" font-weight="700" letter-spacing="0.5" fill="#15803d">✨ SUGGESTED FIX · HIGH CONFIDENCE · via Claude</text>
  <rect x="116" y="414" width="1168" height="30" rx="4" fill="#fef2f2"/>
  <text x="128" y="434" ${MONO} font-size="12" fill="#dc2626">- &lt;ul aria-labeledby="tb-trigger"&gt;</text>
  <rect x="116" y="448" width="1168" height="30" rx="4" fill="#f0fdf4"/>
  <text x="128" y="468" ${MONO} font-size="12" fill="#15803d">+ &lt;ul aria-labelledby="tb-trigger"&gt;</text>
  <text x="128" y="496" ${BODY} font-size="12" fill="#64748b">📝 Typo in the ARIA attribute name — "labeledby" should be "labelledby" (two Ls)</text>

  <!-- Second violation -->
  <rect x="80" y="550" width="1240" height="110" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <rect x="80" y="550" width="4" height="110" fill="#ea580c"/>
  <text x="104" y="582" ${MONO} font-size="14" font-weight="700" fill="#0f172a">color-contrast</text>
  <rect x="226" y="568" width="60" height="20" rx="10" fill="#ffedd5"/>
  <text x="256" y="582" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#9a3412">SERIOUS</text>
  <text x="104" y="604" ${BODY} font-size="14" fill="#475569">Element has insufficient color contrast of 2.83 (required: 4.5:1 for normal text)</text>
  <text x="104" y="630" ${MONO} font-size="12" fill="#64748b">&lt;button class="bg-slate-300 text-slate-100"&gt;Subscribe&lt;/button&gt; on .cta-card</text>
  <text x="104" y="650" ${BODY} font-size="12" fill="#15803d">✨ AI fix proposes: bg-slate-900 text-white  →  contrast ratio 16.5:1</text>

  <!-- Third violation (collapsed) -->
  <rect x="80" y="680" width="1240" height="60" rx="8" fill="#fff" stroke="#e2e8f0"/>
  <rect x="80" y="680" width="4" height="60" fill="#ea580c"/>
  <text x="104" y="712" ${MONO} font-size="14" font-weight="700" fill="#0f172a">button-name</text>
  <rect x="215" y="698" width="60" height="20" rx="10" fill="#ffedd5"/>
  <text x="245" y="712" text-anchor="middle" ${BODY} font-size="11" font-weight="700" fill="#9a3412">SERIOUS</text>
  <text x="104" y="732" ${BODY} font-size="13" fill="#64748b">3 buttons without accessible names (icon-only). Show full report ↓</text>

  <!-- Footer -->
  <text x="104" y="810" ${BODY} font-size="13" fill="#64748b">📊 Full report: axle-report.json · axle-report.md · artifacts attached to this workflow run</text>
  <text x="104" y="830" ${BODY} font-size="13" fill="#64748b">⚡ Merge blocked — fail-on is "serious" and this PR has 3 critical + 5 serious violations.</text>
  <text x="104" y="878" ${BODY} font-size="12" fill="#94a3b8">Powered by axle — axe-core 4.11 + Claude Sonnet · https://axle-iota.vercel.app</text>
</svg>`;

await sharp(Buffer.from(prComment)).png().toFile(`${OUT}/pr-comment-mockup.png`);
console.log("✓ pr-comment-mockup.png");

// ─────────────────────────────────────────────────────────────────────────
// 2. Live Playwright screenshots
// ─────────────────────────────────────────────────────────────────────────

const browser = await chromium.launch();
try {
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  await page.goto("https://axle-iota.vercel.app/", { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/homepage.png`, fullPage: false });
  console.log("✓ homepage.png");

  await page.goto("https://axle-iota.vercel.app/statement", {
    waitUntil: "networkidle",
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/statement-generator.png`, fullPage: false });
  console.log("✓ statement-generator.png");
} finally {
  await browser.close();
}

console.log("\nall assets written to " + OUT);
