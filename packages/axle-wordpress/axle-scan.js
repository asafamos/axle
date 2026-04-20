/**
 * axle WordPress plugin — client-side scanner.
 *
 * Runs axe-core inside a hidden iframe that loads the target URL. Because
 * WordPress admin and the site frontend share an origin, axe can read the
 * iframe's DOM. When the scan finishes the results are POSTed back to WP
 * via admin-ajax.php and stored in the axle_last_scan option so PHP can
 * render the summary on the next page load.
 *
 * No external network call for scanning. Optional anonymous ping to
 * /api/track fires after a successful scan if the user hasn't set
 * AXLE_NO_TELEMETRY, so the source counter on axle's dashboard reflects
 * real WP-plugin usage.
 */
(function () {
    'use strict';

    const cfg = window.axleScanConfig;
    if (!cfg) return;

    const btn = document.getElementById('axle-scan-now-btn');
    const statusEl = document.getElementById('axle-scan-status');
    const frameWrap = document.getElementById('axle-scan-frame-wrap');
    if (!btn || !statusEl || !frameWrap) return;

    btn.addEventListener('click', function (e) {
        e.preventDefault();
        runScan(cfg.targetUrl);
    });

    async function runScan(targetUrl) {
        setStatus('Loading target page…');
        btn.disabled = true;

        try {
            const iframe = createHiddenIframe(targetUrl);
            frameWrap.appendChild(iframe);

            await waitForIframeLoad(iframe);
            setStatus('Running axe-core…');

            const results = await window.axe.run(iframe, {
                runOnly: {
                    type: 'tag',
                    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
                },
                resultTypes: ['violations', 'passes'],
            });

            frameWrap.innerHTML = '';

            const summary = countBySeverity(results.violations);
            setStatus('Saving results…');
            await saveResult({
                url: targetUrl,
                violations: stripForStorage(results.violations),
                summary: summary,
                scanned_at: Date.now(),
            });

            pingTelemetry();
            setStatus('Scan complete — reloading…');
            window.location.reload();
        } catch (err) {
            const msg = err && err.message ? err.message : String(err);
            if (msg.indexOf('cross-origin') !== -1 || msg.indexOf('SecurityError') !== -1) {
                setStatus(
                    'Cross-origin scan blocked. The target URL must be on the same origin as this WordPress admin (or reachable without X-Frame-Options: DENY). Try the site home URL.'
                );
            } else {
                setStatus('Scan failed: ' + msg);
            }
            btn.disabled = false;
        }
    }

    function createHiddenIframe(url) {
        const f = document.createElement('iframe');
        f.src = url;
        f.setAttribute('aria-hidden', 'true');
        f.style.cssText =
            'position:absolute; left:-10000px; top:0; width:1280px; height:900px; visibility:hidden;';
        return f;
    }

    function waitForIframeLoad(iframe) {
        return new Promise(function (resolve, reject) {
            let settled = false;
            const timer = setTimeout(function () {
                if (settled) return;
                settled = true;
                reject(new Error('Target URL did not load within 30 seconds'));
            }, 30000);
            iframe.addEventListener('load', function () {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                // Give JS on the target page a moment to initialize.
                setTimeout(resolve, 250);
            });
            iframe.addEventListener('error', function () {
                if (settled) return;
                settled = true;
                clearTimeout(timer);
                reject(new Error('Failed to load target URL'));
            });
        });
    }

    function countBySeverity(violations) {
        const c = { critical: 0, serious: 0, moderate: 0, minor: 0 };
        for (let i = 0; i < violations.length; i++) {
            const k = violations[i].impact || 'minor';
            if (c[k] !== undefined) c[k] += violations[i].nodes.length;
        }
        return c;
    }

    function stripForStorage(violations) {
        // Keep enough to render the admin table; drop the heavy HTML snippets
        // beyond what's needed.
        return violations.map(function (v) {
            return {
                id: v.id,
                impact: v.impact,
                help: v.help,
                helpUrl: v.helpUrl,
                description: v.description,
                nodes: v.nodes.slice(0, 10).map(function (n) {
                    return {
                        html: (n.html || '').slice(0, 500),
                        target: n.target,
                        failureSummary: n.failureSummary,
                    };
                }),
            };
        });
    }

    async function saveResult(payload) {
        const body = new URLSearchParams();
        body.set('action', 'axle_save_scan');
        body.set('_wpnonce', cfg.nonce);
        body.set('payload', JSON.stringify(payload));
        const res = await fetch(cfg.ajaxUrl, {
            method: 'POST',
            credentials: 'same-origin',
            body: body,
        });
        if (!res.ok) throw new Error('Save failed (HTTP ' + res.status + ')');
        const json = await res.json();
        if (!json || !json.success) {
            throw new Error(json && json.data ? json.data : 'Save failed');
        }
    }

    function pingTelemetry() {
        // Fire-and-forget. No PII, no URL, no scan contents.
        try {
            const body = JSON.stringify({
                source: 'axle-wordpress',
                event: 'scan_complete',
            });
            if (navigator.sendBeacon) {
                navigator.sendBeacon(cfg.telemetryUrl, new Blob([body], { type: 'application/json' }));
            } else {
                fetch(cfg.telemetryUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: body,
                    keepalive: true,
                }).catch(function () {});
            }
        } catch (e) {
            /* no-op */
        }
    }

    function setStatus(msg) {
        statusEl.textContent = msg;
        statusEl.style.display = msg ? '' : 'none';
    }
})();
