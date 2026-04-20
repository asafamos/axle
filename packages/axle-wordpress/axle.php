<?php
/**
 * Plugin Name: axle — Accessibility Compliance CI
 * Plugin URI:  https://github.com/asafamos/axle/tree/main/packages/axle-wordpress
 * Description: Scan this WordPress site for WCAG 2.1 / 2.2 AA accessibility violations. Built for EAA 2025 / ADA / תקנה 35. No overlay widgets, no tracking. Scans run locally in your browser.
 * Version:     1.1.0
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author:      axle
 * Author URI:  https://axle-iota.vercel.app?utm_source=axle-wordpress
 * License:     MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: axle
 *
 * Architecture: 1.1.0 scans client-side via axe-core loaded in a hidden
 * iframe. This works for any environment — LocalWP, staging with basic auth,
 * VPN-only production — without relying on a hosted scanner that can't
 * resolve private hostnames. See axle-scan.js for the runner.
 */

if (!defined('ABSPATH')) { exit; }

define('AXLE_VERSION', '1.1.0');
define('AXLE_API_BASE', 'https://axle-iota.vercel.app');
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
            : sprintf(__('Scan failed (HTTP %d)', 'axle'), $code);
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
        __('axle — Accessibility Scanner', 'axle'),
        'axle',
        'manage_options',
        'axle',
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
                'html'           => isset($n['html']) ? wp_kses_post(substr((string) $n['html'], 0, 500)) : '',
                'target'         => array_map('sanitize_text_field', (array) ($n['target'] ?? [])),
                'failureSummary' => isset($n['failureSummary']) ? sanitize_textarea_field((string) $n['failureSummary']) : '',
            ];
        }
        $out[] = [
            'id'          => sanitize_key($v['id'] ?? ''),
            'impact'      => $impact,
            'help'        => sanitize_text_field((string) ($v['help'] ?? '')),
            'helpUrl'     => esc_url_raw((string) ($v['helpUrl'] ?? '')),
            'description' => sanitize_text_field((string) ($v['description'] ?? '')),
            'nodes'       => $nodes,
        ];
    }
    return $out;
}

/**
 * Enqueue axe-core + the scanner glue script, only on our admin page.
 */
add_action('admin_enqueue_scripts', function ($hook) {
    // 'tools_page_axle' is the hook ID for the Tools → axle page.
    if ($hook !== 'tools_page_axle') return;

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
        'telemetryUrl' => AXLE_API_BASE . '/api/track',
    ]);
});

function axle_render_admin_page() {
    if (!current_user_can('manage_options')) return;

    $settings  = get_option(AXLE_OPTION_SETTINGS, []);
    $last_scan = get_option(AXLE_OPTION_LAST_SCAN, null);
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('axle — Accessibility Scanner', 'axle'); ?></h1>
        <p>
            <?php esc_html_e('WCAG 2.1 / 2.2 AA compliance checks for this WordPress site. Built for EAA 2025, ADA, and תקנה 35.', 'axle'); ?>
            <a href="https://axle-iota.vercel.app?utm_source=axle-wordpress" target="_blank" rel="noopener">
                <?php esc_html_e('Learn more →', 'axle'); ?>
            </a>
        </p>

        <h2><?php esc_html_e('Run a scan', 'axle'); ?></h2>
        <p class="description">
            <?php esc_html_e('Scans run in your browser using axe-core 4.11. The target page is loaded in a hidden iframe. No data leaves your server.', 'axle'); ?>
        </p>
        <p>
            <button id="axle-scan-now-btn" class="button button-primary">
                <?php esc_html_e('Scan now', 'axle'); ?>
            </button>
            <span style="margin-left:10px" class="description">
                <?php echo esc_html(sprintf(__('Target: %s', 'axle'), !empty($settings['target_url']) ? $settings['target_url'] : home_url('/'))); ?>
            </span>
        </p>
        <p id="axle-scan-status" style="display:none" class="description"></p>
        <div id="axle-scan-frame-wrap" aria-hidden="true"></div>

        <?php axle_render_last_scan($last_scan); ?>

        <h2><?php esc_html_e('Settings', 'axle'); ?></h2>
        <form method="post" action="options.php">
            <?php settings_fields('axle_settings_group'); ?>
            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><label for="axle_target_url"><?php esc_html_e('Target URL', 'axle'); ?></label></th>
                    <td>
                        <input type="url" id="axle_target_url" name="axle_settings[target_url]" class="regular-text"
                               value="<?php echo esc_attr($settings['target_url'] ?? home_url('/')); ?>" />
                        <p class="description"><?php esc_html_e('URL to scan. Defaults to the site home URL.', 'axle'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="axle_auto_scan"><?php esc_html_e('Auto scan', 'axle'); ?></label></th>
                    <td>
                        <select id="axle_auto_scan" name="axle_settings[auto_scan]">
                            <option value="off"   <?php selected($settings['auto_scan'] ?? 'off', 'off'); ?>><?php esc_html_e('Off', 'axle'); ?></option>
                            <option value="daily" <?php selected($settings['auto_scan'] ?? 'off', 'daily'); ?>><?php esc_html_e('Daily (via WP-Cron, uses hosted scanner — requires public URL)', 'axle'); ?></option>
                        </select>
                        <p class="description"><?php esc_html_e('Auto scan uses the hosted scanner at axle-iota.vercel.app because WP-Cron runs without a browser. Works for public URLs only — for local/staging use the "Scan now" button.', 'axle'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="axle_fail_on"><?php esc_html_e('Severity threshold', 'axle'); ?></label></th>
                    <td>
                        <select id="axle_fail_on" name="axle_settings[fail_on]">
                            <?php foreach (['critical', 'serious', 'moderate', 'minor'] as $level): ?>
                                <option value="<?php echo esc_attr($level); ?>" <?php selected($settings['fail_on'] ?? 'serious', $level); ?>>
                                    <?php echo esc_html(ucfirst($level)); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                        <p class="description"><?php esc_html_e('Violations at or above this level are highlighted in red.', 'axle'); ?></p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="axle_api_key"><?php esc_html_e('axle API key (optional)', 'axle'); ?></label></th>
                    <td>
                        <input type="password" id="axle_api_key" name="axle_settings[api_key]" class="regular-text"
                               value="<?php echo esc_attr($settings['api_key'] ?? ''); ?>" autocomplete="off" />
                        <p class="description">
                            <?php esc_html_e('Paid plan unlocks AI fix suggestions. Leave empty for the free tier.', 'axle'); ?>
                            <a href="https://axle-iota.vercel.app/#pricing?utm_source=axle-wordpress" target="_blank" rel="noopener"><?php esc_html_e('Get a key →', 'axle'); ?></a>
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
        echo '<p><em>' . esc_html__('No scans yet.', 'axle') . '</em></p>';
        return;
    }

    $when = isset($last_scan['scanned_at'])
        ? human_time_diff($last_scan['scanned_at']) . ' ' . __('ago', 'axle')
        : __('just now', 'axle');
    $via = $last_scan['via'] ?? 'unknown';

    echo '<h2>' . esc_html__('Last scan', 'axle') . '</h2>';
    echo '<p><strong>' . esc_html__('When:', 'axle') . '</strong> ' . esc_html($when);
    if (!empty($last_scan['target'])) {
        echo ' &middot; <strong>' . esc_html__('Target:', 'axle') . '</strong> ' . esc_html($last_scan['target']);
    }
    echo ' &middot; <strong>' . esc_html__('Via:', 'axle') . '</strong> ' . esc_html($via === 'client-axe' ? 'browser (axe-core)' : 'hosted scanner');
    echo '</p>';

    if (!empty($last_scan['error'])) {
        echo '<div class="notice notice-error"><p><strong>' . esc_html__('Error:', 'axle') . '</strong> ' . esc_html($last_scan['error']) . '</p></div>';
        return;
    }

    $result = $last_scan['result'] ?? null;
    if (!is_array($result) || empty($result['violations'])) {
        echo '<div class="notice notice-success"><p>' . esc_html__('No violations detected in the last scan.', 'axle') . '</p></div>';
        return;
    }

    $summary = $result['summary'] ?? [];
    $total   = count($result['violations']);
    echo '<table class="widefat striped"><thead><tr>';
    echo '<th>' . esc_html__('Rule', 'axle') . '</th>';
    echo '<th>' . esc_html__('Severity', 'axle') . '</th>';
    echo '<th>' . esc_html__('Nodes', 'axle') . '</th>';
    echo '<th>' . esc_html__('Help', 'axle') . '</th>';
    echo '</tr></thead><tbody>';
    foreach ($result['violations'] as $v) {
        $impact = isset($v['impact']) ? esc_html($v['impact']) : 'unknown';
        $nodes  = isset($v['nodes']) && is_array($v['nodes']) ? count($v['nodes']) : 0;
        $id     = isset($v['id']) ? esc_html($v['id']) : '';
        $helpUrl= isset($v['helpUrl']) ? esc_url($v['helpUrl']) : '';
        $help   = isset($v['help']) ? esc_html($v['help']) : '';
        echo '<tr>';
        echo '<td><code>' . $id . '</code><br><small>' . $help . '</small></td>';
        echo '<td>' . $impact . '</td>';
        echo '<td>' . (int) $nodes . '</td>';
        echo '<td>' . ($helpUrl ? '<a href="' . $helpUrl . '" target="_blank" rel="noopener">axe-core docs →</a>' : '—') . '</td>';
        echo '</tr>';
    }
    echo '</tbody></table>';

    echo '<p class="description">' . esc_html(sprintf(
        __('Total: %d rule(s). Critical: %d · Serious: %d · Moderate: %d · Minor: %d', 'axle'),
        $total,
        isset($summary['critical']) ? (int) $summary['critical'] : 0,
        isset($summary['serious'])  ? (int) $summary['serious']  : 0,
        isset($summary['moderate']) ? (int) $summary['moderate'] : 0,
        isset($summary['minor'])    ? (int) $summary['minor']    : 0
    )) . '</p>';
}
