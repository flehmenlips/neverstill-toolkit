import Link from 'next/link';
import { verifyCheckoutSession } from '@/lib/verify-checkout-session';

type AccountPageProps = {
  searchParams: Promise<{ success?: string; session_id?: string }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { session_id } = await searchParams;
  const purchaseComplete = await verifyCheckoutSession(session_id);
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-sm text-white/50 hover:text-white">
          ← Toolkit
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Neverstill Customer Portal</h1>
        <p className="mt-2 text-white/60 text-sm">
          Manage toolkit access, downloads, and Stripe purchases in one place.
        </p>

        {purchaseComplete && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-sm text-emerald-100">
            <p className="font-medium">Thank you — payment received.</p>
            <p className="mt-1 text-emerald-100/80">
              Gumroad pack downloads use your Gumroad receipt. Stripe Pro access will unlock here as
              fulfillment automates (webhook on{' '}
              <code className="text-xs">/api/webhooks/stripe</code>).
            </p>
            {session_id && (
              <p className="mt-2 text-xs text-emerald-100/60 font-mono break-all">Session: {session_id}</p>
            )}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 p-6 bg-zinc-900">
          <p className="text-sm text-white/80">Stripe Customer Portal</p>
          <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-white/70">
            <li>Manage cards, invoices, and receipts</li>
            <li>Future: download links for Pro unlocks and license keys</li>
            <li>Packs sold on Gumroad: https://gumroad.com/neverstill</li>
          </ul>

          {portalUrl ? (
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block text-center rounded bg-white/90 py-2 text-sm font-medium text-black hover:bg-white"
            >
              Open Stripe Customer Portal →
            </a>
          ) : (
            <p className="mt-6 text-xs text-white/50">
              Set <code className="text-white/70">NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL</code> in
              Vercel (from Stripe Dashboard → Settings → Billing → Customer portal) to enable the
              portal link.
            </p>
          )}
        </div>

        <p className="mt-6 text-xs text-white/40 text-center">
          Questions? Use your purchase receipt or the Gumroad store.
        </p>
      </div>
    </div>
  );
}
