import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
