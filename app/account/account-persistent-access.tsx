"use client";

import { useEffect, useState } from 'react';
import {
  clearSavedStripeCustomer,
  getSavedStripeCustomer,
  saveStripeCustomer,
} from '@/lib/stripe-customer-storage';

type AccountPersistentAccessProps = {
  customerId: string | null;
  sessionGrantsAccess: boolean;
};

export function AccountSaveCustomerAccess({
  customerId,
  sessionGrantsAccess,
}: AccountPersistentAccessProps) {
  useEffect(() => {
    if (sessionGrantsAccess && customerId) {
      saveStripeCustomer(customerId);
    }
  }, [sessionGrantsAccess, customerId]);

  return null;
}

export function AccountClearSavedAccess() {
  const [savedCustomerId, setSavedCustomerId] = useState(
    () => getSavedStripeCustomer()?.customerId ?? null,
  );
  const [cleared, setCleared] = useState(false);

  if (!savedCustomerId) return null;

  return (
    <div className="mt-6 rounded-2xl border border-white/10 p-4 bg-zinc-900 text-sm">
      <p className="text-white/80">Saved access on this device</p>
      <p className="mt-1 text-xs text-white/50 font-mono break-all">{savedCustomerId}</p>
      <button
        type="button"
        onClick={() => {
          clearSavedStripeCustomer();
          setSavedCustomerId(null);
          setCleared(true);
        }}
        className="mt-3 text-xs underline text-white/60 hover:text-white"
      >
        Clear saved access on this device
      </button>
      {cleared && (
        <p className="mt-2 text-xs text-emerald-200/80">
          Cleared. Re-open a tool from /account after checkout to save access again.
        </p>
      )}
    </div>
  );
}
