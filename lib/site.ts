/** Canonical site URL for redirects and Stripe return URLs. */
export function getSiteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (url) return url;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
}

export function isProductionDeploy(): boolean {
  return process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
}
