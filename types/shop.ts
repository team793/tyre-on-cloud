export type TyreSeason = 'Summer' | 'Rainy' | 'AllSeason';
export type EfficiencyRating = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface WarehouseStock {
  warehouseId: string;
  warehouseName: string;
  region: 'North' | 'East' | 'South' | 'West';
  quantity: number;
}

export interface PricingTier {
  minQty: number;
  maxQty: number | null; // null = no upper bound (e.g. "40+")
  pricePerUnit: number;
}

export interface TyreProduct {
  id: string;
  sku: string;
  ean: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  width: number;
  profile: number;
  rimSize: number;
  speedRating: string;
  loadIndex: number;
  season: TyreSeason;
  wetGripRating: EfficiencyRating;
  fuelEfficiencyRating: EfficiencyRating;
  noiseLevelDb: number;
  priceRetail: number;
  costBasis: number;
  pricingTiers: PricingTier[];
  warehouseStock: WarehouseStock[];
  rating: number;
  reviewCount: number;
  tags: string[];
}
