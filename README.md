# Neverstill Operator Toolkit Hub

Central site for the Neverstill Operator Toolkit ("Tools built by a farmer-chef for farmers, chefs, and families running real small food businesses.").

PaperAirplane is the first live public tool (worksheets + digital packs). FarmForge forecasting, PrepBoard, ChefScale etc. to follow or be added as they are productized.

See the full plan and PaperAirplane MVP details in the conversation / project notes.

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

For the PaperAirplane generator web UI itself (the Python/Streamlit piece):
- Easy hosted demo on Render: Web Service, build `pip install -e ".[web]"`, start command the streamlit one with $PORT.
- Link from the hub "Try hosted (Pro)" section.

## Monetization paths used here
- Gumroad: fastest for digital PDF packs + "Pro generator license" (create the product, upload zips or fulfillment instructions, use their license keys).
- Stripe (self-hosted): for subscriptions/one-time "Pro access" or "Toolkit Pass", with Customer Portal. Webhooks later for automated fulfillment (email keys, unlock hosted access).
- Hybrid: Sell packs on Gumroad today for immediate revenue; use this hub + Stripe for the "app access" upsell and future recurring.

## Next concrete steps (PaperAirplane + hub)
1. In PaperAirplane: run `paperairplane batch examples/farm-week-pack.yaml --zip` (and a few more themes) to create real sellable bundles.
2. Create Gumroad store/products, upload the zips + link the generator GitHub + this hub.
3. In this hub: replace the placeholder price_ IDs and gumroad links with real ones. Add real STRIPE_SECRET etc in env on deploy.
4. Deploy the hub (Vercel).
5. (Optional quick win) Deploy a public Streamlit instance of PaperAirplane web for the "hosted demo" link (limit it or protect lightly for MVP).
6. Generate more content / stories on the farm sites and link here for SEO flywheel.
7. Add the other tools as their artifacts are ready (the farm-pnl HTML can live at a static path or separate Render static site and be linked).

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
