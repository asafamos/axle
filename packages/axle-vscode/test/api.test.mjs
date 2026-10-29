// Plain-Node tests for the extension's pure logic. Run: npm test (compiles first).
import test from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import api from "../out/api.js";

const {
  ApiError, normalizeScan, partitionByThreshold, isLocalUrl, buildFixRequest,
  renderFixMarkdown, shouldShowCiTip, siteUrl, absoluteUrl, postJson, CI_TIP_INTERVAL_MS,
} = api;

const violation = (over = {}) => ({
  id: "color-contrast", impact: "serious", description: "d", help: "h",
  helpUrl: "https://x", tags: ["wcag2aa"],
  nodes: [{ html: "<p>hi</p>", target: ["p"], failureSummary: "fix it" }], ...over,
});

test("normalizeScan: hosted API shape, counts recomputed from the list", () => {
  const r = normalizeScan({
    url: "https://a.com", scanned_at: "2026-10-29T00:00:00Z", permalink: "/r/abc",
    summary: { violations: 99, critical: 99, serious: 99, moderate: 0, minor: 0 },
    violations: [violation(), violation({ id: "x", impact: "critical" })],
  });
  assert.equal(r.summary.violations, 2);
  assert.equal(r.summary.serious, 1);
  assert.equal(r.summary.critical, 1);
  assert.equal(r.permalink, "/r/abc");
});

test("normalizeScan: axle-cli report shape ({result:{scannedAt,...}})", () => {
  const r = normalizeScan({ result: { url: "http://localhost:3000", scannedAt: "2026-10-29T01:00:00Z", violations: [violation({ impact: null })] }, fixes: {} });
  assert.equal(r.scanned_at, "2026-10-29T01:00:00Z");
  assert.equal(r.violations[0].impact, "minor");
  assert.equal(r.summary.minor, 1);
});

test("normalizeScan: rejects garbage, tolerates sparse nodes", () => {
  assert.throws(() => normalizeScan({ nope: 1 }), /no violations list/);
  const r = normalizeScan({ url: "u", violations: [{ id: "a", nodes: [null, { target: [1, 2] }] }, null, { impact: "serious" }] });
  assert.equal(r.violations.length, 1);
  assert.deepEqual(r.violations[0].nodes[1].target, ["1", "2"]);
});

test("partitionByThreshold keeps original indexes and drops nothing", () => {
  const vs = [violation({ impact: "minor" }), violation({ impact: "critical" }), violation({ impact: "moderate" })];
  const p = partitionByThreshold(vs, "serious");
  assert.deepEqual(p.shown.map((x) => x.index), [1]);
  assert.deepEqual(p.hidden.map((x) => x.index), [0, 2]);
  assert.equal(partitionByThreshold(vs, "none").shown.length, 3);
});

test("isLocalUrl", () => {
  for (const u of ["http://localhost:3000", "http://127.0.0.1:8080/x", "http://[::1]:3000", "http://app.localhost", "http://192.168.1.5", "http://10.0.0.2", "http://172.20.1.1", "http://foo.local", "http://0.0.0.0:3000"]) assert.equal(isLocalUrl(u), true, u);
  for (const u of ["https://example.com", "https://axlescan.com/x", "http://172.32.0.1", "http://11.0.0.1", "not a url"]) assert.equal(isLocalUrl(u), false, u);
});

test("buildFixRequest sends exactly one element, capped and cleaned", () => {
  const long = "<input>" + "a".repeat(900) + "\u0000\u0007";
  const v = violation({ nodes: [{ html: "<b>first</b>", target: ["b"], failureSummary: "x" }, { html: long, target: Array(20).fill("t".repeat(900)), failureSummary: "y".repeat(3000) }] });
  const body = buildFixRequest(v, 1);
  assert.deepEqual(Object.keys(body).sort(), ["nodeIndex", "violation"]);
  assert.equal(body.nodeIndex, 0);
  assert.equal(body.violation.nodes.length, 1);
  assert.equal(body.violation.nodes[0].html.length, 500);
  assert.ok(!/[\u0000-\u0008]/.test(body.violation.nodes[0].html));
  assert.equal(body.violation.nodes[0].target.length, 10);
  assert.equal(body.violation.nodes[0].target[0].length, 500);
  assert.equal(body.violation.nodes[0].failureSummary.length, 1500);
  assert.throws(() => buildFixRequest(v, 5), /no longer in the last scan/);
  assert.ok(!JSON.stringify(body).includes("first"));
});

test("renderFixMarkdown fences code that contains backticks", () => {
  const md = renderFixMarkdown(
    { explanation: "why", fix_strategy: "how", patches: [{ selector: "p", before: "a ``` b", after: "<p>ok</p>" }], confidence: "high", manual_review_needed: true, tier: "free", remaining: 2 },
    violation(), violation().nodes[0], "https://a.com");
  assert.match(md, /````html\na ``` b\n````/);
  assert.match(md, /Manual review recommended/);
  assert.match(md, /Free AI fixes left today: 2/);
  assert.match(md, /Confidence:\*\* high/);
});

test("shouldShowCiTip: not on first scan, weekly at most, switchable", () => {
  const now = 1_000_000_000_000;
  assert.equal(shouldShowCiTip({ scanCount: 1, lastShown: undefined }, true, now), false);
  assert.equal(shouldShowCiTip({ scanCount: 2, lastShown: undefined }, true, now), true);
  assert.equal(shouldShowCiTip({ scanCount: 9, lastShown: now - 1000 }, true, now), false);
  assert.equal(shouldShowCiTip({ scanCount: 9, lastShown: now - CI_TIP_INTERVAL_MS - 1 }, true, now), true);
  assert.equal(shouldShowCiTip({ scanCount: 9, lastShown: undefined }, false, now), false);
});

test("siteUrl / absoluteUrl", () => {
  const u = new URL(siteUrl("/pricing", "ci-tip"));
  assert.equal(u.origin, "https://axlescan.com");
  assert.equal(u.searchParams.get("utm_source"), "axle-vscode");
  assert.equal(u.searchParams.get("utm_campaign"), "ci-tip");
  assert.equal(absoluteUrl("/#pricing"), "https://axlescan.com/#pricing");
});

function serve(handler) {
  return new Promise((resolve) => {
    const s = http.createServer(handler);
    s.listen(0, "127.0.0.1", () => resolve({ s, url: `http://127.0.0.1:${s.address().port}/x` }));
  });
}

test("postJson: success, header + UA forwarding, body delivered", async () => {
  let seen;
  const { s, url } = await serve((req, res) => {
    let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => {
      seen = { h: req.headers, b: JSON.parse(b) };
      res.setHeader("content-type", "application/json"); res.end('{"ok":true}');
    });
  });
  const out = await postJson(url, { a: 1 }, { "x-axle-key": "k1" }, "axle-vscode/9");
  s.close();
  assert.deepEqual(out, { ok: true });
  assert.equal(seen.h["x-axle-key"], "k1");
  assert.equal(seen.h["user-agent"], "axle-vscode/9");
  assert.deepEqual(seen.b, { a: 1 });
});

test("postJson: 402 -> ApiError with status, message and absolute upgrade url", async () => {
  const { s, url } = await serve((req, res) => { res.statusCode = 402; res.end(JSON.stringify({ error: "limit", upgrade_url: "/#pricing" })); req.resume(); });
  await assert.rejects(postJson(url, {}), (e) => e instanceof ApiError && e.status === 402 && e.message === "limit" && e.upgradeUrl === "https://axlescan.com/#pricing");
  s.close();
});

test("postJson: HTML error page and 200-with-garbage both become ApiErrors", async () => {
  let code = 502;
  const { s, url } = await serve((req, res) => { res.statusCode = code; res.end("<html>bad gateway</html>"); req.resume(); });
  await assert.rejects(postJson(url, {}), (e) => e instanceof ApiError && e.status === 502 && e.message === "axle returned HTTP 502");
  code = 200;
  await assert.rejects(postJson(url, {}), /unexpected \(non-JSON\)/);
  s.close();
});

test("postJson: times out instead of hanging", async () => {
  const { s, url } = await serve((req) => { req.resume(); /* never respond */ });
  await assert.rejects(postJson(url, {}, {}, "t", 150), /timed out/);
  s.closeAllConnections?.(); s.close();
});
