'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  PROFILES_BY_WIDTH,
  RIMS_BY_PROFILE,
  VEHICLE_FITMENTS,
  MOCK_PLATE_LOOKUP,
  normalizePlate,
  type ResolvedFitment,
  type PlateLookupResult,
} from '@/lib/tyreFinder/fitmentData';

export type FinderTabId = 'size' | 'vehicle' | 'plate';

interface SizeSelection {
  width: number | null;
  profile: number | null;
  rimSize: number | null;
}

interface VehicleSelection {
  year: number | null;
  make: string | null;
  model: string | null;
  option: string | null;
}

type PlateStatus = 'idle' | 'loading' | 'found' | 'not-found';

export function useTyreFinder() {
  const [activeTab, setActiveTab] = useState<FinderTabId>('size');

  // --- Tab 1: size -----------------------------------------------------------
  const [size, setSize] = useState<SizeSelection>({ width: null, profile: null, rimSize: null });

  const availableProfiles = useMemo(
    () => (size.width ? PROFILES_BY_WIDTH[size.width] ?? [] : []),
    [size.width]
  );
  const availableRims = useMemo(
    () => (size.profile ? RIMS_BY_PROFILE[size.profile] ?? [] : []),
    [size.profile]
  );

  // Picking a wider field resets the narrower ones — you can't keep a
  // profile selection that's no longer valid for a newly chosen width.
  const setWidth = useCallback((width: number) => {
    setSize({ width, profile: null, rimSize: null });
  }, []);
  const setProfile = useCallback((profile: number) => {
    setSize((prev) => ({ ...prev, profile, rimSize: null }));
  }, []);
  const setRimSize = useCallback((rimSize: number) => {
    setSize((prev) => ({ ...prev, rimSize }));
  }, []);

  // --- Tab 2: vehicle ----------------------------------------------------------
  const [vehicle, setVehicle] = useState<VehicleSelection>({
    year: null,
    make: null,
    model: null,
    option: null,
  });

  const availableYears = useMemo(
    () => Array.from(new Set(VEHICLE_FITMENTS.map((f) => f.year))).sort((a, b) => b - a),
    []
  );
  const availableMakes = useMemo(() => {
    if (!vehicle.year) return [];
    return Array.from(
      new Set(VEHICLE_FITMENTS.filter((f) => f.year === vehicle.year).map((f) => f.make))
    ).sort();
  }, [vehicle.year]);
  const availableModels = useMemo(() => {
    if (!vehicle.year || !vehicle.make) return [];
    return Array.from(
      new Set(
        VEHICLE_FITMENTS.filter((f) => f.year === vehicle.year && f.make === vehicle.make).map(
          (f) => f.model
        )
      )
    ).sort();
  }, [vehicle.year, vehicle.make]);
  const availableOptions = useMemo(() => {
    if (!vehicle.year || !vehicle.make || !vehicle.model) return [];
    return VEHICLE_FITMENTS.filter(
      (f) => f.year === vehicle.year && f.make === vehicle.make && f.model === vehicle.model
    ).map((f) => f.option);
  }, [vehicle.year, vehicle.make, vehicle.model]);

  const setYear = useCallback((year: number) => {
    setVehicle({ year, make: null, model: null, option: null });
  }, []);
  const setMake = useCallback((make: string) => {
    setVehicle((prev) => ({ ...prev, make, model: null, option: null }));
  }, []);
  const setModel = useCallback((model: string) => {
    setVehicle((prev) => ({ ...prev, model, option: null }));
  }, []);
  const setOption = useCallback((option: string) => {
    setVehicle((prev) => ({ ...prev, option }));
  }, []);

  const vehicleFitment = useMemo((): ResolvedFitment | null => {
    if (!vehicle.year || !vehicle.make || !vehicle.model || !vehicle.option) return null;
    const match = VEHICLE_FITMENTS.find(
      (f) =>
        f.year === vehicle.year &&
        f.make === vehicle.make &&
        f.model === vehicle.model &&
        f.option === vehicle.option
    );
    return match ? { width: match.width, profile: match.profile, rimSize: match.rimSize } : null;
  }, [vehicle]);

  // --- Tab 3: plate ------------------------------------------------------------
  const [plateValue, setPlateValue] = useState('');
  const [plateStatus, setPlateStatus] = useState<PlateStatus>('idle');
  const [plateResult, setPlateResult] = useState<PlateLookupResult | null>(null);

  const lookupPlate = useCallback(() => {
    const normalized = normalizePlate(plateValue);
    if (!normalized) return;

    setPlateStatus('loading');
    setPlateResult(null);

    // Simulated network round trip — see fitmentData.ts for why this is mocked.
    window.setTimeout(() => {
      const match = MOCK_PLATE_LOOKUP[normalized];
      if (match) {
        setPlateResult(match);
        setPlateStatus('found');
      } else {
        setPlateStatus('not-found');
      }
    }, 650);
  }, [plateValue]);

  const resetPlate = useCallback(() => {
    setPlateValue('');
    setPlateStatus('idle');
    setPlateResult(null);
  }, []);

  // --- Resolution: whichever tab is active drives the shared result ----------
  const resolvedFitment = useMemo((): ResolvedFitment | null => {
    if (activeTab === 'size') {
      return size.width && size.profile && size.rimSize
        ? { width: size.width, profile: size.profile, rimSize: size.rimSize }
        : null;
    }
    if (activeTab === 'vehicle') {
      return vehicleFitment;
    }
    if (plateStatus === 'found' && plateResult) {
      return { width: plateResult.width, profile: plateResult.profile, rimSize: plateResult.rimSize };
    }
    return null;
  }, [activeTab, size, vehicleFitment, plateStatus, plateResult]);

  return {
    activeTab,
    setActiveTab,

    size,
    setWidth,
    setProfile,
    setRimSize,
    availableProfiles,
    availableRims,

    vehicle,
    setYear,
    setMake,
    setModel,
    setOption,
    availableYears,
    availableMakes,
    availableModels,
    availableOptions,

    plateValue,
    setPlateValue,
    plateStatus,
    plateResult,
    lookupPlate,
    resetPlate,

    resolvedFitment,
  };
}

export type UseTyreFinderReturn = ReturnType<typeof useTyreFinder>;
