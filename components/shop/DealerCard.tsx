'use client';

import { useState, useMemo } from 'react';
import type { TyreProduct } from '@/types/shop';
import { useShopStore } from '@/stores/shopStore';
import { getTierPrice, calculateMarginPercent, estimateFreight } from '@/lib/shop/pricing';
import { abbreviateWarehouse, stockBadgeClass, marginColorClass } from '@/lib/shop/format';
import { TyreThumbnail } from '@/components/shared/TyreThumbnail';

interface DealerCardProps {
  product: TyreProduct;
  index: number;
  registerRef: (el: HTMLInputElement | null) => void;
  onNavigate: (index: number) => void;
  selectedWarehouses: string[];
}

export function DealerCard({ product, index, registerRef, onNavigate, selectedWarehouses }: DealerCardProps) {
  const setDealerQty = useShopStore((s) => s.setDealerQty);
  const storedQty = useShopStore((s) => s.dealerCart[product.id]);
  const [localQty, setLocalQty] = useState(storedQty || 1);

  const unitPrice = useMemo(() => getTierPrice(product.pricingTiers, localQty), [product.pricingTiers, localQty]);
  const margin = useMemo(
    () => calculateMarginPercent(product.priceRetail, unitPrice),
    [product.priceRetail, unitPrice]
  );
  const freight = useMemo(
    () => estimateFreight(product.warehouseStock, selectedWarehouses, localQty),
    [product.warehouseStock, selectedWarehouses, localQty]
  );
  const total = unitPrice * localQty;

  const commitQty = (value: number) => {
    const safe = Math.max(1, Math.round(value) || 1);
    setLocalQty(safe);
    setDealerQty(product.id, safe);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <TyreThumbnail
            imageUrl={product.imageUrl}
            brand={product.brand}
            alt={product.name}
            className="h-10 w-10 shrink-0 rounded-lg bg-slate-800"
          />
          <div className="min-w-0">
            <p className="truncate font-semibold leading-tight text-white">{product.name}</p>
            <p className="text-xs text-slate-500">
              {product.width}/{product.profile} R{product.rimSize} · LI {product.loadIndex} · Speed {product.speedRating}
            </p>
          </div>
        </div>
        <span className={`shrink-0 font-mono text-sm font-bold ${marginColorClass(margin)}`}>{margin}%</span>
      </div>

      <p className="mt-2 truncate font-mono text-xs text-slate-500">
        {product.ean ? `${product.sku} · ${product.ean}` : product.sku}
      </p>

      <div className="mt-3 flex flex-wrap gap-1">
        {product.warehouseStock.map((wh) => (
          <span
            key={wh.warehouseId}
            className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${stockBadgeClass(wh.quantity)}`}
          >
            {abbreviateWarehouse(wh.warehouseName)}: {wh.quantity}
          </span>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
        {product.pricingTiers.map((tier) => (
          <span key={tier.minQty} className="font-mono text-slate-400">
            {tier.minQty}-{tier.maxQty ?? '∞'}: <strong className="text-slate-200">฿{tier.pricePerUnit.toLocaleString()}</strong>
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 items-end gap-3 border-t border-slate-800 pt-3">
        <div className="min-w-0">
          <label className="mb-1 block text-[11px] font-bold uppercase tracking-wide text-slate-500">Qty</label>
          <input
            ref={registerRef}
            type="number"
            min={1}
            data-qty-input
            value={localQty}
            onChange={(e) => commitQty(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                onNavigate(index + 1);
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                onNavigate(index - 1);
              }
            }}
            className="w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1.5 text-center font-mono text-sm text-white outline-none focus:border-orange-500"
          />
        </div>
        <div className="min-w-0">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Unit</p>
          <p className="truncate font-mono text-sm text-slate-200">฿{unitPrice.toLocaleString()}</p>
        </div>
        <div className="min-w-0 text-right">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-slate-500">Total</p>
          <p className="truncate font-mono text-sm font-bold text-white">฿{total.toLocaleString()}</p>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-400">{freight.label}</p>
    </div>
  );
}
