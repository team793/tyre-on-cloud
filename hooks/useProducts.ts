'use client';

import { useQuery } from '@tanstack/react-query';
import type { TyreProduct, TyreSeason, EfficiencyRating } from '@/types/shop';

export interface ProductQueryFilters {
  width?: number;
  profile?: number;
  rimSize?: number;
  tyreType?: TyreSeason;
}

// Map API / Prisma response shape → TyreProduct used by UI components
function mapProduct(raw: Record<string, unknown>): TyreProduct {
  const inventory = Array.isArray(raw.inventory) ? raw.inventory : [];
  const pricingTiers = Array.isArray(raw.pricingTiers) ? raw.pricingTiers : [];

  return {
    id:                   String(raw.id ?? ''),
    sku:                  String(raw.sku ?? ''),
    ean:                  String(raw.ean ?? ''),
    name:                 String(raw.name ?? ''),
    brand:                String(raw.brand ?? ''),
    imageUrl:             typeof raw.imageUrl === 'string' ? raw.imageUrl : null,
    width:                Number(raw.width),
    profile:              Number(raw.profile),
    rimSize:              Number(raw.rimSize),
    speedRating:          String(raw.speedRating ?? 'R'),
    loadIndex:            Number(raw.loadIndex ?? 91),
    season:               (raw.tyreType as TyreSeason) ?? 'Summer',
    wetGripRating:        ((raw.wetGripRating as string) ?? 'C') as EfficiencyRating,
    fuelEfficiencyRating: ((raw.fuelEfficiencyRating as string) ?? 'C') as EfficiencyRating,
    noiseLevelDb:         Number(raw.noiseLevelDb ?? 72),
    priceRetail:          Number(raw.priceRetail ?? 0),
    costBasis:            Number(raw.priceDealer ?? raw.priceRetail ?? 0),
    pricingTiers: pricingTiers.map((t: Record<string, unknown>) => ({
      minQty:       Number(t.minQty),
      maxQty:       t.maxQty != null ? Number(t.maxQty) : null,
      pricePerUnit: Number(t.pricePerUnit),
    })),
    warehouseStock: inventory.map((inv: Record<string, unknown>) => {
      const wh = (inv.warehouse as Record<string, unknown>) ?? {};
      return {
        warehouseId:   String(inv.warehouseId ?? ''),
        warehouseName: String(wh.name ?? 'Warehouse'),
        region:        'North' as const,
        quantity:      Number(inv.quantity ?? 0),
      };
    }),
    rating:      Number(raw.rating ?? 0),
    reviewCount: Number(raw.reviewCount ?? 0),
    tags:        Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
  };
}

async function fetchProducts(filters: ProductQueryFilters) {
  const params = new URLSearchParams();
  if (filters.width)    params.set('width',    String(filters.width));
  if (filters.profile)  params.set('profile',  String(filters.profile));
  if (filters.rimSize)  params.set('rimSize',  String(filters.rimSize));
  if (filters.tyreType) params.set('tyreType', filters.tyreType);

  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to load products');

  const json = await res.json() as { products: Record<string, unknown>[]; isDealer: boolean };
  return {
    products: json.products.map(mapProduct),
    isDealer: json.isDealer,
  };
}

export interface UseProductsOptions {
  enabled?: boolean;
}

export function useProducts(filters: ProductQueryFilters = {}, options: UseProductsOptions = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn:  () => fetchProducts(filters),
    staleTime: 60_000,
    enabled:   options.enabled ?? true,
  });
}
