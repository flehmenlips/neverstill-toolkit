export const STRIPE_CUSTOMER_STORAGE_KEY = 'neverstill-stripe-customer';
export const STRIPE_CUSTOMER_STORAGE_EVENT = 'neverstill-stripe-customer-change';

export type SavedStripeCustomer = {
  customerId: string;
  savedAt: string;
};

function notifyStripeCustomerStorageChange(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(STRIPE_CUSTOMER_STORAGE_EVENT));
}

export function subscribeStripeCustomerStorage(onStoreChange: () => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleCrossTabStorage = (event: StorageEvent) => {
    if (event.key === STRIPE_CUSTOMER_STORAGE_KEY || event.key === null) {
      onStoreChange();
    }
  };

  window.addEventListener(STRIPE_CUSTOMER_STORAGE_EVENT, onStoreChange);
  window.addEventListener('storage', handleCrossTabStorage);
  return () => {
    window.removeEventListener(STRIPE_CUSTOMER_STORAGE_EVENT, onStoreChange);
    window.removeEventListener('storage', handleCrossTabStorage);
  };
}

export function getSavedStripeCustomerSnapshot(): string | null {
  return getSavedStripeCustomer()?.customerId ?? null;
}

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
  notifyStripeCustomerStorageChange();
}

export function clearSavedStripeCustomer(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STRIPE_CUSTOMER_STORAGE_KEY);
  notifyStripeCustomerStorageChange();
}
