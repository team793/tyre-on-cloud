'use client';

import { useEffect } from 'react';
import type { Route } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useShopStore } from '@/stores/shopStore';
import { useSupabaseSession } from '@/context/SupabaseSessionProvider';
import { ShopHeader } from './ShopHeader';
import { RetailView } from './RetailView';
import { DealerMatrix } from './DealerMatrix';
import { DealerAccessGate } from './DealerAccessGate';
import { MobileFilterSheet } from './MobileFilterSheet';
import { RetailCartDrawer } from './RetailCartDrawer';

export function ShopPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = useShopStore((s) => s.mode);
  const setMode = useShopStore((s) => s.setMode);
  const { session, role, isLoading } = useSupabaseSession();

  // Initialize mode from the CTA the user clicked on the landing page
  // (/shop?mode=customer or /shop?mode=dealer). Only runs once on mount so
  // a manual toggle afterwards isn't overridden by a stale query param.
  useEffect(() => {
    const queryMode = searchParams.get('mode');
    if (queryMode === 'dealer') setMode('b2b');
    if (queryMode === 'customer') setMode('b2c');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dealer mode is gated behind a real dealer account — RLS already blocks
  // wholesale data from non-dealers, but anonymous visitors shouldn't even
  // land on the dealer UI. Send them to sign in once the session has
  // resolved (avoids redirecting during the brief initial loading flicker).
  const isDealerMode = mode === 'b2b';
  const needsSignIn = isDealerMode && !isLoading && !session;
  useEffect(() => {
    if (needsSignIn) router.push(('/auth?next=' + encodeURIComponent('/shop?mode=dealer')) as Route);
  }, [needsSignIn, router]);

  const showDealerGate = isDealerMode && !isLoading && !!session && role !== 'dealer';

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
          {mode === 'b2c' ? (
            <RetailView />
          ) : isLoading || needsSignIn ? (
            <div className="flex justify-center py-24">
              <Loader2 size={28} className="animate-spin text-slate-500" />
            </div>
          ) : showDealerGate ? (
            <DealerAccessGate />
          ) : (
            <DealerMatrix />
          )}
        </motion.main>
      </AnimatePresence>

      <MobileFilterSheet />
      {mode === 'b2c' && <RetailCartDrawer />}
    </div>
  );
}
