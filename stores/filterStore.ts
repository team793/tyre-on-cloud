import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface SizeFilters {
  width: string | null;
  profile: string | null;
  rimSize: string | null;
  speedRating: string | null;
  loadIndex: string | null;
  tyretype: 'Summer' | 'Rainy' | 'AllSeason' | null;
}

export interface VehicleFilters {
  year: number | null;
  make: string | null;
  model: string | null;
  variant: string | null;
}

export interface PlateFilters {
  registrationNumber: string | null;
  vin: string | null;
}

export interface FilterState {
  // Filters
  sizeFilters: SizeFilters;
  vehicleFilters: VehicleFilters;
  plateFilters: PlateFilters;

  // UI State
  activeTab: 'size' | 'vehicle' | 'plate';
  matchingTyreCount: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  selectedTyres: string[];

  // Actions
  setActiveTab: (tab: 'size' | 'vehicle' | 'plate') => void;
  setSizeFilters: (filters: Partial<SizeFilters>) => void;
  setVehicleFilters: (filters: Partial<VehicleFilters>) => void;
  setPlateFilters: (filters: Partial<PlateFilters>) => void;
  resetFilters: () => void;
  setMatchingCount: (count: number) => void;
  setIsLoading: (loading: boolean) => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  addToCart: (tyreId: string) => void;
  removeFromCart: (tyreId: string) => void;
}

export const useFilterStore = create<FilterState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        sizeFilters: {
          width: null,
          profile: null,
          rimSize: null,
          speedRating: null,
          loadIndex: null,
          tyretype: null,
        },
        vehicleFilters: {
          year: null,
          make: null,
          model: null,
          variant: null,
        },
        plateFilters: {
          registrationNumber: null,
          vin: null,
        },
        activeTab: 'size',
        matchingTyreCount: 0,
        isLoading: false,
        isDrawerOpen: false,
        selectedTyres: [],

        // Actions
        setActiveTab: (tab) => set({ activeTab: tab }),

        setSizeFilters: (filters) =>
          set((state) => ({
            sizeFilters: { ...state.sizeFilters, ...filters },
          })),

        setVehicleFilters: (filters) =>
          set((state) => ({
            vehicleFilters: { ...state.vehicleFilters, ...filters },
          })),

        setPlateFilters: (filters) =>
          set((state) => ({
            plateFilters: { ...state.plateFilters, ...filters },
          })),

        resetFilters: () =>
          set({
            sizeFilters: {
              width: null,
              profile: null,
              rimSize: null,
              speedRating: null,
              loadIndex: null,
              tyretype: null,
            },
            vehicleFilters: {
              year: null,
              make: null,
              model: null,
              variant: null,
            },
            plateFilters: {
              registrationNumber: null,
              vin: null,
            },
            matchingTyreCount: 0,
          }),

        setMatchingCount: (count) => set({ matchingTyreCount: count }),
        setIsLoading: (loading) => set({ isLoading: loading }),
        toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
        setDrawerOpen: (open) => set({ isDrawerOpen: open }),

        addToCart: (tyreId) =>
          set((state) => ({
            selectedTyres: [...new Set([...state.selectedTyres, tyreId])],
          })),

        removeFromCart: (tyreId) =>
          set((state) => ({
            selectedTyres: state.selectedTyres.filter((id) => id !== tyreId),
          })),
      }),
      {
        name: 'tyre-filter-store',
      }
    )
  )
);
