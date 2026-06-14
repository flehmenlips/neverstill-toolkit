"use client";

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  fetchProStatus,
  type ProAccessSource,
} from '@/lib/persistent-pro-status';
import {
  getSavedStripeCustomerSnapshot,
  subscribeStripeCustomerStorage,
} from '@/lib/stripe-customer-storage';

type PaperAirplaneProClientProps = {
  sessionIsPro: boolean;
  sessionId?: string;
  pwaHref: string;
};

type CachedProStatus = {
  isPro: boolean;
  source: ProAccessSource;
};

const proStatusRequests = new Map<string, Promise<CachedProStatus>>();

if (typeof window !== 'undefined') {
  subscribeStripeCustomerStorage(() => {
    proStatusRequests.clear();
  });
}

function useSavedCustomerSnapshot(): string | null {
  return useSyncExternalStore(
    subscribeStripeCustomerStorage,
    getSavedStripeCustomerSnapshot,
    () => null,
  );
}

function loadPaperAirplaneProStatus(
  sessionIsPro: boolean,
  sessionId?: string,
): Promise<CachedProStatus> {
  if (sessionIsPro) {
    return Promise.resolve({
      isPro: true,
      source: sessionId ? 'session' : null,
    });
  }

  const cacheKey = sessionId ?? '';
  const cached = proStatusRequests.get(cacheKey);
  if (cached) return cached;

  const request = fetchProStatus(sessionId).then(({ data, source }) => ({
    isPro: Boolean(data?.paperAirplanePro),
    source: data?.paperAirplanePro ? source : null,
  }));
  proStatusRequests.set(cacheKey, request);
  return request;
}

export function PaperAirplaneProBadge({
  sessionIsPro,
  sessionId,
}: Pick<PaperAirplaneProClientProps, 'sessionIsPro' | 'sessionId'>) {
  const [localStoragePro, setLocalStoragePro] = useState(false);
  const savedCustomerSnapshot = useSavedCustomerSnapshot();

  useEffect(() => {
    if (sessionIsPro) return;

    let cancelled = false;
    loadPaperAirplaneProStatus(sessionIsPro, sessionId).then(({ isPro }) => {
      if (!cancelled) {
        setLocalStoragePro(isPro);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [sessionIsPro, sessionId, savedCustomerSnapshot]);

  if (!sessionIsPro && !localStoragePro) return null;

  return (
    <span className="rounded-full border border-emerald-500/40 bg-emerald-950/50 px-3 py-1 text-xs font-medium uppercase tracking-widest text-emerald-200">
      Pro
    </span>
  );
}

export function PaperAirplaneProAccessBanner({
  sessionIsPro,
  sessionId,
  pwaHref,
}: PaperAirplaneProClientProps) {
  const [localStoragePro, setLocalStoragePro] = useState(false);
  const [accessSource, setAccessSource] = useState<ProAccessSource>(null);
  const savedCustomerSnapshot = useSavedCustomerSnapshot();

  useEffect(() => {
    if (sessionIsPro) return;

    let cancelled = false;
    loadPaperAirplaneProStatus(sessionIsPro, sessionId).then(({ isPro, source }) => {
      if (cancelled) return;
      setLocalStoragePro(isPro);
      setAccessSource(isPro ? source : null);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionIsPro, sessionId, savedCustomerSnapshot]);

  const isPro = sessionIsPro || localStoragePro;
  const displaySource: ProAccessSource =
    sessionIsPro && sessionId ? 'session' : accessSource;

  if (!isPro) return null;

  return (
    <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/30 p-4 text-sm text-emerald-100">
      <p className="font-medium">Pro access granted</p>
      <p className="mt-1 text-emerald-100/80">
        Your hosted PWA unlocks larger maze sizes and the solution-path overlay. Open the PWA with your
        purchase linked below.
      </p>
      {displaySource === 'saved-customer' && (
        <p className="mt-2 text-xs text-emerald-100/70">
          Restored from saved access on this device — verified server-side with Stripe.
        </p>
      )}
      <Link href={pwaHref} className="mt-3 inline-block text-xs underline hover:text-emerald-50">
        Open Pro-enabled PWA →
      </Link>
    </div>
  );
}
