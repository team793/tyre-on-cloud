'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useShopStore } from '@/stores/shopStore';
import { ShopHeader } from './ShopHeader';
import { RetailView } from './RetailView';
import { DealerMatrix } from './DealerMatrix';
import { MobileFilterSheet } from './MobileFilterSheet';
import { RetailCartDrawer } from './RetailCartDrawer';

export function ShopPageClient() {
  const searchParams = useSearchParams();
  const mode = useShopStore((s) => s.mode);
  const setMode = useShopStore((s) => s.setMode);

  // Initialize mode from the CTA the user clicked on the landing page
  // (/shop?mode=customer or /shop?mode=dealer). Only runs once on mount so
  // a manual toggle afterwards isn't overridden by a stale query param.
  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'dealer') setMode('b2b');
    if (queryMode === 'customer') setMode('b2c');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${mode === 'b2b' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ShopHeader />

      <AnimatePresence mode="wait">
        <motion.main
          key={mode}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8"
        >
          {mode === 'b2c' ? <RetailView /> : <DealerMatrix />}
        </motion.main>
      </AnimatePresence>

      <MobileFilterSheet />
      {mode === 'b2c' && <RetailCartDrawer />}
    </div>
  );
}
