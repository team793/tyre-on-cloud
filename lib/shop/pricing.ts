import type { PricingTier, WarehouseStock } from '@/types/shop';

/**
 * Returns the per-unit wholesale price for a given quantity, based on the
 * product's tiered volume pricing scale (e.g. 1-9 / 10-39 / 40+).
 */
export function getTierPrice(tiers: PricingTier[], quantity: number): number {
  if (tiers.length === 0) return 0;
  const tier = tiers.find((t) => quantity >= t.minQty && (t.maxQty === null || quantity <= t.maxQty));
  return tier ? tier.pricePerUnit : tiers[tiers.length - 1].pricePerUnit;
}

/** Sums quantity across all (or a filtered subset of) warehouse stock records. */
export function getTotalWarehouseStock(stock: Pick<WarehouseStock, 'quantity'>[]): number {
  return stock.reduce((sum, w) => sum + w.quantity, 0);
}

/**
 * Dealer profit margin if the dealer buys at `wholesalePrice` and resells at
 * `retailPrice`. Returned as a percentage rounded to one decimal place.
 */
export function calculateMarginPercent(retailPrice: number, wholesalePrice: number): number {
  if (retailPrice <= 0) return 0;
  return Math.round(((retailPrice - wholesalePrice) / retailPrice) * 1000) / 10;
}

export interface FreightEstimate {
  label: string;
  days: string;
}

/**
 * Mock freight estimation: prefers a single warehouse that can fulfil the
 * full order; falls back to multi-warehouse consolidation; otherwise flags
 * a backorder. In production this would call a live logistics/ERP API.
 */
export function estimateFreight(
  stock: WarehouseStock[],
  selectedWarehouses: string[],
  requestedQty: number
): FreightEstimate {
  const relevantStock =
    selectedWarehouses.length > 0 ? stock.filter((s) => selectedWarehouses.includes(s.warehouseId)) : stock;

  const bestSingleWarehouse = relevantStock.reduce((max, s) => Math.max(max, s.quantity), 0);
  const totalStock = getTotalWarehouseStock(relevantStock);

  if (bestSingleWarehouse >= requestedQty) {
    return { label: 'Ships in 2-3 business days', days: '2-3 days' };
  }
  if (totalStock >= requestedQty) {
    return { label: 'Multi-warehouse consolidation · 4-6 days', days: '4-6 days' };
  }
  return { label: 'Backorder · 10-14 business days', days: '10-14 days' };
}
