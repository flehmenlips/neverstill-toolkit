# Neverstill Operator Toolkit Hub

Central site for the Neverstill Operator Toolkit ("Tools built by a farmer-chef for farmers, chefs, and families running real small food businesses.").

PaperAirplane is the first live public tool (worksheets + digital packs). FarmForge forecasting, PrepBoard, ChefScale etc. to follow or be added as they are productized.

See the full plan, PWA migration (PA-005), and PaperAirplane MVP details in the sibling PaperAirplane repo (docs/PWA_MIGRATION_AND_IMPROVEMENT_PLAN.md) and the parallel PA-005 work happening in both repos by separate agents/workflows.

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
Vercel is ideal. Set STRIPE_* env vars (copy .env.example).

This repo is now at https://github.com/flehmenlips/neverstill-toolkit (pushed as part of starting the parallel PA-005 workflow).

For the PaperAirplane side:
- PWA is now the primary hosted experience (see /tools/paperairplane/pwa in this hub for the current spike/demo).
- Python version (local + packs) remains in the sibling PaperAirplane repo.
- The "hosted demo" link in the hub now points to the live PWA demo (no Streamlit needed for basic use).

## Monetization paths used here
- Gumroad: fastest for digital PDF packs + "Pro generator license" (create the product, upload zips or fulfillment instructions, use their license keys).
- Stripe (self-hosted): for subscriptions/one-time "Pro access" or "Toolkit Pass", with Customer Portal. Webhooks later for automated fulfillment (email keys, unlock hosted access).
- Hybrid: Sell packs on Gumroad today for immediate revenue; use this hub + Stripe for the "app access" upsell and future recurring.

## Next concrete steps (PaperAirplane + hub)
1. In PaperAirplane repo (separate agent): continue PA-005 generator port (Pyodide/native web, writing vectors, fidelity).
2. In this toolkit repo: this branch (feat/PA-005-toolkit-pwa-spike) adds the PWA demo page + hub updates. Create PR, merge, deploy to Vercel.
3. Create real Gumroad + Stripe products/links (replace placeholders).
4. Deploy hub to Vercel with real env.
5. Update PaperAirplane tool page and PWA demo as the other agent's work lands (cross-repo coordination).
6. Generate more content on farm sites for SEO.
7. Add other tools (FarmForge etc.) as their PWA or static versions are ready.

This parallel agent setup (one per repo) is a new experiment for me — looking forward to seeing how the PRs and merges interact!

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
