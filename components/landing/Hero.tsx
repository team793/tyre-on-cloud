'use client';

import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { HeroBrandBanner } from './HeroBrandBanner';

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const BRANDS = ['DUNLOP', 'MICHELIN', 'BRIDGESTONE', 'MAXXIS', 'GOODYEAR', 'HANKOOK', 'YOKOHAMA', 'TOYO'];

function LineIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const { t, lang } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-ink-950">
      {/* Promo banner */}
      <div className="flex items-center justify-center gap-3 bg-brand-700 px-4 py-2.5 text-center">
        <span className="font-body text-sm font-medium text-white">
          {t.hero.promo}
        </span>
        <a
          href="/shop?mode=customer"
          className="shrink-0 rounded-full bg-white/20 px-3 py-0.5 font-body text-xs font-semibold text-white hover:bg-white/30 transition"
        >
          {t.hero.promoCta}
        </a>
      </div>

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/2 h-[400px] w-[600px] -translate-y-1/2 rounded-full bg-brand-700/20 blur-[120px]"
      />

      <div className="relative mx-auto grid max-w-[1600px] grid-cols-1 items-center gap-10 px-5 py-16 sm:px-10 lg:grid-cols-2 lg:gap-16 lg:px-16 lg:py-20 2xl:px-24">
        {/* Left — copy + CTAs */}
        <motion.div
          initial={prefersReducedMotion ? undefined : 'hidden'}
          animate={prefersReducedMotion ? undefined : 'visible'}
          variants={containerVariants}
        >
          <motion.p
            variants={itemVariants}
            className="mb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-400"
          >
            {t.hero.eyebrow}
          </motion.p>

          <motion.h1
            variants={itemVariants}
            className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-chalk-100 sm:text-5xl lg:text-6xl"
          >
            {t.hero.h1a}
            <br />
            <span className="text-brand-500">{t.hero.h1b}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-lg font-body text-base leading-relaxed text-chalk-300 sm:text-lg"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/shop?mode=customer"
              className="group inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              {t.hero.cta}
              <ArrowRight size={15} className="transition group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://line.me/ti/p/@tirehub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-line-green px-6 py-3.5 font-body text-sm font-semibold text-white transition hover:bg-line-green-dark"
            >
              <LineIcon size={16} />
              {t.hero.line}
            </a>
            <Link
              href="/shop?mode=dealer"
              className="inline-flex items-center gap-2 rounded-full border border-steel-600 px-6 py-3.5 font-body text-sm font-semibold text-chalk-300 transition hover:border-steel-400 hover:text-chalk-100"
            >
              {t.hero.dealer}
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.dl
            variants={itemVariants}
            className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-ink-700 pt-6"
          >
            <div>
              <dd className="font-display text-2xl font-semibold text-chalk-100">500K+</dd>
              <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-steel-400">
                {t.hero.stats.tyres}
              </dt>
            </div>
            <div>
              <dd className="font-display text-2xl font-semibold text-chalk-100">2,400+</dd>
              <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-steel-400">
                {t.hero.stats.dealers}
              </dt>
            </div>
            <div>
              <dd className="font-display text-2xl font-semibold text-chalk-100">4.9</dd>
              <dt className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-steel-400">
                {t.hero.stats.rating}
              </dt>
            </div>
          </motion.dl>
        </motion.div>

        {/* Right — promo image slot */}
        <motion.div
          initial={prefersReducedMotion ? undefined : { opacity: 0, scale: 0.97 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative aspect-[4/3] min-h-[460px] w-full overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 lg:aspect-[3/4] lg:max-h-[560px] lg:min-h-0"
        >
          <HeroBrandBanner lang={lang} />
        </motion.div>
      </div>

      {/* Brand strip */}
      <div className="border-t border-ink-700 bg-ink-900/60 px-5 py-5 sm:px-10 lg:px-16 2xl:px-24">
        <div className="mx-auto max-w-[1600px]">
          <p className="mb-4 text-center font-mono text-[10px] uppercase tracking-[0.24em] text-steel-600">
            {t.hero.brands}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {BRANDS.map((brand) => (
              <span
                key={brand}
                className="font-display text-xs font-semibold tracking-widest text-steel-600 transition hover:text-chalk-300 sm:text-sm"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
