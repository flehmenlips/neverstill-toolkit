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
Vercel is ideal. Set STRIPE_* env vars (copy .env.example). Use NEXT_PUBLIC_SITE_URL=https://neverstill.farm (or .dev).

Repo: https://github.com/flehmenlips/neverstill-toolkit

The /tools/paperairplane/pwa is the hosted PWA demo (client-side JS port of generators for live previews + PDF export). Python CLI in sibling repo for local use and pack creation (Gumroad).

## Monetization paths used here
- Gumroad: fastest for digital PDF packs + "Pro generator license" (create the product, upload zips or fulfillment instructions, use their license keys).
- Stripe (self-hosted): for subscriptions/one-time "Pro access" or "Toolkit Pass", with Customer Portal. Webhooks later for automated fulfillment (email keys, unlock hosted access).
- Hybrid: Sell packs on Gumroad today for immediate revenue; use this hub + Stripe for the "app access" upsell and future recurring.

## Next concrete steps (PaperAirplane + hub)
1. Deploy this hub to Vercel with custom domains (neverstill.farm primary, neverstill.dev alias).
2. Set real Stripe env vars and products/links (replace placeholders).
3. Enhance /tools/paperairplane/pwa using logic from PaperAirplane spikes/PA-005-jspdf (advanced maze with difficulty, solution paths, etc.) for full featured hosted PWA.
4. Generate more content on farm sites (seabreeze.farm, cookbook.farm) for SEO flywheel.
5. Add other tools (FarmForge etc.) as their PWA/static versions ready.
6. (Optional) Integrate more from PaperAirplane spikes (e.g. writing placeholder upgrade in PA-007).

The JS PWA in the hub now serves as the primary hosted experience, complementing the Python in PaperAirplane for creators.

This setup lets us ship narrow valuable slices immediately while the hub provides the portfolio/brand/billing glue. One happy PaperAirplane customer sees FarmForge and the others.

See AGENTS.md / docs in sibling projects for the development workflow used across everything.

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
