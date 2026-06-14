export const STRIPE_CUSTOMER_STORAGE_KEY = 'neverstill-stripe-customer';

export type SavedStripeCustomer = {
  customerId: string;
  savedAt: string;
};

export function getSavedStripeCustomer(): SavedStripeCustomer | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = localStorage.getItem(STRIPE_CUSTOMER_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as SavedStripeCustomer;
    if (typeof parsed.customerId !== 'string' || !parsed.customerId.startsWith('cus_')) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveStripeCustomer(customerId: string): void {
  if (typeof window === 'undefined' || !customerId.startsWith('cus_')) return;

  const payload: SavedStripeCustomer = {
    customerId,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STRIPE_CUSTOMER_STORAGE_KEY, JSON.stringify(payload));
}

export function clearSavedStripeCustomer(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STRIPE_CUSTOMER_STORAGE_KEY);
}
