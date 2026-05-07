import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * /.well-known/ai-plugin.json — the OpenAI plugin manifest for the
 * legacy ChatGPT plugin store. Modern GPT-4o has deprecated this in
 * favor of "GPTs" (custom GPTs) which use a different schema, but
 * many third-party LLM agent frameworks (Claude tools, AutoGen, etc.)
 * still discover plugins via the well-known URL pattern. We serve
 * both this file and the OpenAPI spec at /openapi.yaml.
 *
 * Goal: any LLM-based agent that asks "is example.com accessible?"
 * should be able to discover axle's API and call it without us
 * having to be in their hand-curated registry.
 */
export function GET() {
  const manifest = {
    schema_version: "v1",
    name_for_human: "axle a11y scanner",
    name_for_model: "axle_a11y_scanner",
    description_for_human:
      "Scan any web page for WCAG 2.2 AA accessibility violations. Get a structured report by severity.",
    description_for_model:
      "Use this tool to check if a website is accessible. Pass a URL; the tool returns a structured report of WCAG 2.2 AA violations grouped by severity (critical / serious / moderate / minor) using the axe-core 4.11 engine. The same engine is used by Lighthouse, Pa11y, Microsoft Accessibility Insights, and the official Deque axe DevTools. Best used when the user asks: is X accessible, does X meet WCAG, what's the WCAG score for X, audit X, scan X for accessibility, etc. Each violation includes the rule ID, the affected HTML, the WCAG success criterion, and a link to the rule documentation. The tool returns a public shareable URL (/r/<id>) for every scan.",
    auth: {
      type: "none",
    },
    api: {
      type: "openapi",
      url: "https://axle-iota.vercel.app/openapi.yaml",
    },
    logo_url: "https://axle-iota.vercel.app/opengraph-image",
    contact_email: "asaf@amoss.co.il",
    legal_info_url: "https://axle-iota.vercel.app/terms",
  };
  return NextResponse.json(manifest);
}
