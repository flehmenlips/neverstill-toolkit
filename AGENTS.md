<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

Single-package Next.js 16 app (`neverstill-toolkit`). No monorepo, Docker, database, or committed test suite.

### Services

| Service | Port | Notes |
|---------|------|--------|
| Next.js dev | 3000 | Only process required for in-repo E2E |

Start dev in a persistent session (example): `tmux` session `next-dev-server` with `npm run dev` from repo root. Do not rely on one-shot background shells for long-running dev.

### Commands (repo root)

See `package.json` scripts and `README.md`: `npm run dev`, `npm run build`, `npm run start`, `npm run lint`.

### Stripe (optional)

Checkout (`POST /api/checkout`) needs `STRIPE_SECRET_KEY` and `STRIPE_PRICE_*` env vars. Hub home, tool marketing pages, and PaperAirplane PWA (`/tools/paperairplane/pwa`) work without Stripe. README references `.env.example` but it may not be committed—infer vars from `lib/stripe.ts` when testing checkout.

### Hello-world / smoke test

1. `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → `200`
2. Open `/tools/paperairplane/pwa`, click **Regenerate Maze**, then **Export Printable PDF** (client-side jsPDF; no backend beyond static hosting).
