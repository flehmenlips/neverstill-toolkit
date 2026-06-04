import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  let product = 'paperairplane-pro';

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const body = await req.json();
    product = body.product || product;
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const form = await req.formData();
    product = (form.get('product') as string) || product;
  }

  const stripe = getStripeClient();

  // Map your products here (create these in Stripe dashboard first)
  const priceMap: Record<string, string> = {
    'paperairplane-pro': process.env.STRIPE_PRICE_PAPER_AIRPLANE_PRO || 'price_placeholder',
    'farmforge-pro': process.env.STRIPE_PRICE_FARMFORGE_PRO || 'price_placeholder',
    'toolkit-pass': process.env.STRIPE_PRICE_TOOLKIT_PASS || 'price_placeholder',
  };

  const priceId = priceMap[product] || priceMap['paperairplane-pro'];

  const session = await stripe.checkout.sessions.create({
    mode: 'payment', // or 'subscription' for recurring
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/tools/paperairplane`,
    metadata: { product },
  });

  // For form posts, redirect; for JSON, return url
  if (contentType.includes('application/x-www-form-urlencoded')) {
    return NextResponse.redirect(session.url!);
  }
  return NextResponse.json({ url: session.url });
}
