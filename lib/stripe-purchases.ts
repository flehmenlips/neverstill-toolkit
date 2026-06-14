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

export function purchaseRecordFromSession(
  session: Stripe.Checkout.Session,
  livemode: boolean,
): PurchaseRecord | null {
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
  if (session.payment_status !== 'paid') return { ...EMPTY_OWNED };
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
  };

  if (!sessionId?.startsWith('cs_')) {
    return result;
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    if (session.payment_status !== 'paid') {
      return result;
    }

    result.livemode = session.livemode;
    result.customerId = resolveCustomerId(session);
    result.customerEmail = session.customer_details?.email ?? session.customer_email ?? null;

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
  };

  try {
    const stripe = getStripeClient();
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      status: 'complete',
      limit: 100,
      expand: ['data.line_items'],
    });

    for (const session of sessions.data) {
      if (session.payment_status !== 'paid') continue;

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
