'use client';

import { useState, useMemo } from 'react';
import type { TyreProduct } from '@/types/shop';
import { useShopStore } from '@/stores/shopStore';
import { getTierPrice, calculateMarginPercent, estimateFreight } from '@/lib/shop/pricing';
import { abbreviateWarehouse, stockBadgeClass, marginColorClass } from '@/lib/shop/format';
import { TyreThumbnail } from '@/components/shared/TyreThumbnail';

interface DealerRowProps {
  product: TyreProduct;
  index: number;
  registerRef: (el: HTMLInputElement | null) => void;
  onNavigate: (index: number) => void;
  selectedWarehouses: string[];
}

export function DealerRow({ product, index, registerRef, onNavigate, selectedWarehouses }: DealerRowProps) {
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
    <tr className="group border-b border-slate-800/80 text-slate-200 transition-colors hover:bg-slate-800/40">
      <td className="sticky left-0 z-10 bg-slate-950 px-4 py-3 font-semibold text-white group-hover:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <TyreThumbnail
            imageUrl={product.imageUrl}
            brand={product.brand}
            alt={product.name}
            className="h-9 w-9 shrink-0 rounded-lg bg-slate-800"
          />
          <div>
            <p className="leading-tight">{product.name}</p>
            <p className="text-xs font-normal text-slate-500">
              {product.width}/{product.profile} R{product.rimSize}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-xs text-slate-400">
        <p className="font-mono text-slate-300">{product.sku}</p>
        <p className="font-mono">{product.ean}</p>
      </td>

      <td className="px-4 py-3 text-xs text-slate-400">
        <p>LI {product.loadIndex}</p>
        <p>Speed {product.speedRating}</p>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5 text-xs">
          {product.pricingTiers.map((tier) => (
            <span key={tier.minQty} className="font-mono text-slate-400">
              {tier.minQty}-{tier.maxQty ?? '∞'}: <strong className="text-slate-200">฿{tier.pricePerUnit.toLocaleString()}</strong>
            </span>
          ))}
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {product.warehouseStock.map((wh) => (
            <span
              key={wh.warehouseId}
              className={`rounded-full border px-2 py-0.5 text-[11px] font-bold ${stockBadgeClass(wh.quantity)}`}
            >
              {abbreviateWarehouse(wh.warehouseName)}: {wh.quantity}
            </span>
          ))}
        </div>
      </td>

      <td className="px-4 py-3">
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
          className="w-20 rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-center font-mono text-sm text-white outline-none focus:border-orange-500"
        />
      </td>

      <td className="px-4 py-3 font-mono text-sm text-slate-200">฿{unitPrice.toLocaleString()}</td>

      <td className="px-4 py-3">
        <span className={`font-mono text-sm font-bold ${marginColorClass(margin)}`}>{margin}%</span>
      </td>

      <td className="px-4 py-3 text-xs text-slate-400">{freight.label}</td>

      <td className="px-4 py-3 text-right font-mono text-sm font-bold text-white">฿{total.toLocaleString()}</td>
    </tr>
  );
}
