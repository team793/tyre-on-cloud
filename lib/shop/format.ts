/** "Warehouse North" -> "WH-N" */
export function abbreviateWarehouse(warehouseName: string): string {
  const word = warehouseName.replace('Warehouse', '').trim();
  return `WH-${word.charAt(0).toUpperCase()}`;
}

/** Tailwind classes for a stock-level pill badge, color-coded by quantity on hand. */
export function stockBadgeClass(quantity: number): string {
  if (quantity === 0) return 'bg-red-500/15 text-red-400 border-red-500/30';
  if (quantity < 50) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
}

/** Tailwind text color for a margin percentage, color-coded by healthiness. */
export function marginColorClass(marginPercent: number): string {
  if (marginPercent >= 25) return 'text-emerald-400';
  if (marginPercent >= 10) return 'text-amber-400';
  return 'text-red-400';
}
