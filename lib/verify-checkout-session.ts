import { getStripeClient } from '@/lib/stripe';

/** Confirms a Stripe Checkout session ID represents a completed payment. */
export async function verifyCheckoutSession(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId?.startsWith('cs_')) {
    return false;
  }

  try {
    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === 'paid';
  } catch {
    return false;
  }
}
