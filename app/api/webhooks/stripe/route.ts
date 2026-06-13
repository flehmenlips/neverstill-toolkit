import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripeClient, getStripeWebhookSecret } from '@/lib/stripe';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  const stripe = getStripeClient();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, getStripeWebhookSecret());
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    console.error('[stripe webhook]', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(
        '[stripe webhook] checkout.session.completed',
        JSON.stringify({
          sessionId: session.id,
          product: session.metadata?.product ?? null,
          customerId: session.customer ?? null,
          customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total,
          currency: session.currency,
          livemode: event.livemode,
        }),
      );
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
