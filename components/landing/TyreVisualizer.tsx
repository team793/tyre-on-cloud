'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Car, Mountain, Gauge, ArrowRight } from 'lucide-react';
import { SidewallStampRing } from './SidewallStampRing';
import { useLanguage } from '@/context/LanguageContext';

type CarTypeId = 'sedan' | 'suv' | 'sports';

interface CarTypeOption {
  id: CarTypeId;
  icon: typeof Car;
  width: number;
  profile: number;
  rimSize: number;
  speedRating: string;
  loadIndex: number;
  tyreType: 'Summer' | 'Rainy' | 'AllSeason';
  treadVariant: 'steel' | 'chalk' | 'ember';
}

const CAR_TYPES: CarTypeOption[] = [
  { id: 'sedan', icon: Car,      width: 205, profile: 55, rimSize: 16, speedRating: 'H', loadIndex: 91,  tyreType: 'AllSeason', treadVariant: 'steel' },
  { id: 'suv',   icon: Mountain, width: 235, profile: 60, rimSize: 18, speedRating: 'H', loadIndex: 107, tyreType: 'AllSeason', treadVariant: 'chalk' },
  { id: 'sports',icon: Gauge,    width: 245, profile: 40, rimSize: 19, speedRating: 'Y', loadIndex: 98,  tyreType: 'Summer',    treadVariant: 'ember' },
];

function treadAccentClass(variant: CarTypeOption['treadVariant']): string {
  if (variant === 'ember') return 'bg-brand-500/25';
  if (variant === 'chalk') return 'bg-chalk-100/15';
  return 'bg-steel-400/20';
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-steel-400">{label}</dt>
      <dd className="mt-1 font-display text-lg text-chalk-100">{value}</dd>
    </div>
  );
}

export function TyreVisualizer() {
  const [activeId, setActiveId] = useState<CarTypeId>('sedan');
  const prefersReducedMotion = useReducedMotion();
  const { t } = useLanguage();
  const active = CAR_TYPES.find((c) => c.id === activeId)!;
  const specLabel = `${active.width}/${active.profile}R${active.rimSize} ${active.loadIndex}${active.speedRating}`;

  const labelMap: Record<CarTypeId, string> = {
    sedan: t.visualizer.sedan,
    suv: t.visualizer.suv,
    sports: t.visualizer.sports,
  };

  const rationaleMap: Record<CarTypeId, string> = {
    sedan: t.visualizer.sedanRationale,
    suv: t.visualizer.suvRationale,
    sports: t.visualizer.sportsRationale,
  };

  const tyreTypeMap: Record<string, string> = {
    Summer: t.visualizer.summer,
    Rainy: t.visualizer.winter,
    AllSeason: t.visualizer.allSeason,
  };

  return (
    <section id="fitment" className="relative bg-ink-900 px-5 py-20 sm:px-10 lg:px-16 2xl:px-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-400">
            {t.visualizer.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-chalk-100 sm:text-4xl">
            {t.visualizer.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          {/* Spec panel */}
          <div className="order-2 lg:order-1">
            <div role="tablist" aria-label="Vehicle type" className="mb-8 flex gap-2 border-b border-ink-700">
              {CAR_TYPES.map((car) => {
                const Icon = car.icon;
                const isActive = car.id === activeId;
                return (
                  <button
                    key={car.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveId(car.id)}
                    className={`relative flex items-center gap-2 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 ${
                      isActive ? 'text-chalk-100' : 'text-steel-400 hover:text-chalk-300'
                    }`}
                  >
                    <Icon size={14} />
                    {labelMap[car.id]}
                    {isActive && (
                      <motion.span
                        layoutId="visualizer-tab-underline"
                        className="absolute inset-x-0 -bottom-px h-[2px] bg-brand-500"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={prefersReducedMotion ? undefined : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <p className="mb-6 font-body text-base leading-relaxed text-chalk-300">
                  {rationaleMap[activeId]}
                </p>

                <dl className="grid grid-cols-2 gap-4 border-t border-ink-700 pt-6 sm:grid-cols-3">
                  <SpecRow label={t.visualizer.size} value={`${active.width}/${active.profile} R${active.rimSize}`} />
                  <SpecRow label={t.visualizer.speedRating} value={active.speedRating} />
                  <SpecRow label={t.visualizer.loadIndex} value={String(active.loadIndex)} />
                  <SpecRow label={t.visualizer.tyreType} value={tyreTypeMap[active.tyreType]} />
                </dl>

                <Link
                  href="/shop?mode=customer"
                  className="group mt-8 inline-flex items-center gap-2 font-body text-sm font-semibold text-brand-400 transition hover:text-brand-500"
                >
                  {t.visualizer.shopLink} {labelMap[activeId]}
                  <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Tyre stage */}
          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative flex h-[300px] w-[300px] items-center justify-center overflow-hidden sm:h-[400px] sm:w-[400px]">
              <SidewallStampRing
                text={`${specLabel} —`}
                size={400}
                durationSeconds={34}
                className="absolute inset-0 text-chalk-300/30"
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9, rotate: -8 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.9, rotate: 8 }}
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-[240px] w-[240px] cursor-default rounded-full sm:h-[320px] sm:w-[320px]"
                  style={{
                    background:
                      'repeating-conic-gradient(from 0deg, var(--color-ink-700) 0deg 5deg, var(--color-ink-850) 5deg 11deg)',
                  }}
                >
                  <div className="absolute inset-[18%] rounded-full bg-ink-900" />
                  <div className={`absolute inset-[30%] rounded-full ${treadAccentClass(active.treadVariant)}`} />
                  <div className="absolute inset-[44%] flex items-center justify-center rounded-full bg-ink-950 text-center font-mono text-[10px] leading-tight text-chalk-100">
                    {specLabel}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
