# Tyre on Cloud — Project Progress

Last updated: 2026-06-23
Live site: https://tyreoncloud-team793s-projects.vercel.app
Supabase project: https://supabase.com/dashboard/project/ognoyinorqkthcjcabiy

---

## What's Already Done

| Area | Status |
|---|---|
| Full Next.js 16 project scaffolded in `tirehub/` | ✅ Done |
| npm install | ✅ Done |
| Supabase database created and connected | ✅ Done |
| Database migration run (tables, RLS, triggers, indexes) | ✅ Done |
| 489 real products imported from ERP CSV | ✅ Done |
| 2 warehouses created (Warehouse 1 = โกดัง, Warehouse 2 = โกดัง 2) | ✅ Done |
| Shop page connected to real database (no mock data) | ✅ Done |
| Deployed to Vercel production | ✅ Done |
| Git repository initialized | ✅ Done |
| Rebranded TireHub → Tyre on Cloud (title, footer, i18n keys, Vercel project name) | ✅ Done |
| i18n (Thai/English) via `lib/i18n.ts` + `LanguageContext` | ✅ Done |
| Mobile floating-button overlap fixed (AI panel + filter sheet icons collapse on small screens) | ✅ Done |
| TyreVisualizer sidewall-ring sizing fixed (was overflowing its mobile container) | ✅ Done |
| AI Fitment Assistant chat panel removed — LINE button is the sole "talk to us" channel | ✅ Done |
| Dead code removed (`lib/utils.ts`, `lib/shop/mockData.ts` — both unused, zero imports) | ✅ Done |
| Desktop folder decluttered — old flat-file extracts and demo `.jsx` drafts moved to `_archive/` | ✅ Done |
| Dealer matrix mobile redesign — card layout below `lg`, table unchanged at `lg`+ | ✅ Done |
| Login/account system removed entirely — site is catalog-only, LINE OA handles sales | ✅ Done |
| Product image plumbing — real photo support + brand-tinted icon placeholder | ✅ Done |
| SEO basics — sitemap.xml, robots.txt, canonical/OG/Twitter metadata, dynamic OG image | ✅ Done |
| Retail cart & checkout — bank transfer / COD, orders saved to DB | ✅ Done |
| GitHub repo created + connected to Vercel for auto-deploy on push | ✅ Done |
| 15 stale `tirehub-*` Vercel deployments + 2 old aliases deleted (pre-rename leftovers) | ✅ Done |
| Dealer header now says "Tyre on Cloud" (was "B2B Authorized Dealer Matrix") | ✅ Done |
| Hero brand banner card fixed — was clipping content on short mobile viewports | ✅ Done |

### Components

| Component | Notes |
|-----------|-------|
| `components/shared/Navbar.tsx` | Sticky, TH/EN toggle, LINE button, mobile overlay |
| `components/shared/Footer.tsx` | Brand, links, payment badges, Thai address, copyright |
| `components/shared/Logo.tsx` | SVG tyre icon + "Tyre on Cloud" wordmark |
| `components/shared/LineFloatingButton.tsx` | Fixed bottom-right LINE button (landing page only) |
| `components/landing/Hero.tsx` | Promo banner, 2-col layout, stats, brand strip |
| `components/landing/HeroBrandBanner.tsx` | Animated tyre + brand cycling (8 brands, 2.2s interval) |
| `components/landing/FeaturedCatalog.tsx` | Real products from DB, brand filter tabs, top 8 by stock |
| `components/landing/TyreFinderSection.tsx` | Section wrapper for TyreFinder with i18n heading |
| `components/landing/TyreVisualizer.tsx` | Car type selector with tyre visualizer |
| `components/tyre-finder/TyreFinder.tsx` | Search by size / vehicle / plate, full i18n |
| `components/shop/*` | RetailView (B2C), DealerMatrix (B2B), MobileFilterSheet, ShopHeader |

### Known bug fixes already applied
- `getTierPrice()` crash on empty `pricingTiers[]` — guarded in `lib/shop/pricing.ts`
- Retail shop "No results" — price filter now skips products with `priceRetail === 0`
- Dealer warehouse filter "No results" — derives real warehouse IDs from product data (not hardcoded)
- Dealer page 404 — route now works at `/shop?mode=dealer`

---

## Tech Stack
- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4 (CSS-first `@theme` tokens in `globals.css`)
- **Animation:** Framer Motion
- **State:** Zustand v5 (`useShopStore`, `useFilterStore`)
- **Data:** TanStack Query v5 + Supabase (DB only, no Auth) + Prisma (489 real products)
- **i18n:** Custom (`lib/i18n.ts` + `LanguageContext`)
- **No login/auth system** — removed deliberately 2026-06-23, see TO-DO #3. No middleware/`proxy.ts` either (its only job was refreshing a session that no longer exists).
- **Git:** GitHub repo `team793/tyre-on-cloud`, connected to Vercel for auto-deploy on push to `master`.

---

## Project Folder Structure

```
C:\Users\WINDOWS 11\Desktop\tyre on cloud\
├── tirehub/                    ← the real, deployed project (everything below is inside here)
│   ├── app/
│   │   ├── layout.tsx          ← fonts, metadata, providers (no session/auth fetch anymore)
│   │   ├── globals.css         ← Tailwind @theme tokens (colours, fonts)
│   │   ├── page.tsx            ← landing page
│   │   ├── shop/page.tsx       ← /shop route (B2C + B2B, both open, no login)
│   │   ├── checkout/page.tsx   ← retail checkout (bank transfer / COD)
│   │   ├── sitemap.ts / robots.ts / opengraph-image.tsx ← SEO
│   │   └── api/
│   │       ├── products/route.ts ← reads from Supabase via Prisma (full data, no role check)
│   │       └── orders/route.ts   ← creates orders server-side, recomputes prices, guest-only
│   ├── components/
│   │   ├── landing/            ← Hero, HeroBrandBanner, FeaturedCatalog, TyreVisualizer
│   │   ├── shared/              ← Navbar, Footer, LineFloatingButton, Logo, TyreThumbnail
│   │   ├── tyre-finder/         ← TyreFinder.tsx (search by size / vehicle / plate)
│   │   ├── shop/                ← ShopPageClient, RetailView, DealerMatrix, DealerCard,
│   │   │                          RetailCartDrawer, ShopHeader, MobileFilterSheet
│   │   ├── checkout/             ← CheckoutPageClient.tsx
│   │   └── ui/                  ← select, slider, tabs (shadcn-style primitives)
│   ├── hooks/                   ← useProducts, useRetailCart, useFilters, useTyreFinder
│   ├── stores/                  ← filterStore.ts, shopStore.ts (Zustand)
│   ├── lib/
│   │   ├── prisma.ts            ← Prisma client singleton
│   │   ├── site.ts              ← SITE_URL — update this when the custom domain attaches
│   │   ├── shop/pricing.ts      ← price/margin/freight calculation helpers
│   │   ├── shop/format.ts       ← display formatting helpers
│   │   └── tyreFinder/fitmentData.ts ← tyre size cascade data (still mock, see TO-DO #4)
│   ├── context/                 ← QueryProvider, LanguageContext (no session provider anymore)
│   ├── types/shop.ts             ← TyreProduct, WarehouseStock, PricingTier types
│   ├── prisma/schema.prisma       ← database schema (Prisma) — includes Order/OrderItem models
│   ├── supabase/migrations/       ← 0001_init.sql, 0002_rename_winter_to_rainy.sql,
│   │                                 0003_orders.sql — all run already, DO NOT re-run
│   ├── scripts/
│   │   ├── migrate.mjs           ← node --env-file=.env.local scripts/migrate.mjs <file>
│   │   └── import-stock.mjs      ← import ERP CSV → Supabase (re-run when stock changes)
│   └── .env.local                ← real Supabase keys (DO NOT commit to git)
├── stock data/                   ← drop new ERP CSV exports here
└── _archive/                     ← old flat-file extracts + demo drafts, kept for reference only
```

---

## Database (Supabase)
```
public.profiles         — one row per user, role = 'customer' or 'dealer'
public.products         — 489 rows (real tyre inventory)
public.warehouses       — 2 rows: Warehouse 1, Warehouse 2
public.inventory        — stock quantity per product per warehouse
public.pricing_tiers    — volume pricing for dealers (empty — see TO DO #1)
public.orders           — retail orders (bank_transfer / cod), guest or logged-in
public.order_items      — line items per order, snapshots product name/sku/price
```
All 489 products currently have `price_retail = 0` / `price_dealer = 0` (ERP export had no prices yet — shop shows "ติดต่อสอบถามราคา" / "Contact for pricing").

---

## TO DO — Ordered by Priority

### 1. Add Prices (When ERP Has Them)
All 489 products have `price_retail = 0` and `price_dealer = 0`.

- **Option A — ERP exports a price file (fastest):** put the CSV in `stock data/` and ask Claude Code to match by SKU/size and update `price_retail` / `price_dealer`.
- **Option B — Manual:** Supabase Table Editor → `products` → edit `price_retail` / `price_dealer` per row.
- **Option C — Dealer volume tiers** (run in Supabase SQL Editor once retail prices exist):
  ```sql
  INSERT INTO public.pricing_tiers (product_id, min_qty, max_qty, price_per_unit)
  SELECT id, 1, 9, price_retail * 0.85 FROM public.products WHERE price_retail > 0;
  INSERT INTO public.pricing_tiers (product_id, min_qty, max_qty, price_per_unit)
  SELECT id, 10, 39, price_retail * 0.80 FROM public.products WHERE price_retail > 0;
  INSERT INTO public.pricing_tiers (product_id, min_qty, max_qty, price_per_unit)
  SELECT id, 40, NULL, price_retail * 0.75 FROM public.products WHERE price_retail > 0;
  ```

### 2. Re-import Stock When ERP File Changes
```bash
cd "C:\Users\WINDOWS 11\Desktop\tyre on cloud\tirehub"
node scripts/import-stock.mjs "C:\Users\WINDOWS 11\Desktop\tyre on cloud\stock data\YOUR-NEW-FILE.csv"
```
Uses `ON CONFLICT (sku) DO UPDATE` — safe to re-run.

### 3. User Authentication — built, then deliberately removed (2026-06-23)
Auth (sign in/up, role-gated dealer mode) was built earlier this session, then the owner reversed that decision: **this site is a product catalog/showcase that drives customers to LINE OA for the actual sale — not a transactional app, so no login/account system at all.** Forcing signup before browsing Dealer mode was bad UX for that model. Removed entirely:
- Deleted `app/auth/` (page + callback route), `components/shared/AuthControl.tsx`, `components/shop/DealerAccessGate.tsx`, `context/SupabaseSessionProvider.tsx`, `lib/supabase/client.ts` + `server.ts`, and `proxy.ts` (middleware whose only job was refreshing a Supabase session that no longer exists).
- `components/shop/ShopPageClient.tsx`: Dealer mode now renders `DealerMatrix` directly, same as Retail — no redirect, no gate.
- `app/api/products/route.ts`: no more dealer/customer branching — always returns full data (`pricingTiers`, `inventory`/warehouse stock) to everyone, since there's no way to tell visitors apart anymore.
- **Consequence to remember**: once real ERP prices load (TO-DO #1), the Dealer view's volume-pricing tiers will be publicly visible to any visitor, not just "dealers" — there's no access control left to bring back without rebuilding auth. Fine for now since those numbers are all ฿0 placeholders.
- Backend Supabase Auth tables/RLS (`profiles`, `is_dealer()`, the `orders_select_own` policy, etc.) were deliberately left untouched in the database — removing schema is riskier than removing frontend code, and it costs nothing to leave unused. `/api/orders` now always creates guest orders (no `userId` lookup).
- Build output changed nicely as a side effect: `/`, `/shop`, `/checkout` are now static pages (○) instead of dynamic (ƒ), since nothing depends on cookies/session at request time anymore.

### 4. Connect TyreFinder to Real Database — partially done
Size-based search already queries the real DB live (`TyreFinder.tsx` → `hooks/useProducts.ts` → `/api/products?width=&profile=&rimSize=`, indexed Prisma columns, no migration needed). The old dead mock hook `hooks/useFilters.ts`'s `useMatchingTyres()` was removed (2026-06-23) — it had zero call sites. What's still genuinely mock: vehicle/plate lookup (`hooks/useTyreFinder.ts` + `lib/tyreFinder/fitmentData.ts`, 8 hardcoded vehicles / 3 plates) — needs a real vehicle-fitment dataset or external API (e.g. TecDoc, DVLA-style plate lookup). Medium-large effort, mostly external-data-source integration.

### 5. Add Product Images — plumbing done (2026-06-23), real photos still needed
All cards used to show a 🛞 emoji. `image_url` is still NULL for every product, but the plumbing is now in place:
- `types/shop.ts`'s `TyreProduct.imageUrl` (replaces the old `imageEmoji` field) flows through `hooks/useProducts.ts` from the existing `image_url` column.
- New `components/shared/TyreThumbnail.tsx`: renders the real photo via `next/image` when `imageUrl` is set, otherwise a brand-tinted SVG tyre-icon placeholder (deterministic color per brand name — no more bare emoji). Used in `RetailProductCard.tsx`, `DealerCard.tsx`, `DealerRow.tsx`.
- `components/landing/FeaturedCatalog.tsx`'s `ProductCard` shows the real photo when available, otherwise keeps its existing bespoke animated tyre-ring illustration unchanged.
- `next.config.ts` already whitelists `*.supabase.co/storage/v1/object/public/**` for `next/image` — uploading photos to a **Supabase Storage public bucket** and running `UPDATE public.products SET image_url = '<storage public URL>' WHERE brand = '...'` (or per-SKU) will make them appear immediately, no code changes needed.

### 6. SEO & Metadata — ✅ Done (2026-06-23)
- `app/sitemap.ts` (`/sitemap.xml`) and `app/robots.ts` (`/robots.txt`) added — only `/api/` is disallowed (`/auth` no longer exists, see TO-DO #3).
- `app/layout.tsx` and `app/shop/page.tsx` metadata now include `metadataBase`, `alternates.canonical`, `openGraph`, and `twitter` (summary_large_image) blocks.
- `app/opengraph-image.tsx` generates a branded 1200×630 social-preview image on the fly via `next/og` — no static asset needed, auto-applied to all pages' `og:image`.
- `lib/site.ts` holds `SITE_URL` as the single source of truth (currently the Vercel subdomain) — **update this the moment the `tyreoncloud.app` custom domain (TO-DO #10) is attached**, everything else (canonical URLs, sitemap, OG) derives from it.

### 7. Order / Cart / Checkout — ✅ Done for retail (2026-06-23), dealer ordering still RFQ-only
Retail (B2C) checkout is fully built, no payment-gateway account needed (bank transfer / COD only, per owner's choice — no Stripe/Omise costs yet):
- New migration `supabase/migrations/0003_orders.sql` → `public.orders` + `public.order_items` tables. No insert policy for anon/authenticated — orders are only ever created server-side via `POST /api/orders` (`app/api/orders/route.ts`), which **always recomputes prices from the live `products` table**, never trusts a price from the client. Logged-in customers can later read back their own orders (`orders_select_own` RLS policy); guests reference their order number via LINE instead.
- `components/shop/ShopHeader.tsx` now has a cart icon + badge (retail mode only) opening `components/shop/RetailCartDrawer.tsx` (qty stepper, remove, subtotal/total, "Proceed to Checkout").
- `app/checkout/page.tsx` + `components/checkout/CheckoutPageClient.tsx`: delivery-details form, Bank Transfer / Cash-on-Delivery payment choice, order summary, and an inline confirmation view (avoids needing to re-fetch the order under RLS for guests) with an order number and a "Message us on LINE" CTA for bank-transfer payment details.
- Shared `hooks/useRetailCart.ts` joins the `retailCart` store state with live product data and computes totals — used by both the drawer and the checkout page.
- `components/shared/Logo.tsx` gained a `theme="light"` variant (was hardcoded for dark backgrounds only) for the checkout page's white header.
- Verified end-to-end with Playwright: add-to-cart → drawer → checkout form → order created in DB with correct server-computed totals and product snapshot → confirmation screen. Test order deleted after verification.
- **Still not done**: no "my orders" history page for logged-in customers (RLS already supports it, just needs a UI), no order-status admin view (use Supabase Table Editor on `orders`/`order_items` for now), dealer ordering is still the quoting/RFQ workflow via the dealer matrix + LINE (intentionally out of scope — it's a B2B quoting tool, not a self-serve checkout).

### 8. Connect GitHub to Vercel for Auto-Deploy — ✅ Done (2026-06-23)
GitHub repo `team793/tyre-on-cloud` created (it didn't exist before, despite `git remote` pointing at it), connected in the Vercel dashboard (Settings → Git), production branch = `master`. **`git push` now auto-deploys to production within ~40s** — no more manual `vercel --prod` needed day-to-day (it still works as a fallback if ever needed).
- First push was blocked by GitHub's secret-scanning push protection: two early commits had a live-looking Vercel access token in a long-deleted `CONTINUE-HERE.md`. Fixed by pushing a single clean squashed commit instead of full history.
- **Your full original local commit history (40+ commits) is preserved forever under the git tag `backup-full-history-2026-06-23`** — run `git log backup-full-history-2026-06-23` to see it. Nothing was lost; only what got uploaded to GitHub changed.
- **Still needs doing: rotate that exposed Vercel access token** (Vercel dashboard → Settings → Tokens → delete the old one, create a new one if still needed for CLI deploys). Flagged multiple times this session, not yet confirmed done — check first thing next session.

### 9. Dealer Matrix Mobile Layout — ✅ Done (2026-06-23)
Below the `lg` breakpoint, `DealerMatrix` now renders `DealerCard` (new component, card-based) instead of the 10-column table. The table is unchanged and still shown at `lg`+ (horizontally scrollable, first column pinned via `sticky left-0`). Keyboard up/down navigation between qty fields works independently in each layout (separate ref arrays so a hidden layout's inputs never steal focus).

### 10. Connect the `tyreoncloud.app` Custom Domain — on hold (owner's choice, 2026-06-23)
Attached to the Vercel project (`vercel domains add tyreoncloud.app`, done 2026-06-23), but DNS is not configured — `vercel domains inspect tyreoncloud.app` still warns it needs `A tyreoncloud.app 76.76.21.21` set at the registrar. **Owner said they haven't actually registered/paid for this domain yet and wants to finish building the site before paying for hosting/domain** — don't pursue further unless asked. The live site keeps working fine at `tyreoncloud-team793s-projects.vercel.app` in the meantime.

---

## Environment Variables
In `.env.local` (never commit) and already set in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
DIRECT_URL=
```

---

## Quick Commands Reference
```bash
# Start local dev server
npm run dev

# Deploy: just commit + push — Vercel auto-deploys master within ~40s
git push

# (Fallback) deploy directly without going through GitHub
npx vercel --prod --scope team793s-projects --yes

# Re-import stock from new ERP file
node scripts/import-stock.mjs "path/to/new-file.csv"

# Run a new migration file against the live DB
node --env-file=.env.local scripts/migrate.mjs 000X_filename.sql

# Check TypeScript / build errors
npm run build

# Open Prisma Studio (browse DB locally)
npm run db:studio
```

---

## How to Resume With Claude Code
1. Open terminal in `C:\Users\WINDOWS 11\Desktop\tyre on cloud\tirehub`
2. Say: **"read PROGRESS.md and let's continue"**
3. Name the TO DO number you want to work on

**Two open items worth raising even if not explicitly asked:**
- Rotate the exposed Vercel access token (see TO-DO #8) — flagged repeatedly, not yet confirmed done.
- Real prices are still all ฿0 — TO-DO #1 is ready whenever the ERP price file is available.

---

## Useful Links

| Resource | URL |
|---|---|
| Live website | https://tyreoncloud-team793s-projects.vercel.app |
| GitHub repo | https://github.com/team793/tyre-on-cloud |
| Vercel dashboard | https://vercel.com/team793s-projects/tyreoncloud |
| Supabase dashboard | https://supabase.com/dashboard/project/ognoyinorqkthcjcabiy |
| Supabase Table Editor | https://supabase.com/dashboard/project/ognoyinorqkthcjcabiy/editor |
| Supabase SQL Editor | https://supabase.com/dashboard/project/ognoyinorqkthcjcabiy/sql/new |
