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
  // The site moved to axlescan.com, but axle-iota.vercel.app is still attached
  // to this project and already has pages in Google's index. Without a redirect
  // it keeps serving a full duplicate at 200, so search traffic lands there and
  // ranking signals never consolidate on the new domain. Send every page
  // permanently (308) to the same path on axlescan.com. /api/* is deliberately
  // excluded: the published WordPress plugin (<= 1.2.3), README badges and other
  // integrations call the old host's API directly and must keep working.
  async redirects() {
    return [
      {
        source: "/:path((?!api(?:/|$)).*)",
        has: [{ type: "host", value: "axle-iota.vercel.app" }],
        destination: "https://axlescan.com/:path",
        permanent: true,
      },
      // www is attached to the project too and used to serve the whole site at
      // 200 (canonical pointed at the apex, so it was harmless but still a second
      // host for the same content). Send it to the apex, paths and query intact.
      // Nothing in this repo calls www directly (checked), and 308 preserves the
      // request method, so this includes /api.
      {
        source: "/:path(.*)",
        has: [{ type: "host", value: "www.axlescan.com" }],
        destination: "https://axlescan.com/:path",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
