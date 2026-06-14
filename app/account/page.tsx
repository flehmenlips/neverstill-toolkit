import Link from 'next/link';
import {
  type CheckoutProduct,
  PRODUCT_LABELS,
  getPurchaserAccess,
} from '@/lib/stripe-purchases';
import {
  AccountClearSavedAccess,
  AccountSaveCustomerAccess,
} from './account-persistent-access';

type AccountPageProps = {
  searchParams: Promise<{ success?: string; session_id?: string }>;
};

const PRODUCT_ORDER: CheckoutProduct[] = [
  'paperairplane-pro',
  'farmforge-pro',
  'toolkit-pass',
];

const PRODUCT_LINKS: Record<CheckoutProduct, { href: string; label: string }> = {
  'paperairplane-pro': {
    href: '/tools/paperairplane/pwa',
    label: 'Open PaperAirplane PWA',
  },
  'farmforge-pro': {
    href: '/tools/farmforge',
    label: 'Open FarmForge',
  },
  'toolkit-pass': {
    href: '/',
    label: 'Browse Toolkit',
  },
};

function formatPurchaseDate(unix: number | null): string {
  if (!unix) return '—';
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatAmount(amountTotal: number | null, currency: string | null): string | null {
  if (amountTotal == null || !currency) return null;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amountTotal / 100);
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const { session_id } = await searchParams;
  const access = await getPurchaserAccess(session_id);
  const portalUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL;
  const hasAnyOwned = PRODUCT_ORDER.some((product) => access.owned[product]);
  const modeLabel =
    access.livemode === null ? null : access.livemode ? 'Live' : 'Test';

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <AccountSaveCustomerAccess
        customerId={access.customerId}
        sessionGrantsAccess={access.sessionGrantsAccess}
      />
      <div className="max-w-md mx-auto">
        <Link href="/" className="text-sm text-white/50 hover:text-white">
          ← Toolkit
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Neverstill Customer Portal</h1>
        <p className="mt-2 text-white/60 text-sm">
          Manage toolkit access, downloads, and Stripe purchases in one place.
        </p>

        {access.sessionGrantsAccess && (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-4 text-sm text-emerald-100">
            <p className="font-medium">Thank you — payment received.</p>
            <p className="mt-1 text-emerald-100/80">
              Your Pro access is active for the products below. Gumroad pack downloads still use your
              Gumroad receipt.
            </p>
            {modeLabel && (
              <p className="mt-2 text-xs text-emerald-100/70">
                Stripe mode: <span className="font-medium">{modeLabel}</span>
              </p>
            )}
            {session_id && (
              <p className="mt-2 text-xs text-emerald-100/60 font-mono break-all">Session: {session_id}</p>
            )}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 p-6 bg-zinc-900">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-white">Your Pro access</p>
            {modeLabel && (
              <span className="text-[10px] uppercase tracking-widest text-white/40">{modeLabel} mode</span>
            )}
          </div>

          {!hasAnyOwned && (
            <p className="mt-3 text-sm text-white/60">
              {session_id
                ? 'No paid toolkit products found for this session yet. If you just paid, refresh in a moment.'
                : 'Complete a Stripe checkout to see owned products here, or open the Customer Portal for billing history.'}
            </p>
          )}

          <ul className="mt-4 space-y-3">
            {PRODUCT_ORDER.map((product) => {
              const owned = access.owned[product];
              const link = PRODUCT_LINKS[product];
              const pwaHref = session_id
                ? `${link.href}?session_id=${encodeURIComponent(session_id)}`
                : link.href;

              return (
                <li
                  key={product}
                  className={`rounded-xl border p-4 ${
                    owned
                      ? 'border-emerald-500/30 bg-emerald-950/20'
                      : 'border-white/10 bg-zinc-950/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-sm">{PRODUCT_LABELS[product]}</p>
                      <p className="mt-1 text-xs text-white/60">
                        {owned ? 'Pro access granted' : 'Not purchased via Stripe'}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ${
                        owned
                          ? 'bg-emerald-500/20 text-emerald-200'
                          : 'bg-white/10 text-white/40'
                      }`}
                    >
                      {owned ? 'Pro' : 'Free'}
                    </span>
                  </div>
                  {owned && (
                    <Link
                      href={pwaHref}
                      className="mt-3 inline-block text-xs underline text-emerald-100/90 hover:text-emerald-50"
                    >
                      {link.label} →
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>

          {access.purchases.length > 0 && (
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-xs uppercase tracking-widest text-white/40">Recent purchases</p>
              <ul className="mt-2 space-y-2 text-xs text-white/70">
                {access.purchases.slice(0, 5).map((purchase) => {
                  const amount = formatAmount(purchase.amountTotal, purchase.currency);
                  return (
                    <li key={purchase.sessionId} className="font-mono break-all">
                      {PRODUCT_LABELS[purchase.product]}
                      {amount ? ` · ${amount}` : ''} · {formatPurchaseDate(purchase.purchasedAt)}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!session_id && (
            <p className="mt-4 text-xs text-white/50">
              Returning without a checkout session? Pro access can be saved on this device after checkout — use
              the clear control below if you need to reset it. For receipts and billing history, use the
              Stripe Customer Portal.
            </p>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 p-6 bg-zinc-900">
          <p className="text-sm text-white/80">Stripe Customer Portal</p>
          <ul className="mt-3 text-sm list-disc pl-5 space-y-1 text-white/70">
            <li>Manage cards, invoices, and receipts</li>
            <li>View billing history for toolkit purchases</li>
            <li>Packs sold on Gumroad: https://neverstill.gumroad.com/l/mvwhj</li>
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

        <AccountClearSavedAccess />

        <p className="mt-6 text-xs text-white/40 text-center">
          Questions? Use your purchase receipt or the Gumroad store.
        </p>
      </div>
    </div>
  );
}
