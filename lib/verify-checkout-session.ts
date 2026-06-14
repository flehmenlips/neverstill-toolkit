import { getStripeClient } from '@/lib/stripe';
import { sessionGrantsAccess } from '@/lib/stripe-purchases';

/** Confirms a Stripe Checkout session ID grants active toolkit access. */
export async function verifyCheckoutSession(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId?.startsWith('cs_')) {
    return false;
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent.latest_charge'],
    });
    return sessionGrantsAccess(session);
  } catch {
    return false;
  }
}
