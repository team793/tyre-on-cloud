'use client';

import { useMemo, useRef } from 'react';
import { useShopStore } from '@/stores/shopStore';
import { useProducts } from '@/hooks/useProducts';
import { DealerFilterPanel } from './filters/DealerFilterPanel';
import { DealerRow } from './DealerRow';
import { DealerCard } from './DealerCard';
import { getTierPrice, getTotalWarehouseStock, calculateMarginPercent } from '@/lib/shop/pricing';
import type { WarehouseStock } from '@/types/shop';

export function DealerMatrix() {
  const filters        = useShopStore((s) => s.dealerFilters);
  const tableQtyRefs    = useRef<(HTMLInputElement | null)[]>([]);
  const cardQtyRefs     = useRef<(HTMLInputElement | null)[]>([]);

  const { data, isLoading, isError } = useProducts();
  const allProducts = data?.products ?? [];

  // Derive real warehouse list from product data so filter IDs always match
  const availableWarehouses = useMemo<Pick<WarehouseStock, 'warehouseId' | 'warehouseName'>[]>(() => {
    const seen = new Map<string, string>();
    allProducts.forEach((p) =>
      p.warehouseStock.forEach((w) => {
        if (!seen.has(w.warehouseId)) seen.set(w.warehouseId, w.warehouseName);
      })
    );
    return Array.from(seen.entries()).map(([warehouseId, warehouseName]) => ({ warehouseId, warehouseName }));
  }, [allProducts]);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const totalStock = getTotalWarehouseStock(product.warehouseStock);
      if (filters.bulkAvailableOnly && totalStock < 40) return false;

      const baseTierPrice = getTierPrice(product.pricingTiers, 1);
      // Skip margin filter when prices are unset (all ฿0 = no pricing data yet)
      if (product.priceRetail > 0) {
        const margin = calculateMarginPercent(product.priceRetail, baseTierPrice);
        if (margin < filters.minMarginPercent) return false;
      }

      if (filters.warehouses.length > 0) {
        const hasStockInSelected = product.warehouseStock.some(
          (w) => filters.warehouses.includes(w.warehouseId) && w.quantity > 0
        );
        if (!hasStockInSelected) return false;
      }

      return true;
    });
  }, [allProducts, filters]);

  const makeFocusInput = (refs: typeof tableQtyRefs) => (index: number) => {
    if (filteredProducts.length === 0) return;
    const clamped = Math.max(0, Math.min(index, filteredProducts.length - 1));
    const el = refs.current[clamped];
    if (el) { el.focus(); el.select(); }
  };
  const focusTableInput = makeFocusInput(tableQtyRefs);
  const focusCardInput  = makeFocusInput(cardQtyRefs);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <DealerFilterPanel warehouses={availableWarehouses} />
        </div>
      </aside>

      <section className="min-w-0">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold text-white">
            {isLoading ? 'Loading…' : `${filteredProducts.length} SKU${filteredProducts.length === 1 ? '' : 's'} Matching`}
          </h1>
          <p className="text-sm text-slate-400">↑ / ↓ to move between quantity fields</p>
        </div>

        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-800" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border border-slate-700 py-16 text-center text-red-400">
            Failed to load products. Please refresh.
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="hidden overflow-x-auto rounded-2xl border border-slate-800 lg:block">
              <table className="w-full min-w-[1320px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900 text-left text-xs font-bold uppercase tracking-wide text-slate-400">
                    <th className="sticky left-0 z-10 bg-slate-900 px-4 py-3">Product</th>
                    <th className="px-4 py-3">SKU / EAN</th>
                    <th className="px-4 py-3">Specs</th>
                    <th className="px-4 py-3">Volume Pricing</th>
                    <th className="px-4 py-3">Warehouse Stock</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Unit Price</th>
                    <th className="px-4 py-3">Margin</th>
                    <th className="px-4 py-3">Freight ETA</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <DealerRow
                      key={product.id}
                      product={product}
                      index={index}
                      registerRef={(el) => (tableQtyRefs.current[index] = el)}
                      onNavigate={focusTableInput}
                      selectedWarehouses={filters.warehouses}
                    />
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="py-16 text-center text-slate-500">No SKUs match the current dealer filters.</div>
              )}
            </div>

            <div className="space-y-3 lg:hidden">
              {filteredProducts.map((product, index) => (
                <DealerCard
                  key={product.id}
                  product={product}
                  index={index}
                  registerRef={(el) => (cardQtyRefs.current[index] = el)}
                  onNavigate={focusCardInput}
                  selectedWarehouses={filters.warehouses}
                />
              ))}

              {filteredProducts.length === 0 && (
                <div className="rounded-2xl border border-slate-800 py-16 text-center text-slate-500">
                  No SKUs match the current dealer filters.
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
