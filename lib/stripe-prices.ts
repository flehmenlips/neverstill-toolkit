const PLACEHOLDER = 'price_placeholder';

export type CheckoutProduct = 'paperairplane-pro' | 'farmforge-pro' | 'toolkit-pass';

const CHECKOUT_PRODUCTS: readonly CheckoutProduct[] = [
  'paperairplane-pro',
  'farmforge-pro',
  'toolkit-pass',
];

export function isCheckoutProduct(product: string): product is CheckoutProduct {
  return (CHECKOUT_PRODUCTS as readonly string[]).includes(product);
}

export function getStripePriceMap(): Record<CheckoutProduct, string> {
  return {
    'paperairplane-pro':
      process.env.STRIPE_PRICE_PAPER_AIRPLANE_PRO || PLACEHOLDER,
    'farmforge-pro': process.env.STRIPE_PRICE_FARMFORGE_PRO || PLACEHOLDER,
    'toolkit-pass': process.env.STRIPE_PRICE_TOOLKIT_PASS || PLACEHOLDER,
  };
}

export function resolvePriceId(product: string): string {
  if (!isCheckoutProduct(product)) {
    throw new Error(`Unknown checkout product "${product}".`);
  }

  const priceId = getStripePriceMap()[product];

  if (isInvalidPriceId(priceId)) {
    throw new Error(
      `Stripe price not configured for "${product}". Set STRIPE_PRICE_* env vars in Vercel production.`
    );
  }
  return priceId;
}

function isInvalidPriceId(priceId: string): boolean {
  if (!priceId || priceId === PLACEHOLDER || !priceId.startsWith('price_')) {
    return true;
  }
  return false;
}

export function getCancelPath(product: string): string {
  switch (product) {
    case 'farmforge-pro':
      return '/tools/farmforge';
    case 'toolkit-pass':
      return '/';
    default:
      return '/tools/paperairplane';
  }
}
