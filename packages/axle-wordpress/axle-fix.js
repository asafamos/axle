/**
 * axle WordPress plugin — "Generate AI fix" buttons.
 *
 * Each violation row in the results table has a button. Clicking it asks
 * WordPress (admin-ajax.php, action axle_generate_fix) to request a fix for ONE
 * element of that violation from the hosted axle service, then renders the
 * suggested change in the row's hidden panel.
 *
 * Nothing runs on page load: no request is made until an administrator clicks a
 * button. Everything the server returns is written with textContent, never as
 * HTML, because it is suggested code from an external service.
 */
(function () {
    'use strict';

    var cfg = window.axleFixConfig;
    if (!cfg) return;
    var t = cfg.i18n || {};

    document.addEventListener('click', function (e) {
        var btn = e.target && e.target.closest ? e.target.closest('.axle-fix-btn') : null;
        if (!btn) return;
        e.preventDefault();
        var panelRow = document.getElementById(btn.getAttribute('aria-controls'));
        if (!panelRow) return;
        var body = panelRow.querySelector('.axle-fix-body');
        if (!body) return;

        if (btn.getAttribute('data-loaded') === '1') {
            toggle(btn, panelRow);
            return;
        }
        generate(btn, panelRow, body);
    });

    function toggle(btn, panelRow) {
        var open = panelRow.hasAttribute('hidden');
        if (open) {
            panelRow.removeAttribute('hidden');
        } else {
            panelRow.setAttribute('hidden', '');
        }
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        btn.textContent = open ? t.hideFix : t.showFix;
    }

    function generate(btn, panelRow, body) {
        var original = btn.textContent;
        btn.disabled = true;
        btn.setAttribute('aria-busy', 'true');
        btn.textContent = t.generating;
        clear(body);
        panelRow.removeAttribute('hidden');
        btn.setAttribute('aria-expanded', 'true');

        var form = new URLSearchParams();
        form.set('action', 'axle_generate_fix');
        form.set('_wpnonce', cfg.nonce);
        form.set('violation', btn.getAttribute('data-violation'));
        form.set('node', btn.getAttribute('data-node') || '0');

        fetch(cfg.ajaxUrl, { method: 'POST', credentials: 'same-origin', body: form })
            .then(function (res) {
                return res.json().then(
                    function (json) { return { status: res.status, json: json }; },
                    function () { return { status: res.status, json: null }; }
                );
            })
            .then(function (r) {
                btn.disabled = false;
                btn.removeAttribute('aria-busy');
                if (r.json && r.json.success && r.json.data) {
                    render(body, r.json.data);
                    btn.setAttribute('data-loaded', '1');
                    btn.textContent = t.hideFix;
                } else {
                    var data = (r.json && r.json.data) || {};
                    renderError(body, data, r.status);
                    btn.textContent = original;
                    btn.setAttribute('aria-expanded', 'true');
                }
            })
            .catch(function (err) {
                btn.disabled = false;
                btn.removeAttribute('aria-busy');
                btn.textContent = original;
                renderError(body, { message: (err && err.message) || t.error }, 0);
            });
    }

    function render(body, d) {
        clear(body);
        var wrap = el('div', null);
        wrap.style.cssText = 'padding:8px 4px;max-width:900px;';

        var status = el('p', null, t.ready);
        status.className = 'screen-reader-text';
        wrap.appendChild(status);

        if (d.explanation) {
            wrap.appendChild(heading(t.explanation));
            wrap.appendChild(el('p', null, d.explanation));
        }
        if (d.strategy) {
            wrap.appendChild(heading(t.strategy));
            wrap.appendChild(el('p', null, d.strategy));
        }

        var patches = d.patches || [];
        for (var i = 0; i < patches.length; i++) {
            var p = patches[i];
            var box = el('div', null);
            box.style.cssText = 'margin:8px 0 12px;';
            if (p.selector) {
                var sel = el('p', null);
                sel.appendChild(el('strong', null, t.element + ': '));
                sel.appendChild(el('code', null, p.selector));
                box.appendChild(sel);
            }
            box.appendChild(codeBlock(t.before, p.before));
            box.appendChild(codeBlock(t.after, p.after));
            if (p.notes) {
                box.appendChild(el('p', null, p.notes));
            }
            wrap.appendChild(box);
        }

        var meta = el('p', null);
        meta.appendChild(el('strong', null, t.confidence + ': '));
        meta.appendChild(el('span', null, t[d.confidence] || d.confidence));
        wrap.appendChild(meta);

        if (d.manual_review) {
            wrap.appendChild(notice('notice-warning', t.manualReview));
        }
        wrap.appendChild(el('p', 'description', t.applyNote));

        var tier = el('p', 'description');
        if (d.tier === 'subscriber') {
            tier.textContent = t.included;
        } else if (typeof d.remaining === 'number') {
            tier.textContent = String(t.freeLeft || '').replace('%d', String(d.remaining));
        }
        if (tier.textContent) wrap.appendChild(tier);

        body.appendChild(wrap);
    }

    function renderError(body, data, status) {
        clear(body);
        var wrap = el('div', null);
        wrap.style.cssText = 'padding:8px 4px;';
        wrap.appendChild(notice('notice-error', data.message || t.error));
        if (data.upgrade && data.upgrade_url) {
            var p = el('p', null);
            var a = document.createElement('a');
            a.href = data.upgrade_url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = t.upgrade;
            p.appendChild(a);
            wrap.appendChild(p);
        }
        body.appendChild(wrap);
    }

    function codeBlock(label, text) {
        var box = el('div', null);
        box.appendChild(el('strong', null, label));
        var pre = document.createElement('pre');
        pre.tabIndex = 0; // scrollable region must be keyboard reachable
        pre.setAttribute('aria-label', label);
        pre.style.cssText =
            'background:#f6f7f7;border:1px solid #c3c4c7;padding:8px;margin:4px 0 8px;overflow:auto;white-space:pre-wrap;word-break:break-word;';
        var code = document.createElement('code');
        code.textContent = text || '';
        pre.appendChild(code);
        box.appendChild(pre);
        return box;
    }

    function notice(kind, text) {
        var n = el('div', 'notice ' + kind + ' inline');
        n.appendChild(el('p', null, text));
        return n;
    }

    function heading(text) {
        var h = el('p', null);
        h.appendChild(el('strong', null, text));
        return h;
    }

    function el(tag, className, text) {
        var n = document.createElement(tag);
        if (className) n.className = className;
        if (text !== undefined && text !== null) n.textContent = text;
        return n;
    }

    function clear(node) {
        while (node.firstChild) node.removeChild(node.firstChild);
    }
})();
