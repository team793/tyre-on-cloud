'use client';

import { motion } from 'framer-motion';
import { Store, Building2, ShoppingCart } from 'lucide-react';
import { useShopStore } from '@/stores/shopStore';
import { useRetailCart } from '@/hooks/useRetailCart';

export function ShopHeader() {
  const mode = useShopStore((s) => s.mode);
  const toggleMode = useShopStore((s) => s.toggleMode);
  const setCartDrawerOpen = useShopStore((s) => s.setCartDrawerOpen);
  const { itemCount: cartCount } = useRetailCart();
  const isDealer = mode === 'b2b';

  return (
    <div
      className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors duration-500 ${
        isDealer ? 'border-slate-700 bg-slate-900/95' : 'border-gray-200 bg-white/95'
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <motion.div
            key={mode}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
              isDealer ? 'bg-orange-500' : 'bg-gradient-to-br from-red-600 to-orange-600'
            }`}
          >
            {isDealer ? <Building2 size={16} className="text-white" /> : <Store size={16} className="text-white" />}
          </motion.div>
          <div className="min-w-0">
            <p className={`text-sm font-bold leading-tight ${isDealer ? 'text-white' : 'text-gray-900'}`}>
              Tyre on Cloud
            </p>
            <p className={`text-xs leading-tight ${isDealer ? 'text-slate-400' : 'text-gray-500'}`}>
              {isDealer ? 'Wholesale pricing & bulk fulfillment' : 'Shop tyres for your vehicle'}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2.5">
          <button
            role="switch"
            aria-checked={isDealer}
            onClick={toggleMode}
            className={`relative flex h-10 w-40 shrink-0 items-center rounded-full border-2 p-1 text-xs font-bold transition-colors duration-300 ${
              isDealer ? 'border-orange-500 bg-slate-800' : 'border-gray-200 bg-gray-100'
            }`}
          >
            <motion.div
              className={`absolute left-1 top-1 h-8 w-[76px] rounded-full ${isDealer ? 'bg-orange-500' : 'bg-red-600'}`}
              animate={{ x: isDealer ? 76 : 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
            <span className={`z-10 flex-1 text-center transition-colors ${!isDealer ? 'text-white' : 'text-slate-400'}`}>
              Retail
            </span>
            <span className={`z-10 flex-1 text-center transition-colors ${isDealer ? 'text-white' : 'text-gray-400'}`}>
              Dealer
            </span>
          </button>

          {!isDealer && (
            <button
              onClick={() => setCartDrawerOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-700 transition hover:border-gray-300"
              aria-label="Open cart"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
