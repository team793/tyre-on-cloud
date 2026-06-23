'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Lang } from '@/lib/i18n';

// ─── Brand data ────────────────────────────────────────────────────────────
const BRANDS = [
  { name: 'DUNLOP',      origin: 'United Kingdom', accent: '#dc2626', rim: '#7f1d1d' },
  { name: 'MICHELIN',    origin: 'France',          accent: '#1d4ed8', rim: '#1e3a8a' },
  { name: 'BRIDGESTONE', origin: 'Japan',           accent: '#dc2626', rim: '#7f1d1d' },
  { name: 'MAXXIS',      origin: 'Taiwan',          accent: '#f97316', rim: '#7c2d12' },
  { name: 'GOODYEAR',    origin: 'USA',             accent: '#eab308', rim: '#713f12' },
  { name: 'HANKOOK',     origin: 'South Korea',     accent: '#dc2626', rim: '#7f1d1d' },
  { name: 'YOKOHAMA',    origin: 'Japan',           accent: '#16a34a', rim: '#14532d' },
  { name: 'TOYO',        origin: 'Japan',           accent: '#f97316', rim: '#7c2d12' },
] as const;

const INTERVAL_MS = 2200;

// ─── Rotating tyre graphic ─────────────────────────────────────────────────
function TyreGraphic({ accent, rim }: { accent: string; rim: string }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Glow halo */}
      <div
        className="absolute h-52 w-52 rounded-full blur-2xl transition-colors duration-700 sm:h-64 sm:w-64"
        style={{ backgroundColor: `${accent}22` }}
      />

      {/* Outer tread ring — spins */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="relative h-44 w-44 rounded-full sm:h-56 sm:w-56"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, #3a322c 0deg 5deg, #211a17 5deg 11deg, #3a322c 11deg 14deg, #1b1512 14deg 18deg)',
        }}
      >
        {/* Sidewall inner circle */}
        <div className="absolute inset-[14%] rounded-full bg-ink-900" />
      </motion.div>

      {/* Rim — counter-spins slowly */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        className="absolute h-28 w-28 rounded-full sm:h-36 sm:w-36"
        style={{ backgroundColor: rim }}
      >
        {/* Spokes (5-spoke rim) */}
        {[0, 72, 144, 216, 288].map((deg) => (
          <div
            key={deg}
            className="absolute left-1/2 top-1/2 h-[46%] w-[10%] origin-bottom -translate-x-1/2 -translate-y-full rounded-full"
            style={{
              backgroundColor: accent,
              transform: `translateX(-50%) rotate(${deg}deg) translateY(-100%)`,
              opacity: 0.85,
            }}
          />
        ))}
        {/* Hub cap */}
        <div
          className="absolute inset-[28%] rounded-full"
          style={{ backgroundColor: accent }}
        />
      </motion.div>

      {/* Center dot */}
      <div className="absolute h-4 w-4 rounded-full bg-ink-950 ring-2 ring-white/20" />
    </div>
  );
}

// ─── Animated speed lines (burst on brand change) ──────────────────────────
function SpeedBurst({ accent }: { accent: string }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.6, 0] }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px origin-left"
          style={{
            width: '38%',
            backgroundColor: accent,
            rotate: `${i * 30}deg`,
            left: '50%',
            top: '50%',
          }}
          initial={{ scaleX: 0, opacity: 0.8 }}
          animate={{ scaleX: 1, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut', delay: i * 0.012 }}
        />
      ))}
    </motion.div>
  );
}

// ─── Scrolling ticker (bottom strip) ──────────────────────────────────────
function BrandTicker() {
  const repeated = [...BRANDS, ...BRANDS];
  return (
    <div className="relative overflow-hidden border-t border-ink-700 py-2">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {repeated.map((b, i) => (
          <span
            key={i}
            className="font-mono text-[10px] font-bold uppercase tracking-[0.22em]"
            style={{ color: b.accent }}
          >
            {b.name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function HeroBrandBanner({ lang }: { lang: Lang }) {
  const isTh = lang === 'th';
  const [index, setIndex] = useState(0);
  const [burstKey, setBurstKey] = useState(0);
  const brand = BRANDS[index];

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % BRANDS.length);
      setBurstKey((k) => k + 1);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-ink-950">

      {/* Background dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #f3ede3 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient corner glow — colour changes with brand */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-[100px]"
        animate={{ backgroundColor: `${brand.accent}33` }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full blur-[80px]"
        animate={{ backgroundColor: `${brand.accent}22` }}
        transition={{ duration: 0.8 }}
      />

      {/* Top badges */}
      <div className="relative flex items-center justify-between px-5 pt-5">
        <span className="rounded-full bg-brand-600 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-white">
          PROMO
        </span>
        <div className="flex items-center gap-1.5">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-green-400"
          />
          <span className="font-mono text-[9px] uppercase tracking-widest text-green-400">
            {isTh ? 'สินค้าพร้อมส่ง' : 'In Stock'}
          </span>
        </div>
      </div>

      {/* Centre — tyre + brand spotlight */}
      <div className="relative flex flex-1 flex-col items-center justify-center gap-5 px-4">

        {/* Speed burst on change */}
        <AnimatePresence>
          <SpeedBurst key={burstKey} accent={brand.accent} />
        </AnimatePresence>

        {/* Tyre graphic with colour transition */}
        <motion.div
          animate={{ scale: [0.96, 1, 0.96] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <TyreGraphic accent={brand.accent} rim={brand.rim} />
        </motion.div>

        {/* Brand name spotlight */}
        <div className="relative h-20 w-full overflow-hidden text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 1.04 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <span
                className="block font-display text-4xl font-bold tracking-tight sm:text-5xl"
                style={{ color: brand.accent }}
              >
                {brand.name}
              </span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.28em] text-steel-400">
                {brand.origin}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5">
          {BRANDS.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => { setIndex(i); setBurstKey((k) => k + 1); }}
              animate={{
                width: i === index ? 20 : 6,
                backgroundColor: i === index ? brand.accent : '#3a322c',
              }}
              transition={{ duration: 0.3 }}
              className="h-1.5 rounded-full"
            />
          ))}
        </div>
      </div>

      {/* Bottom stats bar */}
      <div className="relative border-t border-ink-700 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-center">
            <p className="font-display text-base font-bold text-chalk-100">500K+</p>
            <p className="font-mono text-[9px] uppercase tracking-wide text-steel-600">
              {isTh ? 'เส้นส่งแล้ว' : 'Tyres shipped'}
            </p>
          </div>
          <div className="h-6 w-px bg-ink-700" />
          <div className="text-center">
            <p className="font-display text-base font-bold text-chalk-100">4.9 ★</p>
            <p className="font-mono text-[9px] uppercase tracking-wide text-steel-600">
              {isTh ? 'คะแนนรีวิว' : 'Avg rating'}
            </p>
          </div>
          <div className="h-6 w-px bg-ink-700" />
          <div className="text-center">
            <p className="font-display text-base font-bold text-chalk-100">40+</p>
            <p className="font-mono text-[9px] uppercase tracking-wide text-steel-600">
              {isTh ? 'แบรนด์' : 'Brands'}
            </p>
          </div>
          <div className="h-6 w-px bg-ink-700" />
          <div className="text-center">
            <p className="font-display text-base font-bold text-chalk-100">2–3</p>
            <p className="font-mono text-[9px] uppercase tracking-wide text-steel-600">
              {isTh ? 'วัน จัดส่ง' : 'Day delivery'}
            </p>
          </div>
        </div>
      </div>

      {/* Scrolling brand ticker */}
      <BrandTicker />
    </div>
  );
}
