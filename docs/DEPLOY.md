# Deploy: neverstill-toolkit → Vercel (neverstill.dev)

## Domain plan

| Domain | Use |
|--------|-----|
| **neverstill.dev** | Operator Toolkit hub + hosted PWA (`/tools/paperairplane/pwa`) |
| **neverstill.farm** | Ranch site (separate Vercel project: `cookbook-site-neverstill` in KitchenSync) |

## DNS (at your registrar for neverstill.dev)

| Type | Name | Value |
|------|------|-------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

After adding domains in Vercel, run `vercel domains inspect neverstill.dev` to confirm verification.

## Vercel production env vars

Set in Project → Settings → Environment Variables (Production):

```
NEXT_PUBLIC_SITE_URL=https://neverstill.dev
STRIPE_SECRET_KEY=sk_live_...          # from Stripe Dashboard (never expose in git)
STRIPE_WEBHOOK_SECRET=whsec_...        # after creating webhook endpoint
STRIPE_PRICE_PAPER_AIRPLANE_PRO=price_1TekEaDy6zALkf5gBuKIO8IF
STRIPE_PRICE_FARMFORGE_PRO=price_1TekEfDy6zALkf5gaFtitdEg
STRIPE_PRICE_TOOLKIT_PASS=price_1TekEfDy6zALkf5g6roKzvaZ
```

Stripe webhook URL (production): `https://neverstill.dev/api/webhooks/stripe` (add route when ready).

## Monetization

- **Gumroad**: https://gumroad.com/neverstill — packs today
- **Stripe Checkout** (`/api/checkout`): Pro one-time on neverstill.dev
