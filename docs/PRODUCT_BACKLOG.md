# Neverstill Operator Toolkit — Product Backlog & Roadmap

Single source of truth for the **Neverstill Operator Toolkit** hub at [neverstill.dev](https://neverstill.dev).

This covers:
- The central marketing + discovery hub
- Shared Stripe billing / checkout / customer portal / fulfillment glue
- Hosted PWA experiences (primary end-user UX for tools)
- Cross-promotion and portfolio compounding (one tool buyer discovers FarmForge, PrepBoard, ChefScale, etc.)
- Content flywheel from the real farm/restaurant sites (seabreeze.farm, cookbook.farm, etc.)
- Rollout and productization of additional micro-tools extracted from real operations at Sea Breeze Farm, Coq au Vin, and Neverstill Ranch

**PaperAirplane** is the first public tool. Its detailed generator logic, PDF fidelity, PWA migration spikes, and creator/pack workflows live in the sibling `PaperAirplane` repository (see `docs/PWA_MIGRATION_AND_IMPROVEMENT_PLAN.md`, `docs/PA-005-SPIKE-RESULTS.md`, and its own `PRODUCT_BACKLOG.md`). The toolkit hosts the recommended PWA experience and provides the billing + discovery layer. Python CLI + batch in the sibling remains the power tool for pack creators.

This doc is deliberately modeled on the PaperAirplane backlog for consistency (agent-friendly, stable IDs, clear ACs, process that works with Cursor/Grok + GitHub PRs + Bugbot).

---

## TL;DR for humans — adding a new item

1. Pick the next free **ID** from the [ID counter](#id-counter) below and bump it.
2. Copy the [template](#template) at the bottom of this file.
3. Paste it into the [Backlog](#backlog) section, in the right priority bucket.
4. Fill at least: **title**, `status`, `type`. Everything else can stay blank; the agent will treat blanks as "use sensible defaults / ask if blocked".
5. Commit on a branch + PR (this doc is part of the repo).

**Fastest possible add** (totally fine to start with this, refine later):

```markdown
### NT-NNN — Short title

`status: idea` `type: feature`

One or two sentences on what and why.
```

When ready to hand to an agent, bump to `status: ready` and add **Acceptance criteria** (checkbox list) + (optionally) **Test plan** / **Hints**.

---

## TL;DR for agents — picking up an item

Read this section **once per session** before you touch any backlog item.

1. **Scope.** Find the first `### NT-NNN — ...` heading whose metadata line contains `status: ready`. Use the specific NT-NNN the user mentioned if provided. Re-read its **Acceptance criteria** carefully — those are the contract.

2. **Branch.** Per process (see sibling AGENTS.md and local CLAUDE.md for Next.js notes), never push directly to `main`. Create:
   - `feat/NT-NNN-<short-kebab-desc>` (or `fix/NT-NNN-...`, `chore/NT-NNN-...`).

3. **Commit messages.** Include the backlog ID as the first token:
   - `feat(NT-002/pwa): port advanced maze logic + braid + validation from sibling spikes`
   - `infra(NT-001/stripe): register webhook and set portal URL`

4. **PR title.** Same convention. In the PR body, link back to this file: `docs/PRODUCT_BACKLOG.md#nt-002`.

5. **Status updates.** On the *same* PR branch, in the same commit as the implementation (or follow-up if Bugbot flags), edit this file to:
   - Change `status: ready` → `status: in-progress` when you open the PR.
   - Change to `status: done` and append `merged: YYYY-MM-DD` **only after** the PR is squash-merged to main (human or follow-up sync does this).

6. **Self-verification.** Walk every line in the **Acceptance criteria** checkbox list. Tick `[x]` only after you actually verified it (smoke test on the live Vercel preview or prod, `npm run build`, manual Stripe checkout flow, PWA install test, etc.). Leave `[ ]` and call out anything unverified in the PR.

7. **If blocked.** Update to `status: idea` (or `blocked`), add a `**Blocked on:**` note with exactly what you need from the human, and stop. Surface clearly in your response.

8. **Don't renumber.** IDs are stable forever.

9. **Checks.** Run `npm run build && npm run lint` (or the project's equivalent) before pushing.

---

## Vision & Strategy

**Positioning.** "Practical tools. No spreadsheets." A small, focused collection of high-signal micro-products extracted from years of actually running small food businesses (Sea Breeze Farm — ducks/eggs/pork, Coq au Vin restaurant, Neverstill Ranch). Built by operators, for operators, homeschool families, and chefs.

**Hub model (the "Operator Toolkit").** One branded site (`neverstill.dev`) that:
- Markets and hosts the tools (primarily as installable PWAs for zero-friction end users).
- Provides shared billing (Stripe Checkout + Customer Portal) so one purchase / one account unlocks value across tools.
- Cross-sells: A parent happy with PaperAirplane packs sees FarmForge forecasting for the ranch side of the business, or ChefScale for the restaurant.
- Acts as the "portfolio / compounding" layer for the broader Neverstill concept.

**PWA-first philosophy (see sibling PA-005 docs for full rationale).** 
- Primary *user* experience = pure standalone, installable, offline-capable web apps (Next.js hosted, Canvas/jsPDF or equivalent for print fidelity where relevant).
- Creator / power-user / batch / pack-production paths can (and often should) stay in their native high-fidelity environments (Python + fpdf2/Pillow for PaperAirplane packs today).
- This maximizes distribution while preserving quality for the revenue-generating creator workflows.

**Monetization (hybrid, pragmatic).**
- Gumroad: fastest path for digital packs, themed bundles, "Pro generator license" (upload zips or fulfillment instructions).
- Stripe (self-hosted on the hub): one-time Pro access, Toolkit Pass, future recurring/subscriptions, with Customer Portal.
- Goal: Sell packs on Gumroad *today* for revenue; use the hub + Stripe for the "app access" upsell and long-term relationship.
- Prices live in Vercel env (see `lib/stripe-prices.ts` and `docs/DEPLOY.md`).

**Domains & content flywheel.**
- `neverstill.dev` (+ www) — the Operator Toolkit hub + all hosted PWAs.
- `neverstill.farm` (or ranch subs) — the Neverstill Ranch / content / farmstays / stories site (implemented in the KitchenSync monorepo under `web/sites/neverstill`; has its own vercel.json ignore rules).
- Real content from `seabreeze.farm`, `cookbook.farm`, etc. powers SEO, trust, templates, and "from the farm" stories that feed the tools.

**Architecture notes (high level, for implementers).**
- Next.js 16 App Router (as of current).
- Client-only ("use client") for interactive tool previews/demos (avoids SSR random/prerender issues; see past Bugbot fixes on the PWA demo).
- Stripe integration pattern: `lib/stripe.ts` + `lib/stripe-prices.ts` + `/api/checkout` (form + JSON) + webhook + `/account` + `getSiteUrl()`.
- Shared branding, layout, nav, and "Part of the Neverstill Operator Toolkit" cross-promo in every tool page.
- Tools start as marketing + buy CTAs + external/single-file links, then graduate to hosted PWA subpaths (e.g. `/tools/paperairplane/pwa`).
- Keep the hub lightweight; heavy generator logic lives where it has the best fidelity (sibling repos or new dedicated packages as needed).

**Native mobile distribution (iOS + Android).**
- Primary vehicle: the mature Expo + EAS workflow in the sibling `kitchensync/mobile/mobile` repo (the "cook.book" app under `com.neverstill.kitchensync`, already set up for App Store Connect + Google Play with production profiles, TestFlight, `npx eas build`, Supabase, Stripe React Native, Skia for high-perf drawing, expo-print/sharing/image-picker, deep links, navigation, offline patterns).
- Goal: Native mobile-specific versions (or deeply integrated modules) of the toolkit tools for App Store + Play Store distribution. Enables device-native superpowers (Skia Canvas for PaperAirplane worksheets/mazes instead of web Canvas, camera for ChefScale, native drag/kanban for PrepBoard, print/share sheets, offline SQLite, push for ops alerts) while reusing auth/billing patterns and the kitchensync platform (FarmForge is already crossing over via web embeds + platform docs).
- Strategy options to evaluate in NT-013: modules inside existing cook.book app (shared navigation/auth/billing), dedicated Neverstill app config/scheme in the same monorepo, or universal React Native components shared with the web toolkit.
- Web hub will promote the native apps (badges, "Get on iOS/Android", deep/universal links) once available. See kitchensync/mobile `docs/APP_STORE_SUBMISSION.md`, `MOBILE_WEB_PARITY_AUDIT.md`, `IOS_APP_INTEGRATION_GUIDE.md`, and `roadmap.md` for the established process and parity tracking.

**Success metrics (qualitative to start).**
- First revenue through the hub (Stripe checkouts completing).
- PWA demo used and exported (PDFs look good on paper).
- One customer discovering a second tool.
- Low friction: install PWA from browser, complete checkout in < 3 clicks from a tool page.

---

## Current Production Status (as of June 2026)

- **Live URL**: https://neverstill.dev (Vercel project `neverstill-toolkit`, team `flehmenlips-projects`).
- **PWA demo**: https://neverstill.dev/tools/paperairplane/pwa (live Canvas maze generator with params, themes, PDF export via jsPDF; client-only after PA-005/Bugbot work).
- **Stripe**: Live mode prices configured and smoke-tested (checkout pages load and create real sessions).
  - `STRIPE_PRICE_PAPER_AIRPLANE_PRO=price_1TekEaDy6zALkf5gBuKIO8IF` ($39 one-time)
  - `STRIPE_PRICE_FARMFORGE_PRO=price_1TekEfDy6zALkf5gaFtitdEg` ($49 one-time)
  - `STRIPE_PRICE_TOOLKIT_PASS=price_1TekEfDy6zALkf5g6roKzvaZ` ($99 one-time)
- **Key pages live**: Hub, PaperAirplane marketing + PWA, FarmForge, PrepBoard, ChefScale (stubs with CTAs), /account (success + portal stub), /api/checkout, basic Stripe webhook.
- **Deploy docs**: See `docs/DEPLOY.md` (DNS, env vars, webhook registration steps, customer portal setup).
- **Monetization live**: Gumroad (https://neverstill.gumroad.com/l/mvwhj) + direct Stripe via hub forms.
- **Gaps still open** (see backlog): PWA enhancements (NT-002), hosted depth for the other three tools, installability polish (NT-004), persistent purchase storage beyond Stripe lookup (future).
- **Mobile path**: Planned via kitchensync/mobile/mobile Expo workflow (see NT-013 and Vision section above). No native builds or store listings for toolkit tools yet; web/PWA is the current distribution. FarmForge integration is already happening in the broader kitchensync platform (web + mobile ledgers).

The initial "hub scaffold + PaperAirplane PWA spike" work (PA-005 in sibling + toolkit PR#1) is complete and merged. Deploy is complete (per user confirmation + `docs/DEPLOY.md`).

See sibling docs for the detailed "why PWA + keep Python" decision and generator port plan.

---

## Status legend

| Value | Meaning | Agent should pick up? |
|-------|---------|-----------------------|
| `idea` | Captured but not refined. Minimal description. | **No** — read-only. |
| `ready` | Fully specified with Acceptance criteria. | **Yes** — top priority in order. |
| `in-progress` | Branch/PR open. | **No**. |
| `blocked` | Needs human input/decision/credentials. | **No** — see `**Blocked on:**` note. |
| `done` | Squash-merged to main. History only. | **No**. |
| `cancelled` | Won't fix / superseded. History only. | **No**. |

---

## Type legend

| Value | Meaning |
|-------|---------|
| `feature` | New user-visible functionality. |
| `enhancement` | Improvement to existing feature. |
| `bug` | Defect. |
| `refactor` | Internal cleanup, no behavior change. |
| `infra` | Build, deploy, Stripe integration, envs, packaging, manifest, hosting. |
| `docs` | README, this backlog, DEPLOY.md, marketing copy, AGENTS.md. |
| `chore` | Housekeeping. |

---

## Priority legend

| Value | Meaning | Example |
|-------|---------|---------|
| `P0` | Drop everything — production broken, security, revenue path blocked, core UX dead. | "Stripe checkouts fail in prod after price ID change." |
| `P1` | Next sprint / week. Blocks usability, demo, or immediate revenue ops. | "Webhook not registered; no fulfillment path." |
| `P2` | Important; do in the next few iterations. | "Port real maze difficulty + more generators to the live PWA." |
| `P3` | Nice to have; ambient. | "Add nice-to-have themes or PNG export." |

---

## Effort legend

Rough order-of-magnitude. Signals for planning, not hard commitments.

| Value | Meaning |
|-------|---------|
| `XS` | Single-file edit; < 30 lines. |
| `S` | One PR, 1-2 files, minor verification. |
| `M` | Multi-file PR; new module or significant behavior + tests/smoke. |
| `L` | Multi-PR or large PR; touches multiple areas. |
| `XL` | Multi-week; split into smaller NT- items + possibly a dedicated spike/plan doc. |

---

## ID counter

**Next available ID: `NT-017`**

(NT-001 initial deploy/Stripe; NT-002 PWA; NT-013 mobile strategy. Tracked here for history.)

Bump this when adding a new item. Stable IDs; never reuse.

---

## In flight (snapshot)

Convenience view only. Source of truth is the metadata on each item.

| ID | Title | Status | Notes |
|----|-------|--------|-------|
| NT-001 | Finalize Stripe ops (webhook, portal, basic fulfillment) | done | Verified prod via Vercel + Stripe MCP/CLI, June 2026 |
| NT-002 | Enhance PaperAirplane PWA with production maze generators | in-progress | Branch feat/NT-002-pwa-maze-generators |
| NT-005 | Expand webhook fulfillment and account Pro unlocks | done | PR #8 merged 2026-06-13 |

---

## Backlog

Items grouped by **priority**, then **status** (`ready` before `idea`), then ID. Done/cancelled move to [Archive](#archive).

### P0 — Production & revenue ops (unblock or harden live money path)

### NT-001 — Finalize live Stripe webhook registration, customer portal, and basic fulfillment path

`status: done` `merged: 2026-06-13` `type: infra` `priority: P0` `effort: S` `areas: app/api/webhooks/stripe/route.ts, app/account/page.tsx, lib/, Vercel envs, docs/DEPLOY.md, docs/PRODUCT_BACKLOG.md` `added: 2026-06`

**Why.** Deploy + live prices + smoke-tested checkout pages are done. To turn "confident it will be fine" into a trustworthy production system we need the webhook actually registered in the Stripe Dashboard, the customer portal URL wired and visible, the account page delivering value to purchasers, and the webhook handler + account UI extended at least for logging + the foundation for unlocks (license keys, Pro feature flags, download links). This closes the loop from the "Next concrete steps" that were still open post-deploy.

**Acceptance criteria.**
- [x] Stripe Dashboard → Webhooks: endpoint `https://www.neverstill.dev/api/webhooks/stripe` registered (`we_1TentcDy6zALkf5gEqGe3hje`, live) listening for `checkout.session.completed`.
- [x] `STRIPE_WEBHOOK_SECRET=whsec_...` set for **Production** in Vercel project → redeployed.
- [x] `NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL=https://billing.stripe.com/p/login/9B69ATg468KZ7S81O21ck00` set for Production in Vercel → redeployed.
- [x] Webhook handler extended with structured JSON logging (sessionId, product, customerId, customerEmail, paymentStatus, amountTotal, currency, livemode).
- [x] /account page: success banner clear; portal button prominent and live; Pro unlock note points to NT-005 for future fulfillment.
- [x] Smoke test: live `POST /api/checkout` creates sessions; /account shows portal link; webhook route rejects unsigned POST with 400 (expected). No completed live toolkit purchases yet to verify webhook delivery end-to-end.
- [x] Checklist in `docs/DEPLOY.md` updated; this item marked `done`.
- [x] Error paths (bad price, unknown product) redirect or error without crashing (PR #4).

**Hints.**
- The current webhook already does signature verification and has the switch on `checkout.session.completed`.
- See `lib/verify-checkout-session.ts` (used on the account page for the success banner).
- Test locally with Stripe CLI webhook forwarding if needed before prod.
- Coordinate any price or mode (test vs live) changes with the live values listed in `docs/DEPLOY.md` and `lib/stripe-prices.ts`.

### P1 — Core product experience & first-tool depth

### NT-002 — Enhance the hosted PaperAirplane PWA (`/tools/paperairplane/pwa`) with production-grade generators and difficulty from sibling spikes

`status: in-progress` `type: enhancement` `priority: P1` `effort: M` `areas: app/tools/paperairplane/pwa/page.tsx, app/tools/paperairplane/page.tsx (marketing), lib/paperairplane/, sibling spikes/PA-005-jspdf/` `added: 2026-06`

**Why.** The current PWA demo (recursive backtracking maze + basic braid + themes + live Canvas + jsPDF export) was the PA-005 spike artifact that proved the native web direction. It is cute and works, but still "trivially easy" per original user feedback. The sibling PaperAirplane repo now has real difficulty (PA-006), braid candidates, solution validation (BFS min_path_ratio), seeded PRNG, presets, and polished render logic in `spikes/PA-005-jspdf/`. Port the good parts so the *hosted* experience (the one normal users will actually use) feels substantial and worth the Pro upsell. Keep the Python in the sibling as the creator/pack tool.

**Acceptance criteria.**
- [ ] Port core algorithms: `carvePerfectMaze` (or equivalent recursive backtrack), `applyBraid` (with proper candidate selection), BFS solution validation, `resolveMazeConfig` / difficulty presets, Mulberry32 or equivalent seeded randomness so exports are reproducible when desired.
- [ ] UI/params: expose width/height, braid probability (or difficulty presets: Easy/Medium/Hard), theme. Live update of the canvas on change (config object pattern already in place — preserve the "no stale sliders" behavior).
- [ ] Rendering: support both dark (UI preview) and light (printable export) styles cleanly (offscreen canvas for export already exists — extend it). Add optional solution path overlay (dashed or colored) for Pro or as a toggle.
- [ ] Fidelity & validation: generated mazes have unique solution; effective difficulty matches the Python/ spike expectations (use min_path_ratio or similar guard); exports look good when printed (thick child-friendly walls, GO/FIN, no clipping, proper margins).
- [ ] Marketing page and hub card updated to reflect the improved capabilities (remove "spike in progress" language; highlight new features).
- [ ] No regression on existing export/PDF flow or theme deco.
- [ ] Manual test: generate several sizes + braid levels + themes; export PDFs; spot-check a few on paper or against sibling golden samples if available.
- [ ] Update this backlog item + README references + any comments in the pwa/ code. Cross-link to sibling `spikes/PA-005-jspdf/maze-logic.js` and `render.js`.

**Hints / references.**
- See sibling `spikes/PA-005-jspdf/maze-logic.js`, `render.js`, and the golden samples.
- The current toolkit pwa/ is intentionally simplified (2x grid walls etc.); the spike has the production version — adapt, don't blindly copy if the data model differs.
- Preserve the "use client" + null initial state + useEffect client-only random init pattern (it fixed the prerender Bugbot issues).
- This directly addresses the original user complaint that "the mazes are cute, but trivially easy for even young kids."

### NT-003 — Productize at least one additional tool (FarmForge or PrepBoard or ChefScale) to a real hosted experience inside the toolkit

`status: idea` `type: feature` `priority: P2` `effort: L` `areas: app/tools/farmforge/ (or prep-kanban or recipe-scaler), new components or sub-pwas, shared billing` `added: 2026-06`

**Why.** Today the other three tools are mostly high-quality marketing pages + Stripe buy buttons that link out to single-file GitHub artifacts or "mobile prototype available separately." To deliver on the "Operator Toolkit" promise and the cross-sell vision, at least one (ideally more) needs to graduate to a real, useful, installable/PWA experience *inside* neverstill.dev with the same branding, account, and portal.

**Acceptance criteria (example for FarmForge — adjust per chosen tool).**
- [ ] Decide scope for MVP of the chosen tool inside the hub (e.g. core forecasting scenarios runnable in-browser, PDF export of investor report, simple persistence via localStorage or basic backend).
- [ ] Implement or port the core logic (current canonical is polished single-file HTML at the farmforge-pnl GitHub).
- [ ] Integrate with the existing Stripe "farmforge-pro" price and /account flow.
- [ ] Update marketing copy, hub card status/price, and cross-sell text.
- [ ] Live at `/tools/farmforge` (or equivalent) with "Pro" upsell for hosted/cloud features.
- [ ] Smoke tests + build clean.

**Hints.** Start with the smallest viable slice of the most mature external artifact. Coordinate with any existing repos for the single-file versions. Use the same layout, Stripe patterns, and "Part of the Neverstill Operator Toolkit" footer as PaperAirplane.

### P2 — Polish, distribution, and expansion

### NT-004 — Make the toolkit (and individual tool PWAs) a proper installable PWA with offline support

`status: idea` `type: enhancement` `priority: P2` `effort: S` `areas: app/, public/, next.config, manifest, service worker` `added: 2026-06`

**Why.** The PaperAirplane PWA demo already advertises "installable + offline after load." The hub itself and the other tool pages should deliver on the promise with a real web app manifest (name, icons, start_url, display: standalone, etc.), a service worker (for offline caching of the shell + static assets), and nice install prompts. This is table stakes for the "pure standalone PWA" positioning.

**Acceptance criteria.**
- [ ] `public/manifest.json` (or equivalent via next-pwa or manual) with correct icons (use existing public/ svgs or add pngs), theme color, etc.
- [ ] Service worker registered that caches the app shell and key routes/assets so the hub + at least the PaperAirplane PWA demo works offline after first load.
- [ ] `next.config.ts` or layout updates for proper PWA headers / scope if needed.
- [ ] Test: "Add to Home Screen" / install prompt appears in Chrome/Safari on mobile + desktop; installed app launches to the hub or a tool; basic offline navigation works.
- [ ] Update marketing copy and hub to call out "Installable PWAs — works offline".
- [ ] No breakage to existing Stripe flows or server routes.

### NT-005 — Expand webhook fulfillment and account page to deliver real Pro value / unlocks

`status: done` `merged: 2026-06-13` `type: feature` `priority: P2` `effort: M` `areas: app/api/webhooks/stripe/, app/account/, lib/, possibly a simple license or flag system` `added: 2026-06`

**Why.** "Future: download links for Pro unlocks and license keys" appears in the account page and DEPLOY.md. For PaperAirplane Pro (and future Pro purchases), purchasers should get something tangible beyond the Stripe receipt and portal — e.g. a note that their Gumroad packs include lifetime updates, a displayed "Pro access granted" state for the hosted PWA features, or actual license keys / download links for digital goods. This turns one-time Stripe purchases into perceived ongoing value and reduces support load.

**Acceptance criteria.**
- [x] On `checkout.session.completed`, the webhook does more than log (e.g. record the purchase keyed by customer or session metadata.product).
- [x] /account shows per-product status for the current purchaser (at minimum for the session that just succeeded; later can be made persistent via customer ID lookup).
- [x] At least one concrete unlock: e.g. a "Pro" badge or note on the PaperAirplane page for verified purchasers, or a link to a private Gumroad-style download, or display of a generated license key.
- [x] Graceful handling for test vs live mode purchases.
- [x] Docs updated (DEPLOY.md, this backlog, marketing pages).

**Hints.** Start simple (no full user DB). Use the verified session on /account + customer ID from Stripe for a "recent purchases" view. For real persistence later, a lightweight KV or the existing Supabase patterns from other projects can be added.

### NT-006 — Content & SEO flywheel — expand "From the Farm" section and tool-related pages with real stories/templates from the farm sites

`status: idea` `type: enhancement` `priority: P3` `effort: M` `areas: app/page.tsx, app/tools/*, possibly new /stories or /resources routes, links to seabreeze.farm etc.` `added: 2026-06`

**Why.** The hub already has a teaser "From the Farm & Kitchen" section linking to seabreeze.farm and cookbook.farm. Real operators trust real stories. Turning more of that content into on-hub templates, case studies, or "used in this tool" callouts will improve SEO, trust, and conversion while feeding the tools themselves.

### NT-013 — Define and spike mobile-specific native apps for the Operator Toolkit using the kitchensync/mobile Expo + EAS workflow (iOS App Store + Google Play)

`status: ready` `type: research` `priority: P2` `effort: M` `areas: kitchensync/mobile/mobile (Expo), neverstill-toolkit (PWA sources), docs/, shared auth/billing patterns (Supabase + Stripe RN), app store submission` `added: 2026-06`

**Why.** The web/PWA hub at neverstill.dev provides excellent zero-install reach and the current PaperAirplane PWA demo proves the model. However, native mobile apps unlock deeper device capabilities (high-performance drawing with Skia for worksheets/mazes, camera + photo library for ChefScale recipes, native PDF print/share, offline SQLite for packs/boards, push notifications for farm ops, better touch/keyboard for PrepBoard kanbans, App Store discoverability and "Pro" upsells via in-app). The kitchensync/mobile/mobile repo already has a mature Expo 54 + EAS production workflow (cook.book app, bundle `com.neverstill.kitchensync`, iOS App ID 6758527943, production EAS profiles, TestFlight/App Store submission runbooks in `docs/APP_STORE_SUBMISSION.md`, `IOS_APP_INTEGRATION_GUIDE.md`, `MOBILE_WEB_PARITY_AUDIT.md`, EAS builds, Supabase + Stripe RN + Skia + expo-print/sharing/image-picker, deep links, auth patterns). FarmForge is already being integrated into the broader kitchensync platform (web embeds + mobile mentions). We should reuse this exact workflow (not duplicate a second Expo setup) to ship mobile-specific versions or deeply integrated experiences of the toolkit tools (PaperAirplane, FarmForge, PrepBoard, ChefScale) for iOS and Android stores. This extends the "PWA-first for broad reach, native for power users" strategy.

**Decision Framework: Where should the Neverstill mobile code live? (Key architecture decision for the spike)**

The four main options under consideration (as raised in planning):

1. **Extend kitchensync/mobile/mobile (the cook.book Expo app)** — Add Neverstill tools as tabs, sections, or a "Operator Toolkit" / "Neverstill" flow inside the existing app.
2. **Co-locate in neverstill-toolkit (the current Next.js web repo at neverstill.dev)** — Put RN/Expo code alongside the PWAs and web hub.
3. **Individual per-tool repos** (following the PaperAirplane precedent) — e.g. a PaperAirplane-mobile repo, FarmForge-mobile, etc., separate from everything.
4. **New dedicated repo** — e.g. `neverstill-toolkit-mobile` or `neverstill-mobile` (focused on the toolkit's native experiences).

**Pros / Cons / Tradeoffs (high level):**

- **Option 1 (extend kitchensync/mobile)**:
  - **Pros**: Reuse *everything* already built (EAS builds/submissions, auth patterns, Supabase integration, Stripe RN, navigation, offline, CI, design system, existing bundle `com.neverstill.kitchensync`, platform data like businesses/farms). FarmForge crossover is already happening here. One app for the operator audience. Fastest path to native + App Store presence. Lower long-term maintenance.
  - **Cons**: Brand mixing (cook.book is the social/consumer "cook, share, discover" app for cookbook.farm; Neverstill is the pro "operator toolkit" for farms/chefs/families). Risk of the main app feeling like a kitchen sink. Changes in core mobile can impact Neverstill tools.
  - **Tradeoffs & Concerns**: Speed/consistency vs. brand purity. App Store listing stays under cook.book (with Neverstill content inside). Mitigation: Distinct UI section, dedicated marketing flows, "Neverstill tools in the cook.book app" positioning. Strong fit given the audience overlap (operators using the platform) and your sunk investment in this mobile codebase.

- **Option 2 (inside neverstill-toolkit web repo)**:
  - **Pros**: "Everything Neverstill" in one place (web hub + PWAs + mobile sources co-located).
  - **Cons**: **Strongly discouraged architectural mismatch**. Next.js (webpack/turbopack, React DOM, server components) vs. Expo/RN (Metro bundler, React Native primitives, native modules like Skia). Different dev servers, package resolutions, native code handling, testing. Would require workspaces or heavy separation anyway. Dev experience would be painful; CI would be complex.
  - **Tradeoffs & Concerns**: Convenience for one-person dev vs. technical debt and frustration. Not a best practice for mixed web + native.

- **Option 3 (individual repos per tool)**:
  - **Pros**: Matches PaperAirplane's current model (separate Python creator repo + web PWA hosted in toolkit). Maximum independence per tool (own release cadence, App Store page, marketing, e.g. a focused "PaperAirplane" app for parents vs. pro tools). Clean boundaries.
  - **Cons**: Massive duplication of mobile boilerplate (Expo config, EAS, auth setup, billing integration, submission processes, user account handling for each). Users wanting "the full toolkit" would need multiple apps + potentially fragmented accounts. Cross-selling and "one toolkit experience" harder. High maintenance for shared concerns (updates to Stripe, design tokens, etc.).
  - **Tradeoffs & Concerns**: Independence vs. duplication and user fragmentation. Good for truly standalone products with distinct audiences (like PaperAirplane's creator vs. consumer split), but less ideal for a "suite/hub" like the Operator Toolkit.

- **Option 4 (new neverstill-toolkit-mobile repo)**:
  - **Pros**: Clean product focus and branding (dedicated Neverstill mobile app or experience in App Store, independent of cook.book name). Separation of concerns (web hub stays in neverstill-toolkit). Still allows sharing via packages (e.g. extract generator logic to a shared TS package usable by web PWA and RN). Easier to keep a pure "Neverstill Operator" identity.
  - **Cons**: New repo overhead (another set of CI, secrets, docs, release process). Initial duplication of setup from kitchensync/mobile (unless you copy and factor sharing immediately). Slower to first native build than extending the existing one.
  - **Tradeoffs & Concerns**: Brand independence and focus vs. duplication and extra management. Can start here and later merge sharing or even fold into kitchensync if desired. Good "middle path" if Option 1 feels too mixed-brand.

**Best practices relevant here**:
- For a platform like kitchensync (multi-brand web + mobile + backend with Supabase/Stripe), prefer extending the mobile delivery vehicle for new product lines (amortizes the expensive parts: builds, submissions, auth, distribution).
- Use **product identity inside the app** (tabs, dedicated sections, theming, marketing) rather than app proliferation, unless audiences are truly disjoint.
- For code sharing across web (Next.js) and native (RN): Extract pure logic (generators, business rules, price maps) into shared TypeScript packages early. UI can diverge (Tailwind web vs. RN components/Skia).
- Precedent in your world: PaperAirplane is deliberately separate for its creator workflow; FarmForge is being absorbed into the kitchensync platform. The "Toolkit" sits in between as a branded suite.
- Single-app vs. multi-app: Users (especially busy operators) prefer fewer apps. App Store discoverability and reviews are per-bundle.
- Progressive enhancement: Keep PWAs as the accessible baseline (zero install, works everywhere); native as the enhanced, store-distributed version.
- On the web side, kitchensync already successfully uses a "platform + shared packages + thin brand experiences" pattern (multiple sites like neverstill + shared `@kitchensync/*` packages + scaffolder). The mobile side can evolve similarly.

**User's Refined Preference (Platform Reuse + Discrete Apps)**: You are leaning into Option 1 for the *infrastructure and processes*, but correctly concerned about cramming discrete Neverstill tools/hub into the cook.book consumer/social app binary. The ideal middle path is:

**"Treat `kitchensync/mobile` as your mature mobile *platform*, but fork/split it to produce discrete, independent Neverstill apps (separate bundles, separate App Store / Play Store listings, focused branding and UX)."**

This gives you:
- Full reuse of the proven Expo 54 setup, EAS build pipelines, submission know-how, dependency stack (Skia, Stripe RN, Supabase client patterns, expo-* modules, navigation, etc.), and docs/runbooks.
- Brand and product clarity: A dedicated "Neverstill Operator Toolkit" app (or set of focused tool apps) instead of burying them inside cook.book.
- Still benefits from the platform investment (you don't have to reinvent EAS profiles, App Store Connect setup, release processes, or basic auth/billing integration patterns from scratch).
- The web `neverstill-toolkit` remains the marketing hub + PWA home at neverstill.dev.

This is essentially a disciplined version of Option 4 that deliberately "stands on the shoulders" of the kitchensync mobile platform rather than starting clean.

**Technical realization options** (to evaluate in the spike):
- Copy the `kitchensync/mobile/mobile` project as the starting point for a new `neverstill-toolkit-mobile` (or similar), update `app.json` (name, slug, bundleIdentifier e.g. `com.neverstill.toolkit`, package), and `eas.json` as needed. Pull in shared logic over time via internal packages.
- Restructure the existing kitchensync/mobile into a small monorepo with `apps/cookbook` + `apps/neverstill` (or `apps/neverstill-toolkit`), sharing a `packages/` directory for common components, auth helpers, tool logic (e.g. a port of the PaperAirplane generators using Skia), etc. This mirrors the successful web multi-brand pattern.
- For the "hub": The discrete Neverstill mobile app can be the native counterpart to neverstill.dev — a focused experience that surfaces the toolkit (PaperAirplane as a rich native drawing/PDF tool, etc.).

**Tradeoffs of this hybrid**:
- **Pros**: Best of both — mature platform without brand dilution. Clean App Store presence for Neverstill. Easier to market the toolkit as its own thing on mobile. Still dramatically faster/cheaper than greenfield.
- **Cons**: Slightly more initial duplication than pure "stuff it in cook.book". You will need to decide early on a sharing strategy (packages vs. copy-paste) to avoid long-term maintenance pain. Separate app bundles mean separate review processes and ratings.
- **Key risk to solve**: Identity & billing unification. The current web toolkit is Stripe Checkout + session verification (lightweight, no full accounts). The kitchensync mobile is Supabase Auth heavy. The spike must address how Pro unlocks, purchases, and user identity work across web PWA + native Neverstill app (and potentially cook.book).

**Updated overall recommendation for NT-013**: Adopt the hybrid above as the target architecture. In the spike, explicitly design for *discrete Neverstill apps* that consume/reuse the kitchensync mobile platform's code, configs, and processes. Produce the ADR + a small working spike (e.g. one tool screen) in a separate bundle. Update the ACs and cross-links accordingly. This directly addresses your concern about not overloading cook.book while still getting maximum leverage from the existing mature mobile work.

The ACs below are written to force explicit evaluation of these options during the research & spike phase.

**Acceptance criteria.**
- [ ] Research & decision doc (or section in this backlog + link to new `mobile/docs/NEVERSTILL_TOOLKIT_MOBILE_PLAN.md` or similar in kitchensync/mobile): options evaluated — (a) add Neverstill tools as first-class tabs/modules inside the existing cook.book Expo app (leveraging shared auth, billing, navigation, Supabase), (b) new dedicated "Neverstill" Expo app config / scheme / bundle in the same repo (e.g. com.neverstill.tools or per-tool), (c) universal components shared via monorepo packages between web toolkit and mobile, (d) hybrid (PWA webviews + native shells for key flows).
- [ ] Map existing toolkit features to native capabilities (e.g. PaperAirplane: RN Skia canvas for drawing/writing/mazes instead of HTML5 Canvas + jsPDF → expo-print + sharing; ChefScale: expo-image-picker + manipulation + scaling UI; PrepBoard: drag-and-drop with @shopify/flash-list or reanimated; FarmForge: since already platform-integrated, native screens or embedded).
- [ ] Spike implementation: At least one concrete screen or tool ported/runnable in the mobile Expo dev client (e.g. a PaperAirplane maze generator using Skia + params + export via expo-print/sharing; or a simple PrepBoard kanban using existing navigation/bottom-tabs).
- [ ] Auth/billing integration spike: Demonstrate Supabase session sharing or Stripe RN checkout flow that aligns with the web `lib/stripe-prices.ts` products (paperairplane-pro etc.) and /account success.
- [ ] Update neverstill-toolkit web hub (e.g. footer, tool pages, or new /mobile promo) with "Get the iOS/Android app" links or badges (App Store / Play Store once submitted, or TestFlight/internal for now). Use expo-linking style deep links if possible.
- [ ] Document the chosen path, build commands (`npx eas build --platform ios --profile production` etc.), submission steps (reuse/extend APP_STORE_SUBMISSION.md for Neverstill branding), and any new env vars or schemes.
- [ ] Cross-link: Add reference in kitchensync/mobile `docs/roadmap.md` or relevant ledger; add note in neverstill-toolkit README and this backlog.
- [ ] Verify build: Successful EAS preview or dev build for iOS simulator + Android; smoke the spiked tool on device.
- [ ] Update this item to `done` (with merged date) + add follow-on items (full ports, store listings) only after human review of the spike + decision.

**Test plan / verification.**
- Run the mobile dev client and exercise the spiked tool end-to-end (generate maze → export/share PDF or image).
- Check parity notes against web PWA (fidelity of drawings/PDFs, offline behavior).
- Confirm no breakage to existing cook.book flows if integrating as modules.
- For submission path: Follow the checklist in mobile/docs/APP_STORE_SUBMISSION.md (metadata, screenshots from dist/ or new, EAS production build, TestFlight, App Store Connect).

**Hints.**
- Start in the kitchensync/mobile/mobile directory (that's the Expo workflow the user specified).
- Leverage existing deps: @shopify/react-native-skia (excellent for vector/Canvas-like drawing, better perf than web for complex mazes), expo-print, expo-sharing, expo-image-picker, expo-file-system, Stripe RN, Supabase client, React Navigation, bottom tabs, flash-list.
- Look at current app structure (app/ with expo-router, screens for recipes/posts/reservations/business, FarmForge mentions in platform docs).
- For PaperAirplane specifically, the web PWA code in neverstill-toolkit/app/tools/paperairplane/pwa/page.tsx (generateMaze, draw on canvas, jsPDF export) can be the spec; port logic to RN/Skia equivalents (see sibling spikes too for algorithms).
- Auth: the mobile uses Supabase; web toolkit currently uses Stripe sessions (no full user accounts yet) — plan a lightweight shared identity (email + Stripe customer ID, or introduce Supabase Auth for Pro unlocks across web+mobile).
- Deep links: mobile already has intent filters for cookbook.farm; plan neverstill.dev or cook.farm links for toolkit tools.
- Branding: Bundle/package is already com.neverstill.kitchensync — fits "Neverstill" tools perfectly. May want separate "Neverstill" app name or section inside cook.book.
- See also: mobile/docs/MOBILE_WEB_PARITY_AUDIT.md (for how they track web vs native), IOS_APP_INTEGRATION_GUIDE.md, LAUNCH_AND_RELEASE_READINESS.md, and the kitchensync-web FarmForge integration docs (since FarmForge is crossing over).
- After spike, the follow-ups (full ports of the 4 tools, store submission for Neverstill experience, promotion in web hub) can become NT-014, NT-015, etc.
- Update the "In flight" and lower-priority list in this doc.

### Lower priority / ideas (P3 and beyond)

- NT-007: Add real hosted depth or PWA ports for the remaining tools (PrepBoard kanban multi-user lite, ChefScale scaling + AI + photos).
- NT-008: Toolkit Pass experience — one purchase unlocks "Pro" across multiple tools with a unified dashboard view.
- NT-009: Improve AGENTS.md / process docs in this repo (copy/adapt the best parts from the sibling so toolkit work can stand alone).
- NT-010: Analytics / simple usage (e.g. which tools get the most demo use) to inform prioritization.
- NT-011: Subscription options in addition to one-time (for recurring Pro or "Toolkit membership").
- NT-012: Full monorepo / KitchenSync integration notes or a shared design system component library.
- NT-014: Full native mobile implementations of the core tools (PaperAirplane with Skia drawing/PDF, FarmForge scenarios, PrepBoard kanban, ChefScale photo+scaling) inside the kitchensync/mobile Expo app or dedicated Neverstill experience, following the spike from NT-013. Reuse existing EAS profiles, Supabase/Stripe RN, expo-* modules.
- NT-015: App Store Connect + Google Play Console submissions, metadata, screenshots, review, and release for the Neverstill mobile app(s) (or integrated features), following/reusing `kitchensync/mobile/docs/APP_STORE_SUBMISSION.md`, `LAUNCH_AND_RELEASE_READINESS.md`, etc. Include TestFlight / internal Android tracks.
- NT-016: Promote native mobile apps from the web hub (app store badges, "Also available on iOS/Android", deep link handling) + update tool marketing pages. Add universal links / app links support.
- Domain finalization & ranch site launch on neverstill.farm (coordinate with the kitchensync site).
- PWA-specific enhancements: solution overlays, writing stroke order (vector data per PA-007), more themes/generators, PNG export option, etc. (many of these can be broken out from sibling backlog items).

---

## Archive (done / cancelled)

Items here are for history. Do not pick up.

- **NT-001** — Finalize live Stripe webhook registration, customer portal, and basic fulfillment path (`merged: 2026-06-13`). See `docs/DEPLOY.md` checklist and PR for verification commit.
- **NT-005** — Expand webhook fulfillment and account Pro unlocks (`merged: 2026-06-13`). PR #8 — purchase_record webhook logging, /account Pro status, /api/pro-status, PaperAirplane PWA 28×28 + solution path gates.
- Initial hub scaffold + PaperAirplane PWA spike (PA-005 context) + Bugbot fixes + first deploy to neverstill.dev + live Stripe prices (largely complete before/around the creation of this doc; tracked as the foundation for NT-001 onward). See GitHub PR history for the toolkit repo and sibling spikes/PA-005 results.

---

## Template for new items

Copy from here down when adding.

### NT-NNN — One-line title that is searchable

`status: idea` `type: feature` `priority: P2` `effort: S` `areas: app/..., docs/...` `added: 2026-06`

**Why.** 2–4 sentences. Link to any relevant sibling doc, issue, or real-world pain from the farm/kitchen.

**Acceptance criteria.**
- [ ] Concrete, verifiable checkbox 1.
- [ ] Concrete, verifiable checkbox 2 (include "update this backlog item and related docs" as the last one).

**Test plan / verification.**
- Manual steps, `npm run build`, Stripe test checkout, print a PDF and look at it on paper, etc.

**Hints.**
- Anything that will save the agent time (exact files, existing patterns to copy, "use the same Stripe flow as checkout", "see sibling spikes/...", "preserve the client-only init pattern that fixed the last Bugbot round").

---

**End of backlog.** When adding items, keep the template at the bottom and the ID counter accurate. Update the "In flight" snapshot occasionally for human readers.

This file + the live site + the sibling PaperAirplane docs + `docs/DEPLOY.md` together constitute the current production plan and spec for the Neverstill Operator Toolkit.
