import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EfficiencyRating, TyreSeason } from '@/types/shop';

export type ShopMode = 'b2c' | 'b2b';

export interface RetailFilters {
  priceRange: [number, number];
  wetGripRatings: EfficiencyRating[];
  fuelEfficiencyRatings: EfficiencyRating[];
  maxNoiseLevel: number;
  seasons: TyreSeason[];
}

export interface DealerFilters {
  bulkAvailableOnly: boolean;
  minMarginPercent: number;
  warehouses: string[];
}

export interface RetailCartItem {
  quantity: number;
  installation: boolean;
}

interface ShopState {
  // Mode
  mode: ShopMode;
  setMode: (mode: ShopMode) => void;
  toggleMode: () => void;

  // B2C filters
  retailFilters: RetailFilters;
  setRetailFilters: (filters: Partial<RetailFilters>) => void;

  // B2B filters
  dealerFilters: DealerFilters;
  setDealerFilters: (filters: Partial<DealerFilters>) => void;

  // B2C cart
  retailCart: Record<string, RetailCartItem>;
  addToRetailCart: (productId: string, installation: boolean) => void;
  removeFromRetailCart: (productId: string) => void;
  setRetailCartQty: (productId: string, quantity: number) => void;
  clearRetailCart: () => void;

  // B2B cart (productId -> bulk quantity)
  dealerCart: Record<string, number>;
  setDealerQty: (productId: string, quantity: number) => void;

  // Mobile bottom-sheet
  mobileFilterSheetOpen: boolean;
  setMobileFilterSheetOpen: (open: boolean) => void;

  // Retail cart drawer
  cartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
}

const DEFAULT_RETAIL_FILTERS: RetailFilters = {
  priceRange: [50, 250],
  wetGripRatings: [],
  fuelEfficiencyRatings: [],
  maxNoiseLevel: 80,
  seasons: [],
};

const DEFAULT_DEALER_FILTERS: DealerFilters = {
  bulkAvailableOnly: false,
  minMarginPercent: 0,
  warehouses: [],
};

export const useShopStore = create<ShopState>()(
  devtools(
    (set, get) => ({
      mode: 'b2c',
      setMode: (mode) => set({ mode }, false, 'setMode'),
      toggleMode: () => set({ mode: get().mode === 'b2c' ? 'b2b' : 'b2c' }, false, 'toggleMode'),

      retailFilters: DEFAULT_RETAIL_FILTERS,
      setRetailFilters: (filters) =>
        set((state) => ({ retailFilters: { ...state.retailFilters, ...filters } }), false, 'setRetailFilters'),

      dealerFilters: DEFAULT_DEALER_FILTERS,
      setDealerFilters: (filters) =>
        set((state) => ({ dealerFilters: { ...state.dealerFilters, ...filters } }), false, 'setDealerFilters'),

      retailCart: {},
      addToRetailCart: (productId, installation) =>
        set(
          (state) => {
            const existing = state.retailCart[productId];
            return {
              retailCart: {
                ...state.retailCart,
                [productId]: {
                  quantity: (existing?.quantity ?? 0) + 1,
                  installation,
                },
              },
            };
          },
          false,
          'addToRetailCart'
        ),
      removeFromRetailCart: (productId) =>
        set(
          (state) => {
            const next = { ...state.retailCart };
            delete next[productId];
            return { retailCart: next };
          },
          false,
          'removeFromRetailCart'
        ),
      setRetailCartQty: (productId, quantity) =>
        set(
          (state) => {
            if (quantity <= 0) {
              const next = { ...state.retailCart };
              delete next[productId];
              return { retailCart: next };
            }
            const existing = state.retailCart[productId];
            if (!existing) return state;
            return { retailCart: { ...state.retailCart, [productId]: { ...existing, quantity } } };
          },
          false,
          'setRetailCartQty'
        ),
      clearRetailCart: () => set({ retailCart: {} }, false, 'clearRetailCart'),

      dealerCart: {},
      setDealerQty: (productId, quantity) =>
        set((state) => ({ dealerCart: { ...state.dealerCart, [productId]: quantity } }), false, 'setDealerQty'),

      mobileFilterSheetOpen: false,
      setMobileFilterSheetOpen: (open) => set({ mobileFilterSheetOpen: open }, false, 'setMobileFilterSheetOpen'),

      cartDrawerOpen: false,
      setCartDrawerOpen: (open) => set({ cartDrawerOpen: open }, false, 'setCartDrawerOpen'),
    }),
    { name: 'shop-store' }
  )
);
