import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { getCancelPath, resolvePriceId } from '@/lib/stripe-prices';
import { getSiteUrl } from '@/lib/site';

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

  let priceId: string;
  try {
    priceId = resolvePriceId(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout unavailable';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      return NextResponse.redirect(`${getSiteUrl()}${getCancelPath(product)}?checkout=error`, 303);
    }
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const siteUrl = getSiteUrl();
  const stripe = getStripeClient();

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}${getCancelPath(product)}`,
    metadata: { product },
  });

  if (!session.url) {
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }

  if (contentType.includes('application/x-www-form-urlencoded')) {
    return NextResponse.redirect(session.url, 303);
  }
  return NextResponse.json({ url: session.url });
}
