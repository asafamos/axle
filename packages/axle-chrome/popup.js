const button = document.getElementById("scan");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  button.disabled = true;
  button.textContent = "Scanning…";
  result.innerHTML = `<div class="loading">Injecting axe-core into the current tab…</div>`;

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    result.innerHTML = `<div class="loading">No active tab.</div>`;
    button.disabled = false;
    button.textContent = "Scan this page";
    return;
  }

  try {
    // Inject axe-core bundled with the extension.
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["axe.min.js"],
    });

    const [{ result: axeResult }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: async () => {
        // @ts-expect-error axe is injected by the prior step
        return await window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
          },
          resultTypes: ["violations"],
        });
      },
    });

    renderResult(axeResult, tab.url);
  } catch (err) {
    result.innerHTML = `<div class="loading">Scan failed: ${err?.message || err}</div>`;
  } finally {
    button.disabled = false;
    button.textContent = "Scan this page";
  }
});

function renderResult(axeResult, pageUrl) {
  const violations = axeResult?.violations || [];
  const sum = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
  };
  for (const v of violations) {
    if (v.impact && sum[v.impact] !== undefined) sum[v.impact] += 1;
  }

  const summaryHtml = `
    <div class="summary">
      <div class="critical"><div class="n">${sum.critical}</div><div class="l">Critical</div></div>
      <div class="serious"><div class="n">${sum.serious}</div><div class="l">Serious</div></div>
      <div class="moderate"><div class="n">${sum.moderate}</div><div class="l">Moderate</div></div>
      <div class="minor"><div class="n">${sum.minor}</div><div class="l">Minor</div></div>
    </div>
  `;

  const list = violations
    .slice(0, 20)
    .map((v) => {
      const elems = v.nodes?.length || 0;
      return `<li>
        <div><strong>${escape(v.help)}</strong></div>
        <div class="rule-id">${escape(v.id)} · ${elems} element${elems === 1 ? "" : "s"} · ${escape(v.impact || "minor")}</div>
      </li>`;
    })
    .join("");

  const encoded = encodeURIComponent(pageUrl || "");
  const openFullUrl = `https://axle-iota.vercel.app/?url=${encoded}`;

  result.innerHTML = `
    ${summaryHtml}
    ${violations.length ? `<ul class="rules">${list}</ul>` : '<div class="loading">✅ No automated violations detected.</div>'}
    <div class="loading">
      <a href="${openFullUrl}" target="_blank">Open full report on axle →</a>
    </div>
  `;
}

function escape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
