-- ============================================================================
-- TireHub — core schema
-- Run in the Supabase SQL Editor, or via `supabase db push` / as the first
-- Prisma migration (prisma/migrations/0001_init/migration.sql).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.user_role as enum ('customer', 'dealer');
create type public.tyre_type as enum ('Summer', 'Winter', 'AllSeason');

-- ----------------------------------------------------------------------------
-- profiles — extends auth.users (see ARCHITECTURE.md for why not `public.users`)
-- ----------------------------------------------------------------------------
create table public.profiles (
  id            uuid primary key references auth.users (id) on delete cascade,
  email         text not null unique,
  full_name     text,
  company_name  text,                       -- dealers only
  role          public.user_role not null default 'customer',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table public.profiles is
  'App-level profile, 1:1 with auth.users via id. role drives B2C/B2B access.';

-- Auto-create a profile row on signup. Role is intentionally NOT read from
-- client-supplied signup metadata — letting a user pass
-- `{ data: { role: 'dealer' } }` to supabase.auth.signUp() would otherwise
-- be a straight privilege escalation. Every new user starts as 'customer';
-- dealer status is granted out-of-band (service_role) after vetting.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Second guard: even with role defaulted server-side at signup, the
-- "update your own profile" RLS policy below would otherwise let an
-- authenticated customer PATCH their own row's `role` to 'dealer' directly
-- via the REST API. This trigger silently reverts any change to `role`
-- unless the caller is using the service_role key.
create function public.prevent_role_self_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

create trigger guard_profiles_role
  before update on public.profiles
  for each row execute function public.prevent_role_self_escalation();

-- ----------------------------------------------------------------------------
-- products
-- ----------------------------------------------------------------------------
create table public.products (
  id                      uuid primary key default gen_random_uuid(),
  sku                     text not null unique,
  ean                     text,
  name                    text not null,
  brand                   text not null,
  image_url               text,

  -- Fitment (required by the Tyre Finder cascade + the user's spec)
  width                   int not null,
  profile                 int not null,
  rim_size                int not null,
  speed_rating            text not null,
  load_index              int not null,
  tyre_type               public.tyre_type not null,

  -- EU label performance ratings (used by RetailFilterPanel)
  wet_grip_rating         char(1),
  fuel_efficiency_rating  char(1),
  noise_level_db          int,

  -- Commercial (required by the user's spec)
  stock                   int not null default 0,
  price_retail            numeric(10, 2) not null,
  price_dealer            numeric(10, 2) not null,

  -- Merchandising / AI Fitment Advisor
  rating                  numeric(2, 1) default 0,
  review_count            int not null default 0,
  tags                    text[] not null default '{}',

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),

  constraint products_width_check check (width between 100 and 400),
  constraint products_rim_check check (rim_size between 10 and 24),
  constraint products_price_check check (price_dealer <= price_retail)
);

create index products_fitment_idx on public.products (width, profile, rim_size);
create index products_tyre_type_idx on public.products (tyre_type);
create index products_tags_idx on public.products using gin (tags);

-- ----------------------------------------------------------------------------
-- warehouses + inventory — products.stock alone can't express the dealer
-- matrix's per-warehouse pills (WH-N: 450, WH-E: 12, ...)
-- ----------------------------------------------------------------------------
create table public.warehouses (
  id     uuid primary key default gen_random_uuid(),
  name   text not null unique,
  region text
);

create table public.inventory (
  product_id   uuid not null references public.products (id) on delete cascade,
  warehouse_id uuid not null references public.warehouses (id) on delete cascade,
  quantity     int not null default 0,
  primary key (product_id, warehouse_id)
);

-- ----------------------------------------------------------------------------
-- pricing_tiers — price_dealer is a single list price; the B2B matrix needs
-- the full 1-9 / 10-39 / 40+ volume curve
-- ----------------------------------------------------------------------------
create table public.pricing_tiers (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references public.products (id) on delete cascade,
  min_qty         int not null,
  max_qty         int,                        -- null = no upper bound ("40+")
  price_per_unit  numeric(10, 2) not null,
  constraint pricing_tiers_range_check check (max_qty is null or max_qty >= min_qty)
);

create unique index pricing_tiers_product_minqty_idx on public.pricing_tiers (product_id, min_qty);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
create function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Helper: is the currently authenticated user a dealer?
-- ----------------------------------------------------------------------------
create function public.is_dealer()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'dealer'
  );
$$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.warehouses enable row level security;
alter table public.inventory enable row level security;
alter table public.pricing_tiers enable row level security;

-- profiles: see/update only your own row (role itself is protected by the
-- guard_profiles_role trigger above, not by this policy)
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- products: full row (incl. price_dealer) is dealer-only — see the
-- products_public view below for the customer/anon-facing read path.
create policy "products_select_dealers" on public.products
  for select using (public.is_dealer());

-- warehouses / inventory / pricing_tiers: dealer-only. No write policies on
-- any table above means inserts/updates/deletes are denied for anon and
-- authenticated roles — product/catalog management goes through the
-- service_role key (which bypasses RLS entirely) from a trusted admin tool.
create policy "warehouses_select_dealers" on public.warehouses
  for select using (public.is_dealer());

create policy "inventory_select_dealers" on public.inventory
  for select using (public.is_dealer());

create policy "pricing_tiers_select_dealers" on public.pricing_tiers
  for select using (public.is_dealer());

-- ----------------------------------------------------------------------------
-- Customer/anon-facing catalog: RLS is row-level, not column-level, so
-- hiding price_dealer from customers can't be done with a policy on
-- `products` alone. A view that omits the column is the standard fix —
-- views run with their owner's privileges by default (this view is created
-- by the `postgres` role, same as everything else in this migration), so
-- granting it to anon/authenticated lets them read safely *through* a table
-- whose own RLS policy would otherwise reject them.
-- ----------------------------------------------------------------------------
create view public.products_public as
  select
    id, sku, name, brand, image_url, width, profile, rim_size,
    speed_rating, load_index, tyre_type, wet_grip_rating,
    fuel_efficiency_rating, noise_level_db, stock, price_retail,
    rating, review_count, tags, created_at
  from public.products;

grant select on public.products_public to anon, authenticated;
