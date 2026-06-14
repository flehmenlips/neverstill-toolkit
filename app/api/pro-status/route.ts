import { NextRequest, NextResponse } from 'next/server';
import { getPurchaserAccess, hasPaperAirplanePro } from '@/lib/stripe-purchases';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id') ?? undefined;
  const access = await getPurchaserAccess(sessionId);

  const paperAirplanePro = hasPaperAirplanePro(access.owned);

  return NextResponse.json({
    owned: access.owned,
    paperAirplanePro,
    livemode: access.livemode,
    verified: paperAirplanePro && Boolean(sessionId),
  });
}
