"use client";

import { useEffect, useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "saved"; masked: string; raw: string }
  | { kind: "error"; message: string };

type Me = {
  plan: "team" | "business";
  status: string;
  email: string;
  created_at: string;
  statements: Array<{
    id: string;
    url: string;
    organization_name: string;
    created_at: string;
  }>;
};

export default function AccountPage() {
  const [key, setKey] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [me, setMe] = useState<Me | null>(null);
  const [meError, setMeError] = useState<string | null>(null);

  useEffect(() => {
    const m = /(?:^|;\s*)axle_key=([^;]+)/.exec(document.cookie);
    if (m) {
      const raw = decodeURIComponent(m[1]);
      setStatus({ kind: "saved", masked: mask(raw), raw });
      loadMe(raw);
    }
  }, []);

  async function loadMe(raw: string) {
    setMeError(null);
    setMe(null);
    try {
      const res = await fetch("/api/account/me", {
        method: "POST",
        headers: { Authorization: `Bearer ${raw}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lookup failed");
      setMe(data as Me);
    } catch (err) {
      setMeError(err instanceof Error ? err.message : "Lookup failed");
    }
  }

  function save() {
    const trimmed = key.trim();
    if (!trimmed.startsWith("axle_")) {
      setStatus({
        kind: "error",
        message: "Keys start with 'axle_'. Double-check the email we sent.",
      });
      return;
    }
    const oneYear = 60 * 60 * 24 * 365;
    document.cookie = `axle_key=${encodeURIComponent(
      trimmed
    )}; path=/; max-age=${oneYear}; SameSite=Lax`;
    setStatus({ kind: "saved", masked: mask(trimmed), raw: trimmed });
    setKey("");
    loadMe(trimmed);
  }

  function clear() {
    document.cookie = "axle_key=; path=/; max-age=0";
    setStatus({ kind: "idle" });
    setMe(null);
    setMeError(null);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Account
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Your axle API key
          </h1>
          <p className="mt-2 text-slate-600">
            Paste the key we emailed you. Stored as a cookie in this browser so
            that AI fixes on this site are unlimited. No server-side account,
            no password.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {status.kind === "saved" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-medium text-slate-900">
                  Key saved in this browser
                </span>
              </div>
              <div className="rounded-md bg-slate-100 p-3 font-mono text-sm text-slate-700">
                {status.masked}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={clear}
                  className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  Remove from this browser
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium text-slate-800">axle API key</span>
                <input
                  type="password"
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="axle_test_xxx… or axle_live_xxx…"
                  className="rounded-md border border-slate-300 px-3 py-2 font-mono text-sm"
                  autoComplete="off"
                  spellCheck={false}
                />
              </label>
              <button
                onClick={save}
                disabled={!key.trim()}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
              >
                Save
              </button>
              {status.kind === "error" && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
                  {status.message}
                </div>
              )}
            </div>
          )}
        </div>

        {status.kind === "saved" && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Plan & activity</h2>
            {meError && (
              <p className="mt-2 text-sm text-red-700">
                Could not load plan: {meError}
              </p>
            )}
            {me && (
              <>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Plan</div>
                    <div className="mt-0.5 text-lg font-semibold capitalize">
                      {me.plan}
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Status</div>
                    <div
                      className={`mt-0.5 text-lg font-semibold capitalize ${
                        me.status === "active"
                          ? "text-emerald-700"
                          : "text-amber-700"
                      }`}
                    >
                      {me.status}
                    </div>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs text-slate-500">Email</div>
                    <div
                      className="mt-0.5 truncate text-sm text-slate-700"
                      title={me.email}
                    >
                      {me.email}
                    </div>
                  </div>
                </div>

                <h3 className="mt-6 text-sm font-semibold text-slate-700">
                  Published statements
                </h3>
                {me.statements.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-500">
                    None yet. Generate + publish one at{" "}
                    <a className="underline" href="/statement">
                      /statement
                    </a>
                    .
                  </p>
                ) : (
                  <table className="mt-2 w-full text-sm">
                    <thead className="text-left text-xs uppercase text-slate-500">
                      <tr>
                        <th className="py-2">Organization</th>
                        <th>Published</th>
                        <th>URL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {me.statements.map((s) => (
                        <tr key={s.id} className="border-t border-slate-100">
                          <td className="py-2">{s.organization_name}</td>
                          <td>
                            {new Date(s.created_at).toLocaleDateString()}
                          </td>
                          <td>
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener"
                              className="text-blue-700 underline"
                            >
                              /s/{s.id}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-100 p-6 text-sm text-slate-700">
          <p className="font-semibold">Using the key elsewhere</p>
          <ul className="mt-2 list-disc space-y-1 ps-6">
            <li>
              <strong>GitHub Action:</strong> add the key as a repo secret
              <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">AXLE_API_KEY</code>
              and pass it to <code className="mx-1 rounded bg-white px-1 py-0.5 text-xs">asafamos/axle-action@v1</code>
              with the <code>axle-api-key</code> input.
            </li>
            <li>
              <strong>CLI:</strong>{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs">
                export AXLE_API_KEY=&lt;key&gt;
              </code>{" "}
              before running{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs">
                npx axle-cli scan ...
              </code>
            </li>
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            Cancel or manage billing via the Stripe receipt we emailed, or
            reply to that email — we'll handle it.
          </p>
        </div>
      </div>
    </main>
  );
}

function mask(k: string): string {
  if (k.length <= 10) return "••••••••";
  return `${k.slice(0, 10)}${"•".repeat(Math.max(8, k.length - 14))}${k.slice(-4)}`;
}
