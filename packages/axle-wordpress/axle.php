<?php
/**
 * Plugin Name: axle — Accessibility Compliance CI
 * Plugin URI:  https://axle-iota.vercel.app?utm_source=axle-wordpress
 * Description: Scan this WordPress site for WCAG 2.1 / 2.2 AA accessibility violations. Built for EAA 2025 / ADA / תקנה 35. No overlay widgets, no tracking.
 * Version:     1.0.0
 * Requires at least: 5.8
 * Requires PHP: 7.4
 * Author:      axle
 * Author URI:  https://axle-iota.vercel.app?utm_source=axle-wordpress
 * License:     MIT
 * License URI: https://opensource.org/licenses/MIT
 * Text Domain: axle
 *
 * axle scans your site via a hosted headless browser running axe-core 4.11,
 * then stores the results. You review violations in Tools → axle. Optional
 * daily cron re-scans. Nothing is injected into your public pages.
 */

if (!defined('ABSPATH')) { exit; }

define('AXLE_VERSION', '1.0.0');
define('AXLE_API_BASE', 'https://axle-iota.vercel.app');
define('AXLE_OPTION_SETTINGS', 'axle_settings');
define('AXLE_OPTION_LAST_SCAN', 'axle_last_scan');
define('AXLE_CRON_HOOK', 'axle_daily_scan');

/**
 * Activation: seed default settings. No cron is scheduled and no external
 * request is made here — wordpress.org policy requires user action before
 * calling external services. The user opts in by setting Auto scan = Daily
 * in Tools → axle → Settings, which triggers axle_reschedule_cron().
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

/**
 * Deactivation / uninstall: unschedule the cron. Settings are preserved so
 * re-activation resumes the same config.
 */
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

// Update the cron when the setting changes.
add_action('update_option_' . AXLE_OPTION_SETTINGS, function ($old, $new) {
    $old_auto = is_array($old) ? ($old['auto_scan'] ?? 'off') : 'off';
    $new_auto = is_array($new) ? ($new['auto_scan'] ?? 'off') : 'off';
    if ($old_auto !== $new_auto) {
        axle_reschedule_cron($new_auto);
    }
}, 10, 2);

/**
 * Admin menu entry under Tools → axle.
 */
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
    $out['auto_scan']  = in_array($input['auto_scan'] ?? 'daily', ['off', 'daily'], true) ? $input['auto_scan'] : 'daily';
    $out['fail_on']    = in_array($input['fail_on']   ?? 'serious', ['critical', 'serious', 'moderate', 'minor'], true) ? $input['fail_on'] : 'serious';
    return $out;
}

/**
 * Handle the "Scan now" POST, then redirect back to the admin page.
 */
add_action('admin_post_axle_scan_now', function () {
    if (!current_user_can('manage_options')) { wp_die(__('Unauthorized', 'axle'), 403); }
    check_admin_referer('axle_scan_now');
    $result = axle_run_scan();
    $status = is_wp_error($result) ? 'error' : 'ok';
    wp_redirect(add_query_arg(['page' => 'axle', 'axle_status' => $status], admin_url('tools.php')));
    exit;
});

/**
 * Daily cron handler. Fire-and-forget — errors are stored for later review.
 */
add_action(AXLE_CRON_HOOK, function () {
    $settings = get_option(AXLE_OPTION_SETTINGS, []);
    if (($settings['auto_scan'] ?? 'daily') !== 'daily') return;
    axle_run_scan();
});

/**
 * Core scan call. Posts to axle's hosted scanner with source=axle-wordpress
 * so usage shows up in our analytics. Stores the latest result in wp_options.
 * Returns WP_Error on network failure or API error; scan data otherwise.
 */
function axle_run_scan() {
    $settings = get_option(AXLE_OPTION_SETTINGS, []);
    $target   = !empty($settings['target_url']) ? $settings['target_url'] : home_url('/');
    $api_key  = $settings['api_key'] ?? '';

    $headers = ['Content-Type' => 'application/json'];
    if ($api_key) {
        $headers['Authorization'] = 'Bearer ' . $api_key;
    }

    $response = wp_remote_post(AXLE_API_BASE . '/api/scan', [
        'timeout' => 60,
        'headers' => $headers,
        'body'    => wp_json_encode([
            'url'    => $target,
            'source' => 'axle-wordpress',
        ]),
    ]);

    if (is_wp_error($response)) {
        update_option(AXLE_OPTION_LAST_SCAN, [
            'error'      => $response->get_error_message(),
            'scanned_at' => time(),
            'target'     => $target,
        ]);
        return $response;
    }

    $code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($code >= 400) {
        $message = is_array($body) && !empty($body['error'])
            ? $body['error']
            : sprintf(__('Scan failed (HTTP %d)', 'axle'), $code);
        update_option(AXLE_OPTION_LAST_SCAN, [
            'error'      => $message,
            'http_code'  => $code,
            'scanned_at' => time(),
            'target'     => $target,
        ]);
        return new WP_Error('axle_api_error', $message);
    }

    update_option(AXLE_OPTION_LAST_SCAN, [
        'result'     => $body,
        'scanned_at' => time(),
        'target'     => $target,
    ]);
    return $body;
}

/**
 * Render the admin page: settings form, "scan now" button, last scan summary.
 */
function axle_render_admin_page() {
    if (!current_user_can('manage_options')) return;

    $settings  = get_option(AXLE_OPTION_SETTINGS, []);
    $last_scan = get_option(AXLE_OPTION_LAST_SCAN, null);
    $status    = isset($_GET['axle_status']) ? sanitize_key($_GET['axle_status']) : null;
    ?>
    <div class="wrap">
        <h1><?php esc_html_e('axle — Accessibility Scanner', 'axle'); ?></h1>
        <p>
            <?php esc_html_e('WCAG 2.1 / 2.2 AA compliance checks for this WordPress site. Built for EAA 2025, ADA, and תקנה 35.', 'axle'); ?>
            <a href="https://axle-iota.vercel.app?utm_source=axle-wordpress" target="_blank" rel="noopener">
                <?php esc_html_e('Learn more →', 'axle'); ?>
            </a>
        </p>

        <?php if ($status === 'ok'): ?>
            <div class="notice notice-success is-dismissible"><p><?php esc_html_e('Scan completed.', 'axle'); ?></p></div>
        <?php elseif ($status === 'error'): ?>
            <div class="notice notice-error is-dismissible"><p><?php esc_html_e('Scan failed. See details below.', 'axle'); ?></p></div>
        <?php endif; ?>

        <h2><?php esc_html_e('Run a scan', 'axle'); ?></h2>
        <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
            <?php wp_nonce_field('axle_scan_now'); ?>
            <input type="hidden" name="action" value="axle_scan_now" />
            <?php submit_button(__('Scan now', 'axle'), 'primary', 'submit', false); ?>
            <span class="description" style="margin-left:10px">
                <?php echo esc_html(sprintf(__('Target: %s', 'axle'), $settings['target_url'] ?? home_url('/'))); ?>
            </span>
        </form>

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
                            <option value="daily" <?php selected($settings['auto_scan'] ?? 'daily', 'daily'); ?>><?php esc_html_e('Daily (via WP-Cron)', 'axle'); ?></option>
                            <option value="off"   <?php selected($settings['auto_scan'] ?? 'daily', 'off'); ?>><?php esc_html_e('Off', 'axle'); ?></option>
                        </select>
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

    echo '<h2>' . esc_html__('Last scan', 'axle') . '</h2>';
    echo '<p><strong>' . esc_html__('When:', 'axle') . '</strong> ' . esc_html($when);
    if (!empty($last_scan['target'])) {
        echo ' &middot; <strong>' . esc_html__('Target:', 'axle') . '</strong> ' . esc_html($last_scan['target']);
    }
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
        $summary['critical'] ?? 0,
        $summary['serious']  ?? 0,
        $summary['moderate'] ?? 0,
        $summary['minor']    ?? 0
    )) . '</p>';
}
