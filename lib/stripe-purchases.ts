import type Stripe from 'stripe';
import { getStripeClient } from '@/lib/stripe';
import {
  type CheckoutProduct,
  getStripePriceMap,
  isCheckoutProduct,
} from '@/lib/stripe-prices';

export type { CheckoutProduct };

export type OwnedProducts = Record<CheckoutProduct, boolean>;

export type PurchaseRecord = {
  sessionId: string;
  product: CheckoutProduct;
  customerId: string | null;
  customerEmail: string | null;
  paymentStatus: string;
  amountTotal: number | null;
  currency: string | null;
  livemode: boolean;
  purchasedAt: number | null;
};

export type PurchaserAccess = {
  owned: OwnedProducts;
  purchases: PurchaseRecord[];
  livemode: boolean | null;
  customerId: string | null;
  customerEmail: string | null;
  /** True when the provided checkout session is paid, not refunded, and grants access. */
  sessionGrantsAccess: boolean;
};

export const PRODUCT_LABELS: Record<CheckoutProduct, string> = {
  'paperairplane-pro': 'PaperAirplane Pro',
  'farmforge-pro': 'FarmForge Pro',
  'toolkit-pass': 'Toolkit Pass',
};

export const EMPTY_OWNED: OwnedProducts = {
  'paperairplane-pro': false,
  'farmforge-pro': false,
  'toolkit-pass': false,
};

export function hasPaperAirplanePro(owned: OwnedProducts): boolean {
  return owned['paperairplane-pro'] || owned['toolkit-pass'];
}

export function mergeOwnedProducts(...sources: OwnedProducts[]): OwnedProducts {
  const merged = { ...EMPTY_OWNED };
  for (const source of sources) {
    for (const product of Object.keys(merged) as CheckoutProduct[]) {
      if (source[product]) merged[product] = true;
    }
  }
  return merged;
}

export function ownedFromProduct(product: CheckoutProduct): OwnedProducts {
  if (product === 'toolkit-pass') {
    return {
      'paperairplane-pro': true,
      'farmforge-pro': true,
      'toolkit-pass': true,
    };
  }
  return { ...EMPTY_OWNED, [product]: true };
}

const SESSION_EXPAND = ['line_items', 'payment_intent.latest_charge'] as const;

export function isSessionRefunded(session: Stripe.Checkout.Session): boolean {
  const paymentIntent = session.payment_intent;
  if (!paymentIntent || typeof paymentIntent === 'string') return false;

  const charge = paymentIntent.latest_charge;
  if (!charge || typeof charge === 'string') return false;

  return charge.refunded === true || (charge.amount_refunded ?? 0) > 0;
}

/** True when a checkout session should grant toolkit Pro access. */
export function sessionGrantsAccess(session: Stripe.Checkout.Session): boolean {
  if (session.payment_status !== 'paid') return false;
  if (isSessionRefunded(session)) return false;
  return resolveProductFromSession(session) !== null;
}

export function getPurchaseSkipReason(session: Stripe.Checkout.Session): string {
  if (session.payment_status !== 'paid') return 'unpaid';
  if (isSessionRefunded(session)) return 'refunded';
  if (resolveProductFromSession(session)) return 'unknown';
  if (session.metadata?.product) return 'unknown_product';
  return 'unknown_product_or_unpaid';
}

export function purchaseRecordFromSession(
  session: Stripe.Checkout.Session,
  livemode: boolean,
): PurchaseRecord | null {
  if (session.payment_status !== 'paid') return null;
  if (isSessionRefunded(session)) return null;

  const product = resolveProductFromSession(session);
  if (!product) return null;

  return {
    sessionId: session.id,
    product,
    customerId: resolveCustomerId(session),
    customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
    paymentStatus: session.payment_status ?? 'unknown',
    amountTotal: session.amount_total,
    currency: session.currency,
    livemode,
    purchasedAt: session.created ?? null,
  };
}

export function resolveCustomerId(session: Stripe.Checkout.Session): string | null {
  if (!session.customer) return null;
  return typeof session.customer === 'string' ? session.customer : session.customer.id;
}

function resolveProductFromSession(session: Stripe.Checkout.Session): CheckoutProduct | null {
  const fromMetadata = session.metadata?.product;
  if (fromMetadata && isCheckoutProduct(fromMetadata)) {
    return fromMetadata;
  }

  const priceMap = getStripePriceMap();
  const lineItems = session.line_items?.data ?? [];
  for (const item of lineItems) {
    const priceId = typeof item.price === 'string' ? item.price : item.price?.id;
    if (!priceId) continue;
    for (const [product, configuredPrice] of Object.entries(priceMap) as [CheckoutProduct, string][]) {
      if (configuredPrice === priceId) return product;
    }
  }

  return null;
}

function ownedFromPaidSession(session: Stripe.Checkout.Session): OwnedProducts {
  if (!sessionGrantsAccess(session)) return { ...EMPTY_OWNED };
  const product = resolveProductFromSession(session);
  return product ? ownedFromProduct(product) : { ...EMPTY_OWNED };
}

/** Loads owned products for a verified checkout session and linked Stripe customer. */
export async function getPurchaserAccess(sessionId?: string): Promise<PurchaserAccess> {
  const result: PurchaserAccess = {
    owned: { ...EMPTY_OWNED },
    purchases: [],
    livemode: null,
    customerId: null,
    customerEmail: null,
    sessionGrantsAccess: false,
  };

  if (!sessionId?.startsWith('cs_')) {
    return result;
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: [...SESSION_EXPAND],
    });

    result.livemode = session.livemode;
    result.customerId = resolveCustomerId(session);
    result.customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
    result.sessionGrantsAccess = sessionGrantsAccess(session);

    if (result.sessionGrantsAccess) {
      const sessionRecord = purchaseRecordFromSession(session, session.livemode);
      if (sessionRecord) {
        result.purchases.push(sessionRecord);
        result.owned = mergeOwnedProducts(result.owned, ownedFromProduct(sessionRecord.product));
      }

      if (result.customerId) {
        const customerAccess = await getPurchaserAccessForCustomer(result.customerId);
        result.owned = mergeOwnedProducts(result.owned, customerAccess.owned);
        result.purchases = mergePurchaseRecords(result.purchases, customerAccess.purchases);
        if (result.livemode === null) result.livemode = customerAccess.livemode;
      }
    }
  } catch {
    return result;
  }

  return result;
}

/** Lists completed paid checkout sessions for a Stripe customer ID. */
export async function getPurchaserAccessForCustomer(customerId: string): Promise<PurchaserAccess> {
  const result: PurchaserAccess = {
    owned: { ...EMPTY_OWNED },
    purchases: [],
    livemode: null,
    customerId,
    customerEmail: null,
    sessionGrantsAccess: false,
  };

  try {
    const stripe = getStripeClient();
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: 'complete',
      limit: 100,
      expand: ['data.line_items', 'data.payment_intent.latest_charge'],
    });

    for (const session of sessions.data) {
      if (!sessionGrantsAccess(session)) continue;

      const record = purchaseRecordFromSession(session, session.livemode);
      if (!record) continue;

      result.purchases.push(record);
      result.owned = mergeOwnedProducts(result.owned, ownedFromPaidSession(session));
      if (result.livemode === null) result.livemode = session.livemode;
      if (!result.customerEmail) {
        result.customerEmail = session.customer_details?.email ?? session.customer_email ?? null;
      }
    }
  } catch {
    return result;
  }

  return result;
}

function mergePurchaseRecords(a: PurchaseRecord[], b: PurchaseRecord[]): PurchaseRecord[] {
  const bySession = new Map<string, PurchaseRecord>();
  for (const record of [...a, ...b]) {
    bySession.set(record.sessionId, record);
  }
  return [...bySession.values()].sort((x, y) => (y.purchasedAt ?? 0) - (x.purchasedAt ?? 0));
}
