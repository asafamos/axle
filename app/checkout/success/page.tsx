import Link from "next/link";
import { stripe } from "@/lib/billing/stripe";
import { polar } from "@/lib/billing/polar";
import { lookupRecentKey } from "@/lib/billing/keys";

export const dynamic = "force-dynamic";

type PolarCheckoutResp = {
  customerEmail?: string | null;
  customerId?: string | null;
  customer?: { id?: string | null } | null;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string;
    checkout_id?: string;
    provider?: string;
  }>;
}) {
  const params = await searchParams;

  let email: string | null = null;
  let apiKey: string | null = null;
  let error: string | null = null;

  // Polar success: /checkout/success?provider=polar&checkout_id=...
  // Stripe success: /checkout/success?session_id=...
  if (params?.provider === "polar" && params?.checkout_id) {
    try {
      const checkout = (await polar().checkouts.get({
        id: params.checkout_id,
      })) as unknown as PolarCheckoutResp;
      email = checkout.customerEmail || null;
      const customerId = checkout.customerId || checkout.customer?.id || null;
      // Belt-and-suspenders: even if the welcome email failed (Resend
      // misconfiguration, sandbox limit, etc.) the customer still sees
      // their API key on this page within the 30-minute display window.
      if (customerId) {
        apiKey = await lookupRecentKey(customerId);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    }
  } else if (params?.session_id) {
    try {
      const session = await stripe().checkout.sessions.retrieve(
        params.session_id
      );
      email =
        session.customer_details?.email || session.customer_email || null;
      const customerId =
        typeof session.customer === "string"
          ? session.customer
          : session.customer?.id ?? null;
      if (customerId) {
        apiKey = await lookupRecentKey(customerId);
      }
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8">
        <p className="text-center text-4xl">🎉</p>
        <h1 className="mt-4 text-center text-3xl font-bold tracking-tight text-emerald-900">
          Subscription active
        </h1>

        {apiKey ? (
          <>
            <p className="mt-3 text-center text-emerald-800">
              Your axle API key — <strong>copy it now</strong>. We won&apos;t
              show it again, and the welcome email may take a few minutes to
              arrive.
            </p>
            <pre
              className="mt-4 select-all overflow-x-auto rounded-md border border-emerald-300 bg-white p-3 font-mono text-sm text-emerald-900 break-all"
              data-testid="api-key"
            >
              {apiKey}
            </pre>
            {email ? (
              <p className="mt-3 text-center text-xs text-emerald-700">
                A copy is also being emailed to <strong>{email}</strong>.
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-3 text-center text-emerald-800">
            {email
              ? `We sent your axle API key to ${email}. Check your inbox — subject "Your axle API key — welcome".`
              : "We've emailed your axle API key. Check your inbox."}
          </p>
        )}

        <p className="mt-3 text-center text-sm text-emerald-700">
          {apiKey
            ? "If you'd rather work from email, the same key is on its way to your inbox (subject: \"Your axle API key — welcome\")."
            : "If it doesn't arrive in 2 minutes, check spam — or reply to this email at asaf@amoss.co.il and we'll resend manually."}
        </p>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/account"
            className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Paste key → unlock web UI
          </Link>
          <a
            href="https://github.com/marketplace/actions/axle-a11y-wcag-accessibility-ci"
            target="_blank"
            rel="noopener"
            className="rounded-md border border-emerald-300 bg-white px-5 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
          >
            Install GitHub Action →
          </a>
          <Link
            href="/"
            className="rounded-md border border-emerald-300 bg-white px-5 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
          >
            Home
          </Link>
        </div>

        {error && (
          <p className="mt-4 text-center text-xs text-red-700">
            Note: couldn&apos;t load full session details ({error}). This
            doesn&apos;t affect your subscription. If your key didn&apos;t
            arrive, email asaf@amoss.co.il.
          </p>
        )}
      </div>
    </main>
  );
}
