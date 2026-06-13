# Deploy: neverstill-toolkit → Vercel (neverstill.dev)

## Live

| Item | Value |
|------|-------|
| **Production URL** | https://www.neverstill.dev (apex `neverstill.dev` redirects here) |
| **Vercel project** | `neverstill-toolkit` (`prj_Vabg5BDhjhV2DaSUunh51IvpAyTv`) |
| **Team** | `flehmenlips-projects` |
| **PWA demo** | https://neverstill.dev/tools/paperairplane/pwa |

## Domain plan

| Domain | Use |
|--------|-----|
| **neverstill.dev** | Apex; redirects to www (Vercel) |
| **www.neverstill.dev** | Canonical Operator Toolkit hub + hosted PWA |
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
2. **Endpoint URL:** `https://www.neverstill.dev/api/webhooks/stripe` — use the **www** host directly. Stripe does not follow redirects; do not register the apex URL even though browsers redirect apex → www.
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

See the living prioritized backlog in `docs/PRODUCT_BACKLOG.md` (especially NT-001 and related items) for the current state of operational follow-ups. This file is the runbook snapshot.

- [x] Production deploy on Vercel (live at https://neverstill.dev)
- [x] `neverstill.dev` + SSL
- [x] `www.neverstill.dev` added in Vercel Domains
- [x] All production env vars set + redeploy (live Stripe keys, prices, webhook secret, portal URL — verified via Vercel env + Stripe MCP/CLI, June 2026)
- [x] Stripe webhook endpoint registered (`we_1TentcDy6zALkf5gEqGe3hje`, live, `checkout.session.completed` → `https://www.neverstill.dev/api/webhooks/stripe`) + `STRIPE_WEBHOOK_SECRET` in Vercel
- [x] Customer portal URL env var wired and visible on /account (`https://billing.stripe.com/p/login/9B69ATg468KZ7S81O21ck00`)
- [x] Smoke: PWA PDF export; live checkout session creation (`POST /api/checkout`); webhook route returns 400 without signature (expected); portal button live on /account

**Full product roadmap, vision, and next NT-xxx items:** [docs/PRODUCT_BACKLOG.md](PRODUCT_BACKLOG.md) (includes Stripe fulfillment, PWA depth for PaperAirplane + other tools, etc.).
