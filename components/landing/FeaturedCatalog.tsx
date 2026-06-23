'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, ShoppingBag, Package } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useLanguage } from '@/context/LanguageContext';
import type { TyreProduct } from '@/types/shop';

// ─── Brand tabs ────────────────────────────────────────────────────────────
const BRAND_TABS = [
  { id: 'ALL',        label: 'All',        color: '#dc2626' },
  { id: 'DUNLOP',     label: 'DUNLOP',     color: '#dc2626' },
  { id: 'MICHELIN',   label: 'MICHELIN',   color: '#1d4ed8' },
  { id: 'BRIDGESTONE',label: 'BRIDGESTONE',color: '#dc2626' },
  { id: 'MAXXIS',     label: 'MAXXIS',     color: '#f97316' },
  { id: 'GOODYEAR',   label: 'GOODYEAR',   color: '#eab308' },
  { id: 'HANKOOK',    label: 'HANKOOK',    color: '#dc2626' },
  { id: 'YOKOHAMA',   label: 'YOKOHAMA',   color: '#16a34a' },
  { id: 'TOYO',       label: 'TOYO',       color: '#f97316' },
] as const;

type BrandId = (typeof BRAND_TABS)[number]['id'];

const BRAND_COLOR: Record<string, string> = Object.fromEntries(
  BRAND_TABS.map((b) => [b.id, b.color])
);

// ─── Season badge ──────────────────────────────────────────────────────────
const SEASON_LABEL: Record<string, { th: string; en: string; bg: string }> = {
  Summer:    { th: 'ซัมเมอร์',   en: 'Summer',    bg: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  Rainy:     { th: 'ฤดูฝน',     en: 'Rainy',     bg: 'bg-sky-500/20 text-sky-300 border-sky-500/30' },
  AllSeason: { th: 'ออลซีซั่น', en: 'All-Season', bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
};

// ─── Stock badge ───────────────────────────────────────────────────────────
function totalStock(p: TyreProduct) {
  return p.warehouseStock.reduce((s, w) => s + w.quantity, 0);
}

// ─── Product card ──────────────────────────────────────────────────────────
function ProductCard({ product, lang }: { product: TyreProduct; lang: 'th' | 'en' }) {
  const isTh = lang === 'th';
  const color = BRAND_COLOR[product.brand] ?? '#dc2626';
  const season = SEASON_LABEL[product.season] ?? SEASON_LABEL.Summer;
  const stock = totalStock(product);
  const sizeLabel = `${product.width}/${product.profile}R${product.rimSize}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 transition-shadow hover:border-ink-700/80 hover:shadow-2xl hover:shadow-black/40"
    >
      {/* Colour accent top bar */}
      <div className="h-1 w-full transition-all duration-500" style={{ backgroundColor: color }} />

      {/* Tyre visual area */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-ink-950/60 sm:h-44">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <>
            {/* Subtle glow */}
            <div
              className="pointer-events-none absolute h-28 w-28 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125"
              style={{ backgroundColor: `${color}18` }}
            />

            {/* Animated tyre ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="relative z-10 flex h-24 w-24 items-center justify-center rounded-full"
              style={{
                background:
                  'repeating-conic-gradient(from 0deg, #3a322c 0deg 6deg, #211a17 6deg 12deg, #3a322c 12deg 15deg, #1b1512 15deg 20deg)',
              }}
            >
              {/* Inner rim */}
              <div
                className="absolute inset-[18%] rounded-full transition-colors duration-500"
                style={{ backgroundColor: `${color}40`, border: `2px solid ${color}60` }}
              />
              {/* Hub */}
              <div className="absolute inset-[38%] rounded-full bg-ink-950" />
            </motion.div>
          </>
        )}

        {/* Season badge */}
        <span
          className={`absolute left-3 top-3 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${season.bg}`}
        >
          {isTh ? season.th : season.en}
        </span>

        {/* Stock indicator */}
        <span
          className={`absolute right-3 top-3 flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
            stock > 0
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          <Package size={9} />
          {stock > 0 ? (isTh ? 'มีสินค้า' : 'In Stock') : (isTh ? 'สินค้าหมด' : 'Out of Stock')}
        </span>
      </div>

      {/* Card body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        <span
          className="mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{ color }}
        >
          {product.brand}
        </span>

        {/* Name */}
        <h3 className="mb-1 line-clamp-1 font-display text-base font-semibold text-chalk-100">
          {product.name || `${product.brand} ${sizeLabel}`}
        </h3>

        {/* Size — big and prominent */}
        <p className="mb-3 font-mono text-xl font-bold tracking-tight text-chalk-100">
          {sizeLabel}
          <span className="ml-1.5 font-mono text-sm font-normal text-steel-400">
            {product.loadIndex}{product.speedRating}
          </span>
        </p>

        {/* Spec pills */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="rounded-md border border-ink-700 px-2 py-0.5 font-mono text-[10px] text-steel-400">
            {isTh ? 'ความเร็ว' : 'Speed'} {product.speedRating}
          </span>
          <span className="rounded-md border border-ink-700 px-2 py-0.5 font-mono text-[10px] text-steel-400">
            LI {product.loadIndex}
          </span>
          {product.wetGripRating && (
            <span className="rounded-md border border-ink-700 px-2 py-0.5 font-mono text-[10px] text-steel-400">
              {isTh ? 'เปียก' : 'Wet'} {product.wetGripRating}
            </span>
          )}
        </div>

        {/* Price / CTA */}
        <div className="mt-auto">
          {product.priceRetail > 0 ? (
            <p className="mb-3 font-display text-2xl font-bold text-chalk-100">
              ฿{product.priceRetail.toLocaleString()}
              <span className="ml-1 font-body text-sm font-normal text-steel-400">
                {isTh ? '/เส้น' : '/tyre'}
              </span>
            </p>
          ) : (
            <p className="mb-3 font-body text-sm text-steel-400">
              {isTh ? 'ติดต่อสอบถามราคา' : 'Contact for pricing'}
            </p>
          )}

          <Link
            href={`/shop?mode=customer&width=${product.width}&profile=${product.profile}&rimSize=${product.rimSize}`}
            className="group/btn flex w-full items-center justify-center gap-2 rounded-xl py-2.5 font-body text-sm font-semibold text-white transition"
            style={{ backgroundColor: color }}
          >
            <ShoppingBag size={14} />
            {isTh ? 'ดูสินค้า' : 'View Product'}
            <ArrowRight size={13} className="transition group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-900">
      <div className="h-1 w-full bg-ink-700" />
      <div className="h-40 animate-pulse bg-ink-950/60 sm:h-44" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 animate-pulse rounded bg-ink-700" />
        <div className="h-4 w-full animate-pulse rounded bg-ink-700" />
        <div className="h-6 w-28 animate-pulse rounded bg-ink-700" />
        <div className="h-9 w-full animate-pulse rounded-xl bg-ink-700" />
      </div>
    </div>
  );
}

// ─── Main section ──────────────────────────────────────────────────────────
export function FeaturedCatalog() {
  const { t, lang } = useLanguage();
  const isTh = lang === 'th';
  const [activeBrand, setActiveBrand] = useState<BrandId>('ALL');

  const { data, isLoading } = useProducts();
  const allProducts = data?.products ?? [];

  const filtered = useMemo(() => {
    const pool =
      activeBrand === 'ALL'
        ? allProducts
        : allProducts.filter((p) => p.brand.toUpperCase() === activeBrand);
    // Show up to 8 cards; prefer products with stock
    return [...pool]
      .sort((a, b) => totalStock(b) - totalStock(a))
      .slice(0, 8);
  }, [allProducts, activeBrand]);

  const activeColor = BRAND_TABS.find((b) => b.id === activeBrand)?.color ?? '#dc2626';

  return (
    <section className="bg-ink-950 px-5 py-20 sm:px-10 lg:px-16 2xl:px-24">
      <div className="mx-auto max-w-[1600px]">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-400">
              {isTh ? 'แค็ตตาล็อกสินค้า' : 'Product Catalogue'}
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-chalk-100 sm:text-4xl">
              {isTh ? 'เลือกยางที่ใช่สำหรับคุณ' : 'Find the right tyre for you'}
            </h2>
          </div>
          <Link
            href="/shop?mode=customer"
            className="group inline-flex shrink-0 items-center gap-2 font-body text-sm font-semibold text-brand-400 transition hover:text-brand-300"
          >
            {isTh ? 'ดูสินค้าทั้งหมด' : 'View all products'}
            <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Brand filter tabs — horizontal scroll on mobile */}
        <div className="mb-8 -mx-5 px-5 sm:mx-0 sm:px-0">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {BRAND_TABS.map((brand) => {
              const isActive = activeBrand === brand.id;
              return (
                <button
                  key={brand.id}
                  onClick={() => setActiveBrand(brand.id)}
                  className="relative shrink-0 rounded-full border px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition"
                  style={{
                    borderColor: isActive ? brand.color : '#3a322c',
                    backgroundColor: isActive ? `${brand.color}18` : 'transparent',
                    color: isActive ? brand.color : '#8fa3ad',
                  }}
                >
                  {brand.id === 'ALL' ? (isTh ? 'ทั้งหมด' : 'All') : brand.label}
                  {isActive && (
                    <motion.span
                      layoutId="brand-tab-indicator"
                      className="absolute inset-0 rounded-full"
                      style={{ boxShadow: `0 0 12px ${brand.color}40` }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : (
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} lang={lang} />
                ))}
              </AnimatePresence>
            )}
        </div>

        {/* Bottom CTA */}
        {!isLoading && allProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-ink-700 bg-ink-900 px-6 py-8 text-center"
          >
            <div className="flex items-center gap-2 rounded-full border border-ink-700 bg-ink-950 px-4 py-1.5">
              <Zap size={13} className="text-brand-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-steel-400">
                {allProducts.length.toLocaleString()} {isTh ? 'รายการในคลัง' : 'SKUs in stock'}
              </span>
            </div>
            <h3 className="font-display text-2xl font-semibold text-chalk-100">
              {isTh ? 'ไม่เจอขนาดที่ต้องการ?' : "Can't find your size?"}
            </h3>
            <p className="max-w-md font-body text-sm text-chalk-300">
              {isTh
                ? 'เรามียางกว่า 489 รายการ ค้นหาตามขนาดยาง รุ่นรถ หรือสอบถามผ่าน LINE'
                : 'We carry 489+ SKUs. Search by size, vehicle, or ask us on LINE.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/shop?mode=customer"
                className="rounded-full px-6 py-3 font-body text-sm font-semibold text-white transition"
                style={{ backgroundColor: activeColor }}
              >
                {isTh ? 'ค้นหายางทั้งหมด' : 'Browse all tyres'}
              </Link>
              <a
                href="https://line.me/ti/p/@tirehub"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-ink-700 px-6 py-3 font-body text-sm font-semibold text-chalk-300 transition hover:border-chalk-300 hover:text-chalk-100"
              >
                {isTh ? 'สอบถามผ่าน LINE' : 'Ask on LINE'}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
