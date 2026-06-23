'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Droplets, CloudRain, Star, ShoppingCart, Check, Wrench } from 'lucide-react';
import type { TyreProduct } from '@/types/shop';
import { useShopStore } from '@/stores/shopStore';
import { TyreThumbnail } from '@/components/shared/TyreThumbnail';

const SEASON_META = {
  Summer: { icon: Sun, label: 'Summer', className: 'bg-amber-100 text-amber-700' },
  Rainy: { icon: Droplets, label: 'Rainy', className: 'bg-sky-100 text-sky-700' },
  AllSeason: { icon: CloudRain, label: 'All-Season', className: 'bg-emerald-100 text-emerald-700' },
} as const;

export function RetailProductCard({ product }: { product: TyreProduct }) {
  const addToRetailCart = useShopStore((s) => s.addToRetailCart);
  const cartItem = useShopStore((s) => s.retailCart[product.id]);
  const setCartDrawerOpen = useShopStore((s) => s.setCartDrawerOpen);
  const [installation, setInstallation] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const seasonMeta = SEASON_META[product.season];
  const SeasonIcon = seasonMeta.icon;
  const total = product.priceRetail + (installation ? 25 : 0);

  const handleAddToCart = () => {
    addToRetailCart(product.id, installation);
    setJustAdded(true);
    setCartDrawerOpen(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      layout
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <motion.div
          className="h-full w-full"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <TyreThumbnail imageUrl={product.imageUrl} brand={product.brand} alt={product.name} className="h-full w-full" />
        </motion.div>
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${seasonMeta.className}`}
        >
          <SeasonIcon size={12} />
          {seasonMeta.label}
        </span>
        {cartItem && (
          <span className="absolute right-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {cartItem.quantity}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{product.brand}</p>
        <h3 className="mb-1 text-base font-bold text-gray-900">{product.name}</h3>
        <p className="mb-2 text-xs text-gray-500">
          {product.width}/{product.profile} R{product.rimSize} · {product.speedRating} · LI {product.loadIndex}
        </p>

        <div className="mb-3 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
            />
          ))}
          <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
        </div>

        <div className="mb-4 flex gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            Wet Grip <strong className="text-gray-900">{product.wetGripRating}</strong>
          </span>
          <span className="flex items-center gap-1">
            Fuel <strong className="text-gray-900">{product.fuelEfficiencyRating}</strong>
          </span>
          <span className="flex items-center gap-1">{product.noiseLevelDb}dB</span>
        </div>

        <label className="mb-4 flex cursor-pointer items-start gap-2.5 rounded-lg border-2 border-gray-100 p-3 transition hover:border-red-200">
          <input
            type="checkbox"
            checked={installation}
            onChange={(e) => setInstallation(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
          />
          <span className="text-xs leading-snug text-gray-600">
            <span className="flex items-center gap-1 font-semibold text-gray-800">
              <Wrench size={12} /> Add Professional Local Installation
            </span>
            <span className="text-gray-500">+฿25 per tyre</span>
          </span>
        </label>

        <div className="mt-auto">
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-red-600">฿{total.toLocaleString()}</span>
            <span className="text-xs text-gray-400">per tyre</span>
          </div>

          <motion.button
            onClick={handleAddToCart}
            whileTap={{ scale: 0.96 }}
            className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
          >
            <AnimatePresence mode="wait" initial={false}>
              {justAdded ? (
                <motion.span
                  key="added"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Check size={16} /> Added to Cart
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ y: 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -12, opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingCart size={16} /> Add to Cart
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
