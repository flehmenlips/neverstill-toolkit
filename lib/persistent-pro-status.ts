import {
  getSavedStripeCustomer,
  saveStripeCustomer,
} from '@/lib/stripe-customer-storage';

export type ProStatusResponse = {
  owned?: Record<string, boolean>;
  paperAirplanePro: boolean;
  livemode: boolean | null;
  verified: boolean;
  customerId?: string | null;
};

export type ProAccessSource = 'session' | 'saved-customer' | null;

type ResolvedProQuery = {
  query: string;
  source: Exclude<ProAccessSource, null>;
};

export function resolveProStatusQuery(sessionId?: string | null): ResolvedProQuery | null {
  if (sessionId?.startsWith('cs_')) {
    return {
      query: `?session_id=${encodeURIComponent(sessionId)}`,
      source: 'session',
    };
  }

  const saved = getSavedStripeCustomer();
  if (saved) {
    return {
      query: `?customer_id=${encodeURIComponent(saved.customerId)}`,
      source: 'saved-customer',
    };
  }

  return null;
}

export async function fetchProStatus(sessionId?: string | null): Promise<{
  data: ProStatusResponse | null;
  source: ProAccessSource;
}> {
  const resolved = resolveProStatusQuery(sessionId);
  if (!resolved) {
    return { data: null, source: null };
  }

  try {
    const res = await fetch(`/api/pro-status${resolved.query}`);
    const data: ProStatusResponse | null = res.ok ? await res.json() : null;

    if (data?.paperAirplanePro && resolved.source === 'session' && data.customerId) {
      saveStripeCustomer(data.customerId);
    }

    return {
      data,
      source: data?.paperAirplanePro ? resolved.source : null,
    };
  } catch {
    return { data: null, source: null };
  }
}
