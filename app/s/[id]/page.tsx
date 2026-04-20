import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { kv } from "@/lib/billing/kv";
import type { PublishedStatement } from "@/app/api/statement/publish/route";
import { renderHebrewStatementHtml } from "@/lib/statement/hebrew-template";

export const runtime = "nodejs";
export const revalidate = 3600;

async function getPublished(id: string): Promise<PublishedStatement | null> {
  const redis = kv();
  if (!redis) return null;
  const raw = await redis.get<string | PublishedStatement>(
    `axle:statement:${id}`
  );
  if (!raw) return null;
  if (typeof raw === "object") return raw as PublishedStatement;
  try {
    return JSON.parse(raw) as PublishedStatement;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const p = await getPublished(id);
  if (!p) return { title: "Statement not found" };
  return {
    title: `הצהרת נגישות — ${p.organizationName}`,
    description: `Verified accessibility statement for ${p.organizationName}, published via axle on ${new Date(p.createdAt).toISOString().slice(0, 10)}.`,
    robots: { index: true, follow: true },
  };
}

export default async function StatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const published = await getPublished(id);
  if (!published) notFound();

  const bodyHtml =
    renderHebrewStatementHtml(published.input).match(
      /<body>([\s\S]*)<\/body>/
    )?.[1] ?? "";

  const publishedDate = new Date(published.createdAt);
  const isoDate = publishedDate.toISOString();
  const displayDate = publishedDate.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://axle-iota.vercel.app";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 p-5">
          <div>
            <div className="flex items-center gap-2">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5 text-emerald-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 6L9 17l-5-5" />
              </svg>
              <span className="text-sm font-semibold uppercase tracking-wider text-emerald-800">
                Verified accessibility statement
              </span>
            </div>
            <p className="mt-1 text-sm text-emerald-900">
              Published via axle on{" "}
              <time dateTime={isoDate}>{displayDate}</time>. Document ID{" "}
              <code className="rounded bg-white/60 px-1 text-xs">{published.id}</code>.
            </p>
          </div>
          <a
            href={`${siteUrl}?utm_source=verified-statement`}
            target="_blank"
            rel="noopener"
            className="rounded-md border border-emerald-300 bg-white px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
          >
            What is axle?
          </a>
        </header>

        <div
          dir="rtl"
          className="rounded-xl border border-slate-200 bg-white p-8 text-slate-900 shadow-sm"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        <footer className="mt-6 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
          <span>
            Tamper-evident record. Verify authenticity at{" "}
            <a className="underline" href={`${siteUrl}/s/${published.id}`}>
              {siteUrl}/s/{published.id}
            </a>
          </span>
          <span>Powered by axle · accessibility compliance CI</span>
        </footer>
      </div>
    </main>
  );
}
