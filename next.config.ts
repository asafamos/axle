import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack resolves modules from THIS project,
  // not an ancestor. Without this, a stray lockfile in a parent dir (e.g. an
  // accidental `npm install` in $HOME) makes Turbopack infer the wrong root
  // and fail to resolve tailwindcss / other deps. See node_modules/next/dist/
  // docs/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md.
  turbopack: {
    root: __dirname,
  },
  // Vercel serverless bundles only what the tracer sees. axe-core is read
  // at runtime from a file path (readFileSync), so trace it explicitly.
  outputFileTracingIncludes: {
    "/api/scan": [
      "./node_modules/axe-core/axe.min.js",
      "./node_modules/@sparticuz/chromium/**",
    ],
  },
  // playwright-core + @sparticuz/chromium must be left unbundled in the
  // server runtime so their internal file paths still resolve.
  serverExternalPackages: ["@sparticuz/chromium", "playwright-core"],
};

export default nextConfig;
