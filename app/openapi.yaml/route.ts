import { NextResponse } from "next/server";

export const runtime = "edge";

/**
 * /openapi.yaml — OpenAPI 3.0 spec for the public axle scan endpoint.
 * Discovered automatically by:
 *   - LLM agent frameworks that probe /.well-known/ai-plugin.json
 *     and follow the api.url pointer.
 *   - ChatGPT GPT builders ("Add Action" → import via URL).
 *   - Claude / Anthropic Tool Use users who paste this URL into
 *     their tool config UI.
 *   - mcp-server bridge tools.
 *
 * We serve YAML (not JSON) because most agent frameworks default to
 * looking for the YAML form. JSON is offered separately at
 * /openapi.json if anyone needs it (TODO: add when first ask).
 */
export function GET() {
  const yaml = `openapi: 3.0.1
info:
  title: axle a11y / WCAG scanner
  description: |
    Scan any public URL for WCAG 2.2 AA accessibility violations using axe-core 4.11.
    Returns a structured report grouped by severity, plus a public shareable URL
    (/r/<id>) that anyone can open to see the result.

    Used as a tool by ChatGPT GPTs, Claude tool-use applications, and any
    agent framework that wants to answer "is this website accessible?".
  version: "1.0.0"
  contact:
    email: asaf@amoss.co.il
  license:
    name: MIT (extension code) / proprietary (hosted scan service)
    url: https://axle-iota.vercel.app/terms
servers:
  - url: https://axle-iota.vercel.app
    description: Production hosted axle scanner
paths:
  /api/scan:
    post:
      operationId: scanUrlForAccessibility
      summary: Scan a URL for WCAG 2.2 AA accessibility violations
      description: |
        Renders the URL in headless Chromium, runs axe-core 4.11 against the
        rendered DOM, and returns the full violation report. The scan also
        produces a public shareable URL at /r/<result_id> with a custom OG image.

        Free tier: 5 scans per day per IP. With an axle API key (Bearer token)
        the rate limit is removed.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [url]
              properties:
                url:
                  type: string
                  format: uri
                  description: The public URL to scan. Must be http or https. Internal hostnames (localhost, *.local, *.test) are rejected.
                  example: "https://example.com"
                source:
                  type: string
                  description: Optional client identifier — used by axle to track which surface drove the scan. Pass your tool name (e.g., "claude-tool", "openai-gpt", "vscode").
                  example: "claude-tool"
      responses:
        '200':
          description: Scan completed
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ScanResult'
        '400':
          description: Invalid URL or scan failed
        '429':
          description: Rate-limited (free tier exceeded)
components:
  schemas:
    ScanResult:
      type: object
      properties:
        url:
          type: string
        scanned_at:
          type: string
          format: date-time
        engine:
          type: string
          example: "axe-core@4.11.3"
        result_id:
          type: string
          description: Opaque identifier for the public scan result page
          example: "9Af5ha3B7MocgpMf"
        permalink:
          type: string
          description: Path on axle-iota.vercel.app where the public result is rendered
          example: "/r/9Af5ha3B7MocgpMf"
        summary:
          type: object
          properties:
            violations:
              type: integer
            critical:
              type: integer
            serious:
              type: integer
            moderate:
              type: integer
            minor:
              type: integer
        violations:
          type: array
          items:
            $ref: '#/components/schemas/Violation'
    Violation:
      type: object
      properties:
        id:
          type: string
          description: axe-core rule ID
          example: "color-contrast"
        impact:
          type: string
          enum: [critical, serious, moderate, minor]
        help:
          type: string
          description: Plain-English summary of the violation
        helpUrl:
          type: string
          format: uri
        tags:
          type: array
          items:
            type: string
          description: WCAG success criteria + standard tags (e.g., wcag2aa, wcag143)
        nodes:
          type: array
          items:
            type: object
            properties:
              html:
                type: string
              target:
                type: array
                items:
                  type: string
              failureSummary:
                type: string
`;
  return new NextResponse(yaml, {
    status: 200,
    headers: {
      "Content-Type": "application/yaml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
