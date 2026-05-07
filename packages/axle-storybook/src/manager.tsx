/**
 * The "manager" side of the addon — runs in Storybook's chrome,
 * registers the panel that shows scan results. Communicates with
 * the preview via the addon channel.
 */
import React, { useEffect, useState } from "react";
import { addons, types } from "storybook/manager-api";
import { Badge, Placeholder } from "storybook/internal/components";

import { ADDON_ID, PANEL_ID, EVENTS } from "./constants";
import type { ScanResult } from "./types";

addons.register(ADDON_ID, () => {
  addons.add(PANEL_ID, {
    title: ({ active }) => <PanelTitle active={!!active} />,
    type: types.PANEL,
    paramKey: "axle",
    render: ({ active }) => (active ? <Panel /> : null),
  });
});

function PanelTitle({ active }: { active: boolean }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    const channel = addons.getChannel();
    const onResult = (result: ScanResult) => setCount(result.violations.length);
    const onRunning = () => setCount(null);
    channel.on(EVENTS.RESULT, onResult);
    channel.on(EVENTS.RUNNING, onRunning);
    return () => {
      channel.off(EVENTS.RESULT, onResult);
      channel.off(EVENTS.RUNNING, onRunning);
    };
  }, []);
  return (
    <span>
      a11y / WCAG{" "}
      {count === null ? null : (
        <Badge status={count === 0 ? "positive" : "warning"}>{count}</Badge>
      )}
    </span>
  );
}

type PanelState =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "done"; result: ScanResult }
  | { kind: "error"; message: string };

function Panel() {
  const [state, setState] = useState<PanelState>({ kind: "idle" });

  useEffect(() => {
    const channel = addons.getChannel();
    const onRunning = () => setState({ kind: "running" });
    const onResult = (result: ScanResult) => setState({ kind: "done", result });
    const onError = (message: string) => setState({ kind: "error", message });
    channel.on(EVENTS.RUNNING, onRunning);
    channel.on(EVENTS.RESULT, onResult);
    channel.on(EVENTS.ERROR, onError);
    return () => {
      channel.off(EVENTS.RUNNING, onRunning);
      channel.off(EVENTS.RESULT, onResult);
      channel.off(EVENTS.ERROR, onError);
    };
  }, []);

  if (state.kind === "idle") {
    return (
      <Placeholder>
        <span>Waiting for the first scan…</span>
        <span>
          axle runs axe-core 4.11 against every story. Switch stories
          to trigger a scan.
        </span>
      </Placeholder>
    );
  }

  if (state.kind === "running") {
    return (
      <Placeholder>
        <span>Scanning…</span>
      </Placeholder>
    );
  }

  if (state.kind === "error") {
    return (
      <Placeholder>
        <span>Scan failed</span>
        <span>{state.message}</span>
      </Placeholder>
    );
  }

  const { violations, passes } = state.result;
  if (violations.length === 0) {
    return (
      <Placeholder>
        <span>✓ No WCAG 2.2 AA violations</span>
        <span>
          {passes} checks passed against the rendered story. Powered by
          axe-core 4.11. Same engine as the axle GitHub Action.
        </span>
      </Placeholder>
    );
  }

  return (
    <div style={{ padding: "12px 16px", overflow: "auto" }}>
      <p style={{ fontSize: 13, marginTop: 0, marginBottom: 16 }}>
        <strong>{violations.length}</strong>{" "}
        {violations.length === 1 ? "violation" : "violations"} ·{" "}
        <span style={{ color: "var(--color-positive, #1ea7fd)" }}>
          {passes} passes
        </span>
      </p>

      {violations.map((v) => (
        <article
          key={v.id}
          style={{
            border: "1px solid var(--app-border-color, #e6e6e6)",
            borderRadius: 4,
            padding: "12px 16px",
            marginBottom: 10,
          }}
        >
          <header
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 8,
              marginBottom: 6,
            }}
          >
            <ImpactBadge impact={v.impact} />
            <code style={{ fontSize: 13, fontWeight: 600 }}>{v.id}</code>
          </header>
          <p style={{ fontSize: 13, margin: "4px 0" }}>{v.help}</p>
          <p style={{ fontSize: 11, color: "#888", margin: "4px 0" }}>
            {(v.tags ?? [])
              .filter((t: string) => t.startsWith("wcag"))
              .join(" · ")}
            {" — "}
            {v.nodes.length} {v.nodes.length === 1 ? "element" : "elements"}
          </p>
          {v.helpUrl ? (
            <a
              href={v.helpUrl}
              target="_blank"
              rel="noopener"
              style={{ fontSize: 12 }}
            >
              Rule docs →
            </a>
          ) : null}
        </article>
      ))}
    </div>
  );
}

function ImpactBadge({ impact }: { impact: string | null | undefined }) {
  const colors: Record<string, [string, string]> = {
    critical: ["#b91c1c", "#fff"],
    serious: ["#c2410c", "#fff"],
    moderate: ["#ca8a04", "#000"],
    minor: ["#2563eb", "#fff"],
  };
  const [bg, fg] = colors[impact ?? "minor"] ?? colors.minor;
  return (
    <span
      style={{
        background: bg,
        color: fg,
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
      }}
    >
      {impact ?? "minor"}
    </span>
  );
}
