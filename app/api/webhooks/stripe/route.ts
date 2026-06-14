import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripeClient, getStripeWebhookSecret } from '@/lib/stripe';
import { purchaseRecordFromSession } from '@/lib/stripe-purchases';

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
      const purchase = purchaseRecordFromSession(session, event.livemode);

      console.log(
        '[stripe webhook] checkout.session.completed',
        JSON.stringify({
          sessionId: session.id,
          product: session.metadata?.product ?? purchase?.product ?? null,
          customerId: session.customer ?? null,
          customerEmail: session.customer_details?.email ?? session.customer_email ?? null,
          paymentStatus: session.payment_status,
          amountTotal: session.amount_total,
          currency: session.currency,
          livemode: event.livemode,
        }),
      );

      if (purchase) {
        console.log(
          '[stripe webhook] purchase_record',
          JSON.stringify({
            type: 'purchase_record',
            ...purchase,
          }),
        );
      } else {
        const reason =
          session.payment_status !== 'paid'
            ? 'unpaid'
            : session.metadata?.product
              ? 'unknown_product'
              : 'unknown_product_or_unpaid';

        console.warn(
          '[stripe webhook] purchase_record_skipped',
          JSON.stringify({
            sessionId: session.id,
            reason,
            paymentStatus: session.payment_status,
            metadataProduct: session.metadata?.product ?? null,
          }),
        );
      }
      break;
    }
    default:
      break;
  }

  return NextResponse.json({ received: true });
}
