'use client';

import { useLanguage } from '@/context/LanguageContext';
import { TyreFinder } from '@/components/tyre-finder/TyreFinder';

export function TyreFinderSection() {
  const { t } = useLanguage();

  return (
    <section className="bg-ink-950 px-5 py-14 sm:px-10 lg:px-16 2xl:px-24">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-8">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.28em] text-brand-400">
            {t.finder.title}
          </p>
          <h2 className="font-display text-2xl font-semibold text-chalk-100 sm:text-3xl">
            {t.finder.sub}
          </h2>
        </div>
        <TyreFinder />
      </div>
    </section>
  );
}
