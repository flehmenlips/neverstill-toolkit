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

async function requestProStatus(
  query: string,
  source: Exclude<ProAccessSource, null>,
): Promise<{ data: ProStatusResponse | null; source: ProAccessSource }> {
  const res = await fetch(`/api/pro-status${query}`);
  const data: ProStatusResponse | null = res.ok ? await res.json() : null;

  return {
    data,
    source: data?.paperAirplanePro ? source : null,
  };
}

export async function fetchProStatus(sessionId?: string | null): Promise<{
  data: ProStatusResponse | null;
  source: ProAccessSource;
}> {
  try {
    if (sessionId?.startsWith('cs_')) {
      const sessionResult = await requestProStatus(
        `?session_id=${encodeURIComponent(sessionId)}`,
        'session',
      );

      if (sessionResult.data?.paperAirplanePro) {
        if (sessionResult.data.customerId) {
          saveStripeCustomer(sessionResult.data.customerId);
        }
        return sessionResult;
      }
    }

    const saved = getSavedStripeCustomer();
    if (saved) {
      return requestProStatus(
        `?customer_id=${encodeURIComponent(saved.customerId)}`,
        'saved-customer',
      );
    }

    return { data: null, source: null };
  } catch {
    return { data: null, source: null };
  }
}
