import Link from "next/link";
import { stripe } from "@/lib/billing/stripe";
import { polar } from "@/lib/billing/polar";

export const dynamic = "force-dynamic";

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
  let error: string | null = null;

  // Polar success: /checkout/success?provider=polar&checkout_id=...
  // Stripe success: /checkout/success?session_id=...
  if (params?.provider === "polar" && params?.checkout_id) {
    try {
      const checkout = await polar().checkouts.get({ id: params.checkout_id });
      email = checkout.customerEmail || null;
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
    } catch (err) {
      error = err instanceof Error ? err.message : "Unknown error";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-4xl">🎉</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-emerald-900">
          Subscription active
        </h1>
        <p className="mt-3 text-emerald-800">
          {email
            ? `We just sent your axle API key to ${email}. Check your inbox.`
            : "We just emailed your axle API key. Check your inbox."}
        </p>
        <p className="mt-2 text-sm text-emerald-700">
          If it doesn't arrive in 2 minutes, check spam. Subject: "Your axle API
          key — welcome to Team".
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/account"
            className="rounded-md bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Paste key → unlock web UI
          </Link>
          <Link
            href="/"
            className="rounded-md border border-emerald-300 bg-white px-5 py-2 text-sm font-medium text-emerald-900 hover:bg-emerald-100"
          >
            Back to home
          </Link>
        </div>
        {error && (
          <p className="mt-4 text-xs text-red-700">
            Note: couldn't load session details ({error}). This doesn't affect
            your subscription.
          </p>
        )}
      </div>
    </main>
  );
}
