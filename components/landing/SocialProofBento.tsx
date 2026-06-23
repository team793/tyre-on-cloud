'use client';

import { motion, type Variants } from 'framer-motion';
import { Star, Warehouse, Truck, Building2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export function SocialProofBento() {
  const { t } = useLanguage();

  return (
    <section className="bg-ink-950 px-5 py-20 sm:px-10 lg:px-16 2xl:px-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-400">
            {t.social.eyebrow}
          </p>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-chalk-100 sm:text-4xl">
            {t.social.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {/* Big distribution stat — 2×2 */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col justify-between rounded-2xl border border-ink-700 bg-ink-900 p-8 sm:col-span-2 lg:col-span-2 lg:row-span-2"
          >
            <Truck className="text-brand-500" size={22} />
            <div>
              <p className="font-display text-5xl font-semibold tracking-tight text-chalk-100 sm:text-6xl">
                500K+
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-steel-400">
                {t.social.tyres}
              </p>
              <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-chalk-300">
                {t.social.tyreSub}
              </p>
            </div>
          </motion.div>

          {/* Rating */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col justify-between rounded-2xl border border-ink-700 bg-ink-900 p-6"
          >
            <div className="flex gap-0.5 text-brand-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-current" />
              ))}
            </div>
            <div>
              <p className="font-display text-3xl text-chalk-100">
                4.9{t.social.rating}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-steel-400">
                {t.social.ratingCount}
              </p>
            </div>
          </motion.div>

          {/* Wholesale */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col justify-between rounded-2xl border border-steel-600/40 bg-ink-900 p-6"
          >
            <Building2 className="text-steel-400" size={20} />
            <div>
              <p className="font-display text-xl text-chalk-100">{t.social.wholesale}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-400">
                {t.social.tier}
              </p>
            </div>
          </motion.div>

          {/* Featured review */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col justify-between rounded-2xl border border-ink-700 bg-ink-900 p-6"
          >
            <p className="font-body text-sm leading-relaxed text-chalk-300">
              {t.social.review}
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-400">
              {t.social.reviewer}
            </p>
          </motion.div>

          {/* Dispatch */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="flex flex-col justify-between rounded-2xl border border-ink-700 bg-ink-900 p-6"
          >
            <Warehouse className="text-brand-500" size={20} />
            <div>
              <p className="font-display text-xl text-chalk-100">{t.social.dispatch}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-400">
                {t.social.dispatchSub}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
