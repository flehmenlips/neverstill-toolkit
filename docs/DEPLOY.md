# Deploy: neverstill-toolkit → Vercel (neverstill.dev)

## Live

| Item | Value |
|------|-------|
| **Production URL** | https://neverstill.dev |
| **Vercel project** | `neverstill-toolkit` (`prj_Vabg5BDhjhV2DaSUunh51IvpAyTv`) |
| **Team** | `flehmenlips-projects` |
| **PWA demo** | https://neverstill.dev/tools/paperairplane/pwa |

## Domain plan

| Domain | Use |
|--------|-----|
| **neverstill.dev** | Operator Toolkit hub + hosted PWA |
| **www.neverstill.dev** | CNAME → Vercel (redirect to apex recommended) |
| **neverstill.farm** | Ranch site (`cookbook-site-neverstill` in KitchenSync) |

## DNS (registrar for neverstill.dev)

| Type | Name | Value |
|------|------|-------|
| **A** | `@` | `76.76.21.21` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

## Vercel production env vars

Project → Settings → Environment Variables → **Production** → Redeploy after changes:

```
NEXT_PUBLIC_SITE_URL=https://neverstill.dev
NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PAPER_AIRPLANE_PRO=price_1TekEaDy6zALkf5gBuKIO8IF
STRIPE_PRICE_FARMFORGE_PRO=price_1TekEfDy6zALkf5gaFtitdEg
STRIPE_PRICE_TOOLKIT_PASS=price_1TekEfDy6zALkf5g6roKzvaZ
```

Copy `.env.example` for local dev (use test keys locally).

## Stripe webhook (Dashboard)

1. [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks) → **Add endpoint**
2. **Endpoint URL:** `https://neverstill.dev/api/webhooks/stripe`
3. **Events:** at minimum `checkout.session.completed`
4. Copy **Signing secret** (`whsec_...`) → `STRIPE_WEBHOOK_SECRET` in Vercel → **Redeploy**

The route verifies signatures and logs completed checkouts; extend for license keys / Pro unlock fulfillment.

## Stripe Customer Portal

1. Dashboard → **Settings → Billing → Customer portal** → configure and activate
2. Copy the portal login URL → `NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL`
3. Redeploy

## Monetization

- **Gumroad**: https://gumroad.com/neverstill — digital packs today
- **Stripe Checkout** (`POST /api/checkout`): Pro one-time on neverstill.dev

## Post-deploy checklist

- [x] Production deploy on Vercel
- [x] `neverstill.dev` + SSL
- [ ] `www.neverstill.dev` added in Vercel Domains
- [ ] All production env vars set + redeploy
- [ ] Stripe webhook endpoint + `STRIPE_WEBHOOK_SECRET`
- [ ] Customer portal URL env var
- [ ] Smoke: PWA PDF export, Stripe checkout → `/account?success=true`
