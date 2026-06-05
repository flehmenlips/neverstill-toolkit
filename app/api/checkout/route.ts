import { NextRequest, NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe';
import { getCancelPath, isCheckoutProduct, resolvePriceId } from '@/lib/stripe-prices';
import { getSiteUrl } from '@/lib/site';

function isFormPost(contentType: string): boolean {
  return (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  );
}

function redirectCheckoutError(product: string): NextResponse {
  const path = isCheckoutProduct(product) ? getCancelPath(product) : '/';
  return NextResponse.redirect(`${getSiteUrl()}${path}?checkout=error`, 303);
}

export async function POST(req: NextRequest) {
  let product = 'paperairplane-pro';

  const contentType = req.headers.get('content-type') || '';
  const formPost = isFormPost(contentType);

  if (contentType.includes('application/json')) {
    const body = await req.json();
    product = body.product || product;
  } else if (formPost) {
    const form = await req.formData();
    product = (form.get('product') as string) || product;
  }

  if (!isCheckoutProduct(product)) {
    const message = `Unknown checkout product "${product}".`;
    if (formPost) {
      return redirectCheckoutError(product);
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }

  let priceId: string;
  try {
    priceId = resolvePriceId(product);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Checkout unavailable';
    if (formPost) {
      return redirectCheckoutError(product);
    }
    return NextResponse.json({ error: message }, { status: 503 });
  }

  const siteUrl = getSiteUrl();
  const stripe = getStripeClient();

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${getCancelPath(product)}`,
      metadata: { product },
    });
  } catch {
    if (formPost) {
      return redirectCheckoutError(product);
    }
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }

  if (!session.url) {
    if (formPost) {
      return redirectCheckoutError(product);
    }
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }

  if (formPost) {
    return NextResponse.redirect(session.url, 303);
  }
  return NextResponse.json({ url: session.url });
}
