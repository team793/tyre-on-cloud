export interface ResolvedFitment {
  width: number;
  profile: number;
  rimSize: number;
}

// ---------------------------------------------------------------------------
// Tab 1: Search by Size
// A representative subset of valid width/profile/rim combinations — not the
// full ETRTO chart, but enough to demonstrate real cascade filtering. This
// is deliberately a static reference table, not derived from `products`:
// a size can be a valid, real fitment and simply be out of stock right now.
// The cascade should reflect what sizes *exist*; the live counter elsewhere
// reflects what's *in stock*. Conflating the two would hide valid sizes
// just because nothing's currently sitting on a shelf.
// ---------------------------------------------------------------------------
export const WIDTHS = [185, 195, 205, 215, 225, 235, 245, 255, 265] as const;

export const PROFILES_BY_WIDTH: Record<number, number[]> = {
  185: [55, 60, 65, 70],
  195: [50, 55, 60, 65],
  205: [40, 45, 50, 55, 60],
  215: [40, 45, 50, 55, 60, 65],
  225: [35, 40, 45, 50, 55, 60],
  235: [35, 40, 45, 50, 55, 60],
  245: [35, 40, 45, 50, 55],
  255: [35, 40, 45, 50],
  265: [35, 40, 45, 50],
};

export const RIMS_BY_PROFILE: Record<number, number[]> = {
  35: [18, 19, 20, 21],
  40: [17, 18, 19, 20],
  45: [16, 17, 18, 19],
  50: [15, 16, 17, 18],
  55: [14, 15, 16, 17],
  60: [13, 14, 15, 16],
  65: [13, 14, 15],
  70: [13, 14],
};

// ---------------------------------------------------------------------------
// Tab 2: Search by Vehicle
// Representative fitment sample. Production would source this from a
// vehicle-fitment provider (e.g. TecDoc) or an internal table keyed by
// year/make/model/trim.
// ---------------------------------------------------------------------------
export interface VehicleFitmentRecord extends ResolvedFitment {
  year: number;
  make: string;
  model: string;
  option: string;
}

export const VEHICLE_FITMENTS: VehicleFitmentRecord[] = [
  { year: 2024, make: 'BMW', model: '3 Series', option: '320i Sport', width: 225, profile: 45, rimSize: 17 },
  { year: 2024, make: 'BMW', model: '3 Series', option: '330i M Sport', width: 235, profile: 35, rimSize: 19 },
  { year: 2023, make: 'BMW', model: 'X5', option: 'xDrive40i', width: 235, profile: 60, rimSize: 18 },
  { year: 2024, make: 'Audi', model: 'A4', option: '40 TFSI', width: 225, profile: 50, rimSize: 17 },
  { year: 2023, make: 'Audi', model: 'Q5', option: '45 TFSI quattro', width: 235, profile: 55, rimSize: 18 },
  { year: 2024, make: 'Toyota', model: 'Corolla', option: 'Hybrid Icon', width: 205, profile: 55, rimSize: 16 },
  { year: 2023, make: 'Toyota', model: 'RAV4', option: 'Hybrid Dynamic', width: 235, profile: 60, rimSize: 18 },
  { year: 2024, make: 'Ford', model: 'Focus', option: 'ST-Line', width: 215, profile: 45, rimSize: 17 },
];

// ---------------------------------------------------------------------------
// Tab 3: Search by plate
// Mock registration -> vehicle resolution. A real lookup goes through a
// licensed data reseller (DVLA-derived in the UK, equivalent elsewhere) —
// this simulates that round trip for the UI without requiring the contract.
// ---------------------------------------------------------------------------
export interface PlateLookupResult extends ResolvedFitment {
  make: string;
  model: string;
}

export const MOCK_PLATE_LOOKUP: Record<string, PlateLookupResult> = {
  AB12CDE: { make: 'BMW', model: '3 Series', width: 225, profile: 45, rimSize: 17 },
  XY34FGH: { make: 'Audi', model: 'A4', width: 225, profile: 50, rimSize: 17 },
  LM56NOP: { make: 'Toyota', model: 'RAV4', width: 235, profile: 60, rimSize: 18 },
};

export function normalizePlate(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}
