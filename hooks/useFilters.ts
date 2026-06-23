import { useEffect, useState } from 'react';
import { useFilterStore } from '@/stores/filterStore';

// Valid profile mappings based on width
const VALID_PROFILE_BY_WIDTH: Record<string, string[]> = {
  '185': ['55', '60', '65', '70'],
  '195': ['45', '50', '55', '60', '65', '70'],
  '205': ['40', '45', '50', '55', '60', '65'],
  '215': ['40', '45', '50', '55', '60'],
  '225': ['40', '45', '50', '55', '60'],
  '235': ['40', '45', '50', '55', '60'],
  '245': ['35', '40', '45', '50', '55'],
  '255': ['35', '40', '45', '50'],
  '265': ['30', '35', '40', '45'],
  '275': ['30', '35', '40', '45'],
  '285': ['30', '35', '40', '45'],
};

// Valid rim mappings based on profile
const VALID_RIM_BY_PROFILE: Record<string, string[]> = {
  '30': ['17', '18', '19', '20', '21', '22'],
  '35': ['16', '17', '18', '19', '20', '21', '22'],
  '40': ['15', '16', '17', '18', '19', '20', '21'],
  '45': ['14', '15', '16', '17', '18', '19', '20'],
  '50': ['13', '14', '15', '16', '17', '18', '19'],
  '55': ['12', '13', '14', '15', '16', '17', '18'],
  '60': ['13', '14', '15', '16', '17'],
  '65': ['13', '14', '15', '16'],
  '70': ['13', '14', '15'],
};

// Available widths
export const AVAILABLE_WIDTHS = Object.keys(VALID_PROFILE_BY_WIDTH);

// Available tyre types
export const TYRE_TYPES = ['Summer', 'Rainy', 'AllSeason'] as const;

// Speed ratings
export const SPEED_RATINGS = ['H', 'T', 'V', 'W', 'Y', 'Z'] as const;

// Load indices (common values)
export const LOAD_INDICES = [
  '86', '87', '88', '89', '90', '91', '92', '93', '94', '95',
  '96', '97', '98', '99', '100', '101', '102', '103', '104', '105',
] as const;

// Vehicle data
export const VEHICLE_YEARS = Array.from({ length: 20 }, (_, i) => 2026 - i);

export const VEHICLE_MAKES = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Ford',
  'Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia',
  'Volkswagen', 'Skoda', 'Seat', 'Renault', 'Peugeot',
  'Citroën', 'Fiat', 'Alfa Romeo', 'Jeep', 'Porsche',
] as const;

// Mock vehicle fitment data
export const VEHICLE_MODELS: Record<string, Record<string, string[]>> = {
  'BMW': {
    'X5': ['SE', 'M40i', 'M50i', 'iX'],
    '3 Series': ['320i', '330i', 'M340i'],
    '5 Series': ['520i', '530i', 'M550i'],
  },
  'Mercedes-Benz': {
    'C-Class': ['C200', 'C300', 'AMG C43'],
    'E-Class': ['E300', 'E450', 'AMG E53'],
    'GLE': ['GLE350', 'GLE450', 'AMG GLE63'],
  },
  'Audi': {
    'A4': ['Sport', 'Premium', 'Prestige'],
    'A6': ['Sport', 'Premium', 'Prestige'],
    'Q5': ['45 TFSI', '55 TFSI', 'SQ5'],
  },
  'Volkswagen': {
    'Golf': ['S', 'SE', 'R'],
    'Passat': ['S', 'R-Line', 'Elegance'],
    'Tiguan': ['S', 'SE', 'R-Line'],
  },
};

/**
 * Hook to get valid filter options based on cascade logic
 */
export const useValidFilters = () => {
  const sizeFilters = useFilterStore((state) => state.sizeFilters);
  const [validOptions, setValidOptions] = useState({
    profiles: [] as string[],
    rims: [] as string[],
    speedRatings: SPEED_RATINGS as readonly string[],
    loadIndices: LOAD_INDICES as readonly (typeof LOAD_INDICES)[number][],
  });

  useEffect(() => {
    const newValidOptions = {
      profiles: [] as string[],
      rims: [] as string[],
      speedRatings: SPEED_RATINGS as readonly string[],
      loadIndices: LOAD_INDICES as readonly (typeof LOAD_INDICES)[number][],
    };

    // If width selected, filter profiles
    if (sizeFilters.width) {
      newValidOptions.profiles = VALID_PROFILE_BY_WIDTH[sizeFilters.width] || [];
    }

    // If profile selected, filter rims
    if (sizeFilters.profile) {
      newValidOptions.rims = VALID_RIM_BY_PROFILE[sizeFilters.profile] || [];
    }

    setValidOptions(newValidOptions);
  }, [sizeFilters.width, sizeFilters.profile]);

  return validOptions;
};

/**
 * Hook to get vehicle models based on selected make
 */
export const useVehicleModels = (make: string | null) => {
  const [models, setModels] = useState<string[]>([]);

  useEffect(() => {
    if (make && make in VEHICLE_MODELS) {
      setModels(Object.keys(VEHICLE_MODELS[make as keyof typeof VEHICLE_MODELS]));
    } else {
      setModels([]);
    }
  }, [make]);

  return models;
};

/**
 * Hook to get vehicle variants based on make and model
 */
export const useVehicleVariants = (make: string | null, model: string | null) => {
  const [variants, setVariants] = useState<string[]>([]);

  useEffect(() => {
    if (make && model && make in VEHICLE_MODELS) {
      const makeData = VEHICLE_MODELS[make as keyof typeof VEHICLE_MODELS];
      if (model in makeData) {
        setVariants(makeData[model as keyof typeof makeData]);
      } else {
        setVariants([]);
      }
    } else {
      setVariants([]);
    }
  }, [make, model]);

  return variants;
};

/**
 * Simulate getting matching tyres based on filters
 * In production, this would be a TanStack Query hook calling your API
 */
export const useMatchingTyres = () => {
  const filters = useFilterStore();
  const sizeFilters = filters.sizeFilters;
  const vehicleFilters = filters.vehicleFilters;
  const plateFilters = filters.plateFilters;
  const activeTab = filters.activeTab;

  useEffect(() => {
    // Simulate API call delay
    const delay = setTimeout(() => {
      let count = 0;

      if (activeTab === 'size') {
        // Calculate matching tyres for size search
        if (sizeFilters.width && sizeFilters.profile && sizeFilters.rimSize) {
          // Mock: random count between 15-150 based on selections
          const hash = sizeFilters.width.charCodeAt(0) + 
                      sizeFilters.profile.charCodeAt(0) + 
                      sizeFilters.rimSize.charCodeAt(0);
          count = 15 + (hash % 135);
        }
      } else if (activeTab === 'vehicle') {
        // Calculate matching tyres for vehicle search
        if (vehicleFilters.make && vehicleFilters.model) {
          const hash = vehicleFilters.make.charCodeAt(0) + 
                      vehicleFilters.model.charCodeAt(0);
          count = 8 + (hash % 42);
        }
      } else if (activeTab === 'plate') {
        // Calculate matching tyres for plate search
        if (plateFilters.registrationNumber && plateFilters.registrationNumber.length === 7) {
          const hash = plateFilters.registrationNumber.charCodeAt(0);
          count = 12 + (hash % 38);
        }
      }

      filters.setMatchingCount(count);
      filters.setIsLoading(false);
    }, 200); // Simulate 200ms API response

    filters.setIsLoading(true);

    return () => clearTimeout(delay);
  }, [activeTab, sizeFilters, vehicleFilters, plateFilters]);
};
