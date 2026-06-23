-- ============================================================================
-- Orders — retail (B2C) checkout. Dealer ordering stays a quoting/RFQ
-- workflow via the dealer matrix + LINE, not a self-serve checkout.
-- ============================================================================

create type public.order_payment_method as enum ('bank_transfer', 'cod');
create type public.order_status as enum ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');

create table public.orders (
  id           uuid primary key default gen_random_uuid(),
  order_number text not null unique,                                   -- short human-friendly reference shown to the customer
  user_id      uuid references public.profiles (id) on delete set null, -- null for guest checkout

  customer_name  text not null,
  customer_phone text not null,
  customer_email text,
  address_line   text not null,
  city           text not null,
  postal_code    text not null,
  notes          text,

  payment_method      public.order_payment_method not null,
  status              public.order_status not null default 'pending',
  subtotal            numeric(10, 2) not null,
  installation_total  numeric(10, 2) not null default 0,
  total               numeric(10, 2) not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_created_at_idx on public.orders (created_at desc);

create table public.order_items (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders (id) on delete cascade,
  product_id   uuid not null references public.products (id),
  product_name text not null,   -- snapshot — survives later product renames/deletions
  sku          text not null,
  quantity     int not null check (quantity > 0),
  unit_price   numeric(10, 2) not null,
  installation boolean not null default false,
  subtotal     numeric(10, 2) not null
);

create index order_items_order_id_idx on public.order_items (order_id);

create trigger set_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Orders are created exclusively through the trusted /api/orders route using
-- the service_role key (so totals are always recomputed server-side from real
-- product prices, never trusted from the client) — no insert policy is
-- granted to anon/authenticated, matching the warehouses/inventory pattern.
-- Logged-in customers can look back at their own order history; guests
-- aren't issued one and instead reference their order number via LINE.
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "order_items_select_own" on public.order_items
  for select using (
    exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid())
  );
