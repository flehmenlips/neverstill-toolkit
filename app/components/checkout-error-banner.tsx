'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutErrorBannerInner() {
  const searchParams = useSearchParams();
  if (searchParams.get('checkout') !== 'error') {
    return null;
  }

  return (
    <div
      role="alert"
      className="border-b border-amber-500/30 bg-amber-950/50 px-6 py-3 text-center text-sm text-amber-100"
    >
      Stripe checkout is temporarily unavailable. Please try again in a moment, or buy packs on{' '}
      <a href="https://gumroad.com/neverstill" className="underline hover:text-white">
        Gumroad
      </a>
      .
    </div>
  );
}

export function CheckoutErrorBanner() {
  return (
    <Suspense fallback={null}>
      <CheckoutErrorBannerInner />
    </Suspense>
  );
}
