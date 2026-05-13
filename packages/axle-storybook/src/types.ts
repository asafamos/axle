import type { AxeResults, ImpactValue } from "axe-core";

export type AxleStorybookParameters = {
  /**
   * Disable the addon for a specific story / component.
   * Useful for stories whose violations are intentional (axe rule
   * tests, accessibility-failure documentation, etc.).
   */
  disable?: boolean;
  /**
   * axe-core options forwarded to axe.run(). Tags / rules can be
   * configured per-story.
   */
  options?: {
    runOnly?: { type: "tag" | "rule"; values: string[] };
    rules?: Record<string, { enabled: boolean }>;
  };
  /**
   * Severity threshold below which violations are treated as
   * informational (still shown, but don't trigger the warning
   * indicator on the panel tab).
   */
  failOn?: ImpactValue;
};

export type ScanResult = {
  url: string; // window.location.href at scan time
  scannedAt: number;
  violations: AxeResults["violations"];
  passes: number;
  inapplicable: number;
};
