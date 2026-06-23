'use client';

import { Drawer } from 'vaul';
import { SlidersHorizontal } from 'lucide-react';
import { useShopStore } from '@/stores/shopStore';
import { RetailFilterPanel } from './filters/RetailFilterPanel';
import { DealerFilterPanel } from './filters/DealerFilterPanel';

export function MobileFilterSheet() {
  const mode = useShopStore((s) => s.mode);
  const open = useShopStore((s) => s.mobileFilterSheetOpen);
  const setOpen = useShopStore((s) => s.setMobileFilterSheetOpen);
  const isDealer = mode === 'b2b';

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} shouldScaleBackground>
      <Drawer.Trigger asChild>
        <button
          className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-2xl transition active:scale-95 md:hidden ${
            isDealer ? 'bg-orange-500 shadow-orange-500/30' : 'bg-gray-900 shadow-black/30'
          }`}
        >
          <SlidersHorizontal size={18} />
          <span className="hidden sm:inline">Filters & Specs</span>
        </button>
      </Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Drawer.Content
          className={`fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-[85vh] flex-col rounded-t-2xl ${
            isDealer ? 'bg-slate-950' : 'bg-white'
          }`}
        >
          <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-gray-400/40" />

          <div
            className={`flex items-center justify-between border-b px-6 py-4 ${
              isDealer ? 'border-slate-800' : 'border-gray-100'
            }`}
          >
            <h3 className={`text-lg font-bold ${isDealer ? 'text-white' : 'text-gray-900'}`}>
              {isDealer ? 'Dealer Filters' : 'Filters & Specs'}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {isDealer ? <DealerFilterPanel /> : <RetailFilterPanel />}
          </div>

          <div className={`border-t px-6 py-4 ${isDealer ? 'border-slate-800' : 'border-gray-100'}`}>
            <button
              onClick={() => setOpen(false)}
              className={`w-full rounded-lg py-3 text-sm font-bold text-white transition ${
                isDealer ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Apply Filters
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
