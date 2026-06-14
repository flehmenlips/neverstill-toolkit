import { NextRequest, NextResponse } from 'next/server';
import {
  getPurchaserAccess,
  getPurchaserAccessForCustomer,
  hasPaperAirplanePro,
} from '@/lib/stripe-purchases';

export const runtime = 'nodejs';

function isStripeCustomerId(id: string | null | undefined): id is string {
  return Boolean(id?.startsWith('cus_'));
}

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id') ?? undefined;
  const customerIdParam = request.nextUrl.searchParams.get('customer_id') ?? undefined;

  const access = sessionId?.startsWith('cs_')
    ? await getPurchaserAccess(sessionId)
    : isStripeCustomerId(customerIdParam)
      ? await getPurchaserAccessForCustomer(customerIdParam)
      : await getPurchaserAccess(undefined);

  const paperAirplanePro = hasPaperAirplanePro(access.owned);
  const verifiedViaSession = paperAirplanePro && Boolean(sessionId?.startsWith('cs_'));
  const verifiedViaCustomer = paperAirplanePro && isStripeCustomerId(customerIdParam);

  return NextResponse.json({
    owned: access.owned,
    paperAirplanePro,
    livemode: access.livemode,
    verified: verifiedViaSession || verifiedViaCustomer,
    customerId: access.customerId,
  });
}
