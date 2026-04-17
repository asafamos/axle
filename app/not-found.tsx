import Link from "next/link";

export const metadata = {
  title: "404 — page not found",
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-20">
      <div className="max-w-lg text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Error 404
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          This page isn't WCAG-compliant, because it doesn't exist.
        </h1>
        <p className="mt-4 text-slate-600">
          Good news: pages you do have can still get scanned for accessibility in 15 seconds.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Scan a URL
          </Link>
          <Link
            href="/statement"
            className="rounded-md border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Free Hebrew statement generator
          </Link>
        </div>
      </div>
    </main>
  );
}
