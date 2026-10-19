<?php
/**
 * Plugin Name: AsafAmos Accessibility Scanner
 * Plugin URI:  https://github.com/asafamos/axle/tree/main/packages/axle-wordpress
 * Description: Scan this WordPress site for WCAG 2.1 / 2.2 AA accessibility violations. axe-core 4.11 runs in your admin browser via a hidden iframe — nothing is transmitted unless you click "Generate AI fix". Built for EAA 2025 / ADA / תקנה 35.
 * Version:     1.3.0
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author:      AsafAmos
 * Author URI:  https://axlescan.com?utm_source=asafamos-accessibility-scanner
 * License:     MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: asafamos-accessibility-scanner
 *
 * Architecture: scans run client-side via bundled axe-core in a hidden iframe
 * inside the WP admin. Works for any environment — LocalWP, staging with
 * basic auth, VPN-only production — without relying on a hosted scanner that
 * cannot resolve private hostnames. See axle-scan.js for the runner.
 *
 * Renamed from "Axle Accessibility Scanner" / "axle-accessibility-scanner"
 * in 1.2.0 per WordPress.org Plugin Review Team feedback (the "Axle" name
 * raised a trademark concern with the existing "Axle AI" project).
 */

if (!defined('ABSPATH')) { exit; }

define('AXLE_VERSION', '1.3.0');
define('AXLE_API_BASE', 'https://axlescan.com');
define('AXLE_OPTION_SETTINGS', 'axle_settings');
define('AXLE_OPTION_LAST_SCAN', 'axle_last_scan');
define('AXLE_CRON_HOOK', 'axle_daily_scan');

/**
 * Activation: seed default settings. No cron, no external call — policy
 * requires user action before anything phones home. The cron only runs
 * after the user opts in via Settings.
 */
register_activation_hook(__FILE__, function () {
    if (!get_option(AXLE_OPTION_SETTINGS)) {
        add_option(AXLE_OPTION_SETTINGS, [
            'api_key'      => '',
            'auto_scan'    => 'off',
            'target_url'   => home_url('/'),
            'fail_on'      => 'serious',
        ]);
    }
});

register_deactivation_hook(__FILE__, 'axle_unschedule_cron');

function axle_unschedule_cron() {
    $timestamp = wp_next_scheduled(AXLE_CRON_HOOK);
    if ($timestamp) {
        wp_unschedule_event($timestamp, AXLE_CRON_HOOK);
    }
}

function axle_reschedule_cron($auto_scan) {
    axle_unschedule_cron();
    if ($auto_scan === 'daily') {
        wp_schedule_event(time() + 3600, 'daily', AXLE_CRON_HOOK);
    }
}

add_action('update_option_' . AXLE_OPTION_SETTINGS, function ($old, $new) {
    $old_auto = is_array($old) ? ($old['auto_scan'] ?? 'off') : 'off';
    $new_auto = is_array($new) ? ($new['auto_scan'] ?? 'off') : 'off';
    if ($old_auto !== $new_auto) {
        axle_reschedule_cron($new_auto);
    }
}, 10, 2);

/**
 * Cron fires just a client-side scan trigger isn't possible (no browser),
 * so daily cron uses the hosted fallback scanner. Users who are on private
 * networks and want daily scans should point target_url at a public staging
 * URL. The admin-page "Scan now" button uses the client-side scanner.
 */
add_action(AXLE_CRON_HOOK, function () {
    $settings = get_option(AXLE_OPTION_SETTINGS, []);
    if (($settings['auto_scan'] ?? 'off') !== 'daily') return;
    $target   = !empty($settings['target_url']) ? $settings['target_url'] : home_url('/');
    $api_key  = $settings['api_key'] ?? '';
    $headers = ['Content-Type' => 'application/json'];
    if ($api_key) {
        $headers['Authorization'] = 'Bearer ' . $api_key;
    }
    $response = wp_remote_post(AXLE_API_BASE . '/api/scan', [
        'timeout' => 60,
        'headers' => $headers,
        'body'    => wp_json_encode(['url' => $target, 'source' => 'axle-wordpress']),
    ]);
    if (is_wp_error($response)) {
        update_option(AXLE_OPTION_LAST_SCAN, [
            'error'      => $response->get_error_message(),
            'scanned_at' => time(),
            'target'     => $target,
            'via'        => 'cron-hosted',
        ]);
        return;
    }
    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);
    if ($code >= 400) {
        $msg = is_array($body) && !empty($body['error'])
            ? $body['error']
            /* translators: %d is the HTTP status code returned by the hosted scanner */
            : sprintf(__('Scan failed (HTTP %d)', 'asafamos-accessibility-scanner'), $code);
        update_option(AXLE_OPTION_LAST_SCAN, [
            'error'      => $msg,
            'scanned_at' => time(),
            'target'     => $target,
            'via'        => 'cron-hosted',
        ]);
        return;
    }
    update_option(AXLE_OPTION_LAST_SCAN, [
        'result'     => $body,
        'scanned_at' => time(),
        'target'     => $target,
        'via'        => 'cron-hosted',
    ]);
});

add_action('admin_menu', function () {
    add_management_page(
        // page title — appears in <title> on the admin page
        __('AsafAmos Accessibility Scanner', 'asafamos-accessibility-scanner'),
        // menu title — appears in the Tools sub-menu
        __('Accessibility Scanner', 'asafamos-accessibility-scanner'),
        'manage_options',
        // menu slug — also matches the WP.org plugin slug
        'asafamos-accessibility-scanner',
        'axle_render_admin_page'
    );
});

add_action('admin_init', function () {
    register_setting('axle_settings_group', AXLE_OPTION_SETTINGS, [
        'sanitize_callback' => 'axle_sanitize_settings',
    ]);
});

function axle_sanitize_settings($input) {
    $out = [];
    $out['api_key']    = isset($input['api_key'])    ? sanitize_text_field($input['api_key'])    : '';
    $out['target_url'] = isset($input['target_url']) ? esc_url_raw($input['target_url'])         : home_url('/');
    $out['auto_scan']  = in_array($input['auto_scan'] ?? 'off', ['off', 'daily'], true) ? $input['auto_scan'] : 'off';
    $out['fail_on']    = in_array($input['fail_on']   ?? 'serious', ['critical', 'serious', 'moderate', 'minor'], true) ? $input['fail_on'] : 'serious';
    return $out;
}

/**
 * AJAX: client-side scanner POSTs its axe-core output here to persist.
 * Requires nonce + manage_options capability.
 */
add_action('wp_ajax_axle_save_scan', function () {
    if (!current_user_can('manage_options')) {
        wp_send_json_error('Unauthorized', 403);
    }
    check_ajax_referer('axle_save_scan');

    // Payload is a JSON blob. Sanitizing the raw bytes here would corrupt
    // the structure; every nested field is sanitized individually below
    // via axle_sanitize_violations before being persisted.
    // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- JSON decoded and each field sanitized below.
    $raw = isset($_POST['payload']) ? wp_unslash($_POST['payload']) : '';
    $decoded = json_decode($raw, true);
    if (!is_array($decoded) || empty($decoded['url'])) {
        wp_send_json_error('Invalid payload', 400);
    }

    $target = esc_url_raw($decoded['url']);
    $violations = is_array($decoded['violations'] ?? null) ? $decoded['violations'] : [];
    $summary = is_array($decoded['summary'] ?? null) ? $decoded['summary'] : [
        'critical' => 0, 'serious' => 0, 'moderate' => 0, 'minor' => 0,
    ];

    // Reshape into the same structure the server-side scanner produced so
    // axle_render_last_scan works without branching.
    update_option(AXLE_OPTION_LAST_SCAN, [
        'result' => [
            'violations' => axle_sanitize_violations($violations),
            'summary'    => array_map('intval', $summary),
        ],
        'scanned_at' => time(),
        'target'     => $target,
        'via'        => 'client-axe',
    ]);

    wp_send_json_success(['saved' => true]);
});

/**
 * Clean a string from the scanner for storage as OPAQUE TEXT: valid UTF-8, no
 * control characters, length-capped. Deliberately NOT run through wp_kses_post /
 * sanitize_text_field: those strip tags, and what we keep is HTML source (an
 * <input>, <select>, <svg>, <button>…) that the AI fix needs verbatim. kses
 * removes whole elements it does not allow — <input> among them — which silently
 * stored an EMPTY snippet for form-field violations, the most common failures.
 * This is safe because the value is never printed as HTML: the results table
 * prints it through esc_html() and the fix panel renders it with textContent.
 */
function axle_clean_scan_text($value, $max) {
    $value = wp_check_invalid_utf8((string) $value, true);
    $value = (string) preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $value);
    return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}

function axle_sanitize_violations($violations) {
    $allowed_impact = ['critical', 'serious', 'moderate', 'minor'];
    $out = [];
    foreach ($violations as $v) {
        if (!is_array($v)) continue;
        $impact = in_array($v['impact'] ?? null, $allowed_impact, true) ? $v['impact'] : null;
        $nodes = [];
        foreach ((array) ($v['nodes'] ?? []) as $n) {
            if (!is_array($n)) continue;
            $nodes[] = [
                'html'           => axle_clean_scan_text($n['html'] ?? '', 500),
                'target'         => array_map(function ($t) { return axle_clean_scan_text($t, 500); }, array_slice((array) ($n['target'] ?? []), 0, 10)),
                'failureSummary' => axle_clean_scan_text($n['failureSummary'] ?? '', 1500),
            ];
        }
        $out[] = [
            'id'          => sanitize_key($v['id'] ?? ''),
            'impact'      => $impact,
            'help'        => axle_clean_scan_text($v['help'] ?? '', 300),
            'helpUrl'     => esc_url_raw((string) ($v['helpUrl'] ?? '')),
            'description' => axle_clean_scan_text($v['description'] ?? '', 600),
            'nodes'       => $nodes,
        ];
    }
    return $out;
}

/**
 * AJAX: generate an AI fix for ONE element of ONE violation from the stored
 * scan, via the hosted axle service. This is the plugin's only call that sends
 * page data off the site, and it only happens when an administrator clicks a
 * "Generate AI fix" button. What is sent: the rule id/description/help text and
 * ONE affected element (its selector, its HTML capped at 500 characters, and
 * axe-core's failure summary), plus the optional API key in a header. See the
 * "Optional features" section of readme.txt.
 *
 * Requires nonce + manage_options. The violation/element are looked up from
 * the stored scan by index, never taken from the request body, so a request
 * cannot make the plugin forward arbitrary content.
 */
add_action('wp_ajax_axle_generate_fix', function () {
    if (!current_user_can('manage_options')) {
        wp_send_json_error(['message' => __('Unauthorized', 'asafamos-accessibility-scanner')], 403);
    }
    check_ajax_referer('axle_generate_fix');

    $v_index = isset($_POST['violation']) ? absint(wp_unslash($_POST['violation'])) : -1;
    $n_index = isset($_POST['node']) ? absint(wp_unslash($_POST['node'])) : 0;

    $last       = get_option(AXLE_OPTION_LAST_SCAN, null);
    $violations = (is_array($last) && isset($last['result']['violations']) && is_array($last['result']['violations']))
        ? array_values($last['result']['violations'])
        : [];
    if (!isset($violations[$v_index]) || !is_array($violations[$v_index])) {
        wp_send_json_error(['message' => __('Run a scan first, then try again.', 'asafamos-accessibility-scanner')], 400);
    }
    $v     = $violations[$v_index];
    $nodes = (isset($v['nodes']) && is_array($v['nodes'])) ? array_values($v['nodes']) : [];
    if (empty($nodes) || !is_array($nodes[0])) {
        wp_send_json_error(['message' => __('This result has no element to fix.', 'asafamos-accessibility-scanner')], 400);
    }
    $n = isset($nodes[$n_index]) && is_array($nodes[$n_index]) ? $nodes[$n_index] : $nodes[0];

    $payload = [
        'violation' => [
            'id'          => axle_clean_scan_text($v['id'] ?? '', 100),
            'impact'      => isset($v['impact']) ? axle_clean_scan_text($v['impact'], 20) : null,
            'description' => axle_clean_scan_text($v['description'] ?? '', 600),
            'help'        => axle_clean_scan_text($v['help'] ?? '', 300),
            'helpUrl'     => axle_clean_scan_text($v['helpUrl'] ?? '', 300),
            'tags'        => [],
            'nodes'       => [[
                'html'           => axle_clean_scan_text($n['html'] ?? '', 500),
                'target'         => array_values(array_map(function ($t) { return axle_clean_scan_text($t, 500); }, array_slice((array) ($n['target'] ?? []), 0, 10))),
                'failureSummary' => axle_clean_scan_text($n['failureSummary'] ?? '', 1500),
            ]],
        ],
        'nodeIndex' => 0,
    ];

    $settings = get_option(AXLE_OPTION_SETTINGS, []);
    $api_key  = isset($settings['api_key']) ? (string) $settings['api_key'] : '';
    $headers  = ['Content-Type' => 'application/json'];
    if ($api_key !== '') {
        $headers['x-axle-key'] = $api_key;
    }

    $response = wp_remote_post(AXLE_API_BASE . '/api/fix', [
        'timeout' => 60,
        'headers' => $headers,
        'body'    => wp_json_encode($payload),
    ]);
    if (is_wp_error($response)) {
        wp_send_json_error([
            /* translators: %s: network error message */
            'message' => sprintf(__('Could not reach the axle service: %s', 'asafamos-accessibility-scanner'), $response->get_error_message()),
        ], 502);
    }

    $code = (int) wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);
    $api_error = (is_array($body) && !empty($body['error']) && is_string($body['error'])) ? $body['error'] : '';

    if ($code === 402) {
        wp_send_json_error([
            'message'     => $api_error !== '' ? $api_error : __('Free AI fixes for today are used up.', 'asafamos-accessibility-scanner'),
            'upgrade'     => true,
            'upgrade_url' => AXLE_API_BASE . '/pricing?utm_source=axle-wordpress-fix',
            'has_key'     => $api_key !== '',
        ], 402);
    }
    if ($code >= 400 || !is_array($body)) {
        wp_send_json_error([
            'message' => $api_error !== ''
                ? $api_error
                /* translators: %d: HTTP status code from the hosted service */
                : sprintf(__('The axle service returned an error (HTTP %d).', 'asafamos-accessibility-scanner'), $code),
        ], 502);
    }

    // Whitelist what we hand back to the browser. The code strings are shown as
    // plain text by axle-fix.js (textContent), so they are length-capped but not
    // HTML-filtered — filtering would corrupt the code being suggested.
    $patches = [];
    foreach ((array) ($body['patches'] ?? []) as $patch) {
        if (!is_array($patch)) continue;
        $patches[] = [
            'selector' => substr((string) ($patch['selector'] ?? ''), 0, 500),
            'before'   => substr((string) ($patch['before'] ?? ''), 0, 4000),
            'after'    => substr((string) ($patch['after'] ?? ''), 0, 4000),
            'notes'    => substr((string) ($patch['notes'] ?? ''), 0, 1000),
        ];
        if (count($patches) >= 5) break;
    }
    $confidence = in_array($body['confidence'] ?? '', ['high', 'medium', 'low'], true) ? $body['confidence'] : 'medium';

    wp_send_json_success([
        'explanation'   => substr((string) ($body['explanation'] ?? ''), 0, 2000),
        'strategy'      => substr((string) ($body['fix_strategy'] ?? ''), 0, 2000),
        'patches'       => $patches,
        'confidence'    => $confidence,
        'manual_review' => !empty($body['manual_review_needed']),
        'tier'          => (($body['tier'] ?? '') === 'subscriber') ? 'subscriber' : 'free',
        'remaining'     => isset($body['remaining']) ? (int) $body['remaining'] : null,
    ]);
});

/**
 * Enqueue axe-core + the scanner glue script, only on our admin page.
 */
add_action('admin_enqueue_scripts', function ($hook) {
    // WordPress derives the admin-page hook name as
    // 'tools_page_{menu_slug}'. Our menu slug is the same as the
    // plugin slug. Pre-1.2.0 this was checking 'tools_page_axle' which
    // never matched (the slug was always 'axle-accessibility-scanner'),
    // meaning the scanner JS may have been silently loaded on every
    // admin page. Fixed alongside the rename.
    if ($hook !== 'tools_page_asafamos-accessibility-scanner') return;

    $plugin_url = plugins_url('', __FILE__);
    wp_enqueue_script(
        'axle-axe-core',
        $plugin_url . '/axe.min.js',
        [],
        AXLE_VERSION,
        true
    );
    wp_enqueue_script(
        'axle-scan',
        $plugin_url . '/axle-scan.js',
        ['axle-axe-core'],
        AXLE_VERSION,
        true
    );
    $settings = get_option(AXLE_OPTION_SETTINGS, []);
    $target   = !empty($settings['target_url']) ? $settings['target_url'] : home_url('/');
    wp_localize_script('axle-scan', 'axleScanConfig', [
        'ajaxUrl'      => admin_url('admin-ajax.php'),
        'nonce'        => wp_create_nonce('axle_save_scan'),
        'targetUrl'    => $target,
    ]);

    // AI-fix button handler. Only does anything when the user clicks a row's
    // "Generate AI fix" button; nothing is sent on page load.
    wp_enqueue_script(
        'axle-fix',
        $plugin_url . '/axle-fix.js',
        [],
        AXLE_VERSION,
        true
    );
    wp_localize_script('axle-fix', 'axleFixConfig', [
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce'   => wp_create_nonce('axle_generate_fix'),
        'hasKey'  => !empty($settings['api_key']),
        'i18n'    => [
            'generate'     => __('Generate AI fix', 'asafamos-accessibility-scanner'),
            'generating'   => __('Generating…', 'asafamos-accessibility-scanner'),
            'hideFix'      => __('Hide fix', 'asafamos-accessibility-scanner'),
            'showFix'      => __('Show fix', 'asafamos-accessibility-scanner'),
            'ready'        => __('Fix generated.', 'asafamos-accessibility-scanner'),
            'explanation'  => __('What is wrong', 'asafamos-accessibility-scanner'),
            'strategy'     => __('How to fix it', 'asafamos-accessibility-scanner'),
            'before'       => __('Before', 'asafamos-accessibility-scanner'),
            'after'        => __('After', 'asafamos-accessibility-scanner'),
            'element'      => __('Element', 'asafamos-accessibility-scanner'),
            'confidence'   => __('Confidence', 'asafamos-accessibility-scanner'),
            'high'         => __('high', 'asafamos-accessibility-scanner'),
            'medium'       => __('medium', 'asafamos-accessibility-scanner'),
            'low'          => __('low', 'asafamos-accessibility-scanner'),
            'manualReview' => __('Review this fix before applying it. It may need a human decision.', 'asafamos-accessibility-scanner'),
            'applyNote'    => __('This is a code change for your theme, page builder or content. Apply it there, then run the scan again.', 'asafamos-accessibility-scanner'),
            /* translators: %d: number of free AI fixes left today */
            'freeLeft'     => __('Free AI fixes left today: %d', 'asafamos-accessibility-scanner'),
            'included'     => __('Included in your axle plan.', 'asafamos-accessibility-scanner'),
            'error'        => __('Could not generate a fix.', 'asafamos-accessibility-scanner'),
            'upgrade'      => __('Unlimited fixes: axle Site, $19/month', 'asafamos-accessibility-scanner'),
        ],
    ]);
});

function axle_render_admin_page() {
    if (!current_user_can('manage_options')) return;

    $settings  = get_option(AXLE_OPTION_SETTINGS, []);
    $last_scan = get_option(AXLE_OPTION_LAST_SCAN, null);
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('AsafAmos Accessibility Scanner', 'asafamos-accessibility-scanner'); ?></h1>
        <p>
            <?php esc_html_e('WCAG 2.1 / 2.2 AA compliance checks for this WordPress site. Built for EAA 2025, ADA, and תקנה 35.', 'asafamos-accessibility-scanner'); ?>
            <a href="https://axlescan.com?utm_source=axle-wordpress" target="_blank" rel="noopener">
                <?php esc_html_e('Learn more →', 'asafamos-accessibility-scanner'); ?>
            </a>
        </p>

        <h2><?php esc_html_e('Run a scan', 'asafamos-accessibility-scanner'); ?></h2>
        <p class="description">
            <?php esc_html_e('Scans run in your browser using axe-core 4.11. The target page is loaded in a hidden iframe. No data leaves your server.', 'asafamos-accessibility-scanner'); ?>
        </p>
        <p>
            <button id="axle-scan-now-btn" class="button button-primary">
                <?php esc_html_e('Scan now', 'asafamos-accessibility-scanner'); ?>
            </button>
            <span style="margin-left:10px" class="description">
                <?php
                /* translators: %s is the URL that will be scanned */
                echo esc_html(sprintf(__('Target: %s', 'asafamos-accessibility-scanner'), !empty($settings['target_url']) ? $settings['target_url'] : home_url('/')));
                ?>
            </span>
        </p>
        <p id="axle-scan-status" style="display:none" class="description"></p>
        <div id="axle-scan-frame-wrap" aria-hidden="true"></div>

        <?php axle_render_last_scan($last_scan); ?>

        <h2><?php esc_html_e('Settings', 'asafamos-accessibility-scanner'); ?></h2>
        <form method="post" action="options.php">
            <?php settings_fields('axle_settings_group'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="axle_target_url"><?php esc_html_e('Target URL', 'asafamos-accessibility-scanner'); ?></label></th>
                    <td>
                        <input type="url" id="axle_target_url" name="axle_settings[target_url]" class="regular-text"
                               value="<?php echo esc_attr($settings['target_url'] ?? home_url('/')); ?>" />
                        <p class="description"><?php esc_html_e('URL to scan. Defaults to the site home URL.', 'asafamos-accessibility-scanner'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="axle_auto_scan"><?php esc_html_e('Auto scan', 'asafamos-accessibility-scanner'); ?></label></th>
                    <td>
                        <select id="axle_auto_scan" name="axle_settings[auto_scan]">
                            <option value="off"   <?php selected($settings['auto_scan'] ?? 'off', 'off'); ?>><?php esc_html_e('Off', 'asafamos-accessibility-scanner'); ?></option>
                            <option value="daily" <?php selected($settings['auto_scan'] ?? 'off', 'daily'); ?>><?php esc_html_e('Daily (via WP-Cron, uses hosted scanner — requires public URL)', 'asafamos-accessibility-scanner'); ?></option>
                        </select>
                        <p class="description"><?php esc_html_e('Auto scan uses the hosted scanner at axlescan.com because WP-Cron runs without a browser. Works for public URLs only — for local/staging use the "Scan now" button.', 'asafamos-accessibility-scanner'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="axle_fail_on"><?php esc_html_e('Severity threshold', 'asafamos-accessibility-scanner'); ?></label></th>
                    <td>
                        <select id="axle_fail_on" name="axle_settings[fail_on]">
                            <?php foreach (['critical', 'serious', 'moderate', 'minor'] as $level): ?>
                                <option value="<?php echo esc_attr($level); ?>" <?php selected($settings['fail_on'] ?? 'serious', $level); ?>>
                                    <?php echo esc_html(ucfirst($level)); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php esc_html_e('Violations at or above this level are highlighted in red.', 'asafamos-accessibility-scanner'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="axle_api_key"><?php esc_html_e('axle API key (optional)', 'asafamos-accessibility-scanner'); ?></label></th>
                    <td>
                        <input type="password" id="axle_api_key" name="axle_settings[api_key]" class="regular-text"
                               value="<?php echo esc_attr($settings['api_key'] ?? ''); ?>" autocomplete="off" />
                        <p class="description">
                            <?php esc_html_e('Optional. With an axle Site key ($19/month) "Generate AI fix" is unlimited for one site; without one you get a few free fixes per day. The key is also sent with the optional daily hosted scan.', 'asafamos-accessibility-scanner'); ?>
                            <a href="https://axlescan.com/pricing?utm_source=axle-wordpress" target="_blank" rel="noopener"><?php esc_html_e('Get axle Site →', 'asafamos-accessibility-scanner'); ?></a>
                        </p>
                    </td>
                </tr>
            </table>
            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}

function axle_render_last_scan($last_scan) {
    if (!$last_scan) {
        echo '<p><em>' . esc_html__('No scans yet.', 'asafamos-accessibility-scanner') . '</em></p>';
        return;
    }

    $when = isset($last_scan['scanned_at'])
        ? human_time_diff($last_scan['scanned_at']) . ' ' . __('ago', 'asafamos-accessibility-scanner')
        : __('just now', 'asafamos-accessibility-scanner');
    $via = $last_scan['via'] ?? 'unknown';

    echo '<h2>' . esc_html__('Last scan', 'asafamos-accessibility-scanner') . '</h2>';
    echo '<p><strong>' . esc_html__('When:', 'asafamos-accessibility-scanner') . '</strong> ' . esc_html($when);
    if (!empty($last_scan['target'])) {
        echo ' &middot; <strong>' . esc_html__('Target:', 'asafamos-accessibility-scanner') . '</strong> ' . esc_html($last_scan['target']);
    }
    echo ' &middot; <strong>' . esc_html__('Via:', 'asafamos-accessibility-scanner') . '</strong> ' . esc_html($via === 'client-axe' ? 'browser (axe-core)' : 'hosted scanner');
    echo '</p>';

    if (!empty($last_scan['error'])) {
        echo '<div class="notice notice-error"><p><strong>' . esc_html__('Error:', 'asafamos-accessibility-scanner') . '</strong> ' . esc_html($last_scan['error']) . '</p></div>';
        return;
    }

    $result = $last_scan['result'] ?? null;
    if (!is_array($result) || empty($result['violations'])) {
        echo '<div class="notice notice-success"><p>' . esc_html__('No violations detected in the last scan.', 'asafamos-accessibility-scanner') . '</p></div>';
        return;
    }

    $summary = $result['summary'] ?? [];
    $total   = count($result['violations']);
    echo '<table class="widefat striped"><thead><tr>';
    echo '<th>' . esc_html__('Rule', 'asafamos-accessibility-scanner') . '</th>';
    echo '<th>' . esc_html__('Severity', 'asafamos-accessibility-scanner') . '</th>';
    echo '<th>' . esc_html__('Nodes', 'asafamos-accessibility-scanner') . '</th>';
    echo '<th>' . esc_html__('Help', 'asafamos-accessibility-scanner') . '</th>';
    echo '<th>' . esc_html__('Fix', 'asafamos-accessibility-scanner') . '</th>';
    echo '</tr></thead><tbody>';
    // array_values: the AJAX handler addresses violations by position in the
    // same re-indexed list, so the data-violation index must match it.
    foreach (array_values($result['violations']) as $i => $v) {
        $impact  = isset($v['impact']) ? (string) $v['impact'] : 'unknown';
        $nodes   = isset($v['nodes']) && is_array($v['nodes']) ? count($v['nodes']) : 0;
        $id      = isset($v['id']) ? (string) $v['id'] : '';
        $helpUrl = isset($v['helpUrl']) ? (string) $v['helpUrl'] : '';
        $help    = isset($v['help']) ? (string) $v['help'] : '';
        echo '<tr>';
        echo '<td><code>' . esc_html($id) . '</code><br><small>' . esc_html($help) . '</small></td>';
        echo '<td>' . esc_html($impact) . '</td>';
        echo '<td>' . (int) $nodes . '</td>';
        echo '<td>';
        if ($helpUrl) {
            echo '<a href="' . esc_url($helpUrl) . '" target="_blank" rel="noopener">';
            esc_html_e('axe-core docs →', 'asafamos-accessibility-scanner');
            echo '</a>';
        } else {
            echo '—';
        }
        echo '</td>';
        echo '<td>';
        if ($nodes > 0) {
            printf(
                '<button type="button" class="button button-small axle-fix-btn" data-violation="%1$d" data-node="0" aria-expanded="false" aria-controls="%2$s">%3$s</button>',
                (int) $i,
                esc_attr('axle-fix-panel-' . (int) $i),
                esc_html__('Generate AI fix', 'asafamos-accessibility-scanner')
            );
        } else {
            echo '—';
        }
        echo '</td>';
        echo '</tr>';
        if ($nodes > 0) {
            printf(
                '<tr class="axle-fix-row" id="%1$s" hidden><td colspan="5"><div class="axle-fix-body" role="region" aria-live="polite" aria-label="%2$s"></div></td></tr>',
                esc_attr('axle-fix-panel-' . (int) $i),
                /* translators: %s: axe-core rule id */
                esc_attr(sprintf(__('AI fix for %s', 'asafamos-accessibility-scanner'), $id))
            );
        }
    }
    echo '</tbody></table>';

    // Disclosure next to the buttons: this is the plugin's only off-site call.
    echo '<p class="description">' . esc_html__('"Generate AI fix" sends the rule and the HTML of one affected element (up to 500 characters) to axlescan.com, which uses Claude to suggest a code change. Nothing is sent unless you click it. A few fixes per day are free; with an axle Site key in Settings they are unlimited.', 'asafamos-accessibility-scanner') . '</p>';

    echo '<p class="description">' . esc_html(sprintf(
        /* translators: 1: total rule count, 2: critical-impact node count, 3: serious-impact node count, 4: moderate-impact node count, 5: minor-impact node count */
        __('Total: %1$d rule(s). Critical: %2$d · Serious: %3$d · Moderate: %4$d · Minor: %5$d', 'asafamos-accessibility-scanner'),
        $total,
        isset($summary['critical']) ? (int) $summary['critical'] : 0,
        isset($summary['serious'])  ? (int) $summary['serious']  : 0,
        isset($summary['moderate']) ? (int) $summary['moderate'] : 0,
        isset($summary['minor'])    ? (int) $summary['minor']    : 0
    )) . '</p>';

    // Optional upgrade prompt, shown only when violations exist (this function
    // has already returned for the no-violations and error paths above). Links
    // to the hosted axle Site plan, which turns each violation above into a
    // code-level fix. Kept to a single inline info box on the plugin's own
    // page — no global admin notices, no tracking, no auto-dismiss nagging.
    echo '<div class="notice notice-info inline" style="margin-top:14px">';
    echo '<p><strong>' . esc_html__('Want these fixed?', 'asafamos-accessibility-scanner') . '</strong> ';
    echo esc_html__('Use "Generate AI fix" on any row. A few fixes per day are free; the axle Site plan ($19/month) makes them unlimited for one site. Fixes are code changes that someone needs to apply to your theme or content.', 'asafamos-accessibility-scanner');
    echo ' <a href="https://axlescan.com/pricing?utm_source=axle-wordpress-scan" target="_blank" rel="noopener">';
    esc_html_e('See axle Site →', 'asafamos-accessibility-scanner');
    echo '</a></p></div>';
}
