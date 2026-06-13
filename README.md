# Neverstill Operator Toolkit Hub

Central site for the Neverstill Operator Toolkit ("Tools built by a farmer-chef for farmers, chefs, and families running real small food businesses.").

PaperAirplane is the first live public tool (worksheets + digital packs). FarmForge forecasting, PrepBoard, ChefScale etc. to follow or be added as they are productized.

See the full plan, PA-005 PWA migration spike results, and PaperAirplane MVP details in the sibling PaperAirplane repo (docs/PA-005-SPIKE-RESULTS.md and docs/PWA_MIGRATION_AND_IMPROVEMENT_PLAN.md). The JS PWA port (Canvas + jsPDF) is recommended for hosted experience; Python remains for local CLI/batch/packs. The toolkit hosts the PWA demo at /tools/paperairplane/pwa.

## Getting Started (dev)
```bash
npm run dev
```
Open http://localhost:3000

## Key integration points
- /tools/paperairplane — detailed marketing + buy CTAs (Gumroad + Stripe /api/checkout example)
- /api/checkout — creates Stripe sessions (supports form POST from the pages and JSON)
- /account — customer portal stub (point to real Stripe billing portal)
- Shared branding and cross-promotion baked into the cards and pages.

## Deployment
Vercel is ideal. Set STRIPE_* env vars (see env vars in Vercel project settings). Use `NEXT_PUBLIC_SITE_URL=https://neverstill.dev` for production.

**Production Stripe price IDs (live mode, Sea Breeze Farm account):**
- `STRIPE_PRICE_PAPER_AIRPLANE_PRO=price_1TekEaDy6zALkf5gBuKIO8IF` ($39 one-time)
- `STRIPE_PRICE_FARMFORGE_PRO=price_1TekEfDy6zALkf5gaFtitdEg` ($49 one-time)
- `STRIPE_PRICE_TOOLKIT_PASS=price_1TekEfDy6zALkf5g6roKzvaZ` ($99 one-time)

Repo: https://github.com/flehmenlips/neverstill-toolkit

The /tools/paperairplane/pwa is the hosted PWA demo (client-side JS port of generators for live previews + PDF export). Python CLI in sibling repo for local use and pack creation (Gumroad).

## Monetization paths used here
- Gumroad: fastest for digital PDF packs + "Pro generator license" (create the product, upload zips or fulfillment instructions, use their license keys).
- Stripe (self-hosted): for subscriptions/one-time "Pro access" or "Toolkit Pass", with Customer Portal. Webhooks later for automated fulfillment (email keys, unlock hosted access).
- Hybrid: Sell packs on Gumroad today for immediate revenue; use this hub + Stripe for the "app access" upsell and future recurring.

## Roadmap & Backlog

**Full prioritized backlog, vision, strategy, architecture notes, and agent process live in [docs/PRODUCT_BACKLOG.md](docs/PRODUCT_BACKLOG.md).**

This is the single source of truth (modeled on the sibling PaperAirplane backlog for consistency). Use stable `NT-xxx` IDs for toolkit/hub work. PaperAirplane-specific generator and PWA fidelity work continues to be tracked in the sibling `PaperAirplane/docs/PRODUCT_BACKLOG.md` and the PA-005 plan docs.

### Current high-level status (as of user confirmation June 2026)
- Fully deployed on Vercel at https://neverstill.dev with custom domain.
- Live Stripe keys + prices (paperairplane-pro $39, farmforge-pro $49, toolkit-pass $99 one-time). Smoke tests pass for real checkout session creation.
- PWA demo live at /tools/paperairplane/pwa (Canvas + jsPDF export).
- Basic Stripe integration (checkout forms, /api/checkout, /account success state, webhook skeleton, customer portal stub) in place.
- See `docs/DEPLOY.md` for exact project ID, DNS records, full env var list, webhook registration steps, and remaining checklist items.

### Immediate next focus areas (see full backlog for details + ACs)
1. **NT-002 (P1)**: Enhance the hosted PWA demo with real difficulty, advanced maze logic, braid, validation, solution overlays, etc. ported from sibling `spikes/PA-005-jspdf/`.
2. **NT-013 (P2)**: Mobile strategy & spike — define path to native iOS/Android versions of the toolkit tools (PaperAirplane, FarmForge, etc.) leveraging the existing Expo/EAS workflow, build configs, and App Store processes in the `kitchensync/mobile/mobile` repo (com.neverstill.kitchensync). See full details + ACs in `docs/PRODUCT_BACKLOG.md`.
4. Productize additional tools (FarmForge / PrepBoard / ChefScale) from marketing stubs → real hosted experiences inside the toolkit with the shared billing.
5. PWA installability polish (manifest + service worker) so the whole hub + tools deliver on the "installable, works offline" promise.
6. Content/SEO flywheel + expansion of "From the Farm" stories that feed the tools.

**NT-001 (Stripe ops) complete as of June 2026** — live webhook, portal URL, checkout, and account page verified on production. See `docs/DEPLOY.md` checklist.

The JS PWA in the hub is the primary hosted user experience. Python CLI + batch/packs in the sibling `PaperAirplane` repo remains the creator/power tool. The hub provides the portfolio, brand, billing glue, and cross-sell so one happy customer discovers the next tool.

See sibling AGENTS.md / docs for the overall development workflow (backlog-driven IDs, branch naming, gh PRs only, Bugbot until green, etc.). Local `CLAUDE.md` has Next.js-specific notes.

## Deployment (operational)
See `docs/DEPLOY.md` for the complete production runbook (env vars, DNS, Stripe Dashboard steps, post-deploy checklist). The high-level "Next concrete steps" have been moved into the living `docs/PRODUCT_BACKLOG.md`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
