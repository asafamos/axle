/**
 * Constants shared between manager (Storybook UI side) and preview
 * (where the story is rendered + scanned). The addon ID is the
 * canonical identifier — Storybook uses it to register the panel,
 * dispatch events, and namespace storage.
 */
export const ADDON_ID = "axle-a11y";
export const PANEL_ID = `${ADDON_ID}/panel`;
export const PARAM_KEY = "axle";

// Events the preview emits when a scan completes / fails.
export const EVENTS = {
  RESULT: `${ADDON_ID}/result`,
  ERROR: `${ADDON_ID}/error`,
  RUNNING: `${ADDON_ID}/running`,
} as const;
