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
// Profiles/rims for 245/255/265 widths include 60/65/70 so common pickup
// and SUV fitments (Hilux, D-Max, Fortuner, MU-X, Triton, Ranger) — a huge
// segment of the Thai market — are actually browsable here, not just
// reachable via the vehicle tab.
// ---------------------------------------------------------------------------
export const WIDTHS = [185, 195, 205, 215, 225, 235, 245, 255, 265] as const;

export const PROFILES_BY_WIDTH: Record<number, number[]> = {
  185: [55, 60, 65, 70],
  195: [50, 55, 60, 65],
  205: [40, 45, 50, 55, 60],
  215: [40, 45, 50, 55, 60, 65],
  225: [35, 40, 45, 50, 55, 60],
  235: [35, 40, 45, 50, 55, 60],
  245: [35, 40, 45, 50, 55, 65, 70],
  255: [35, 40, 45, 50, 60, 65],
  265: [35, 40, 45, 50, 60, 65],
};

export const RIMS_BY_PROFILE: Record<number, number[]> = {
  35: [18, 19, 20, 21],
  40: [17, 18, 19, 20],
  45: [16, 17, 18, 19],
  50: [15, 16, 17, 18],
  55: [14, 15, 16, 17],
  60: [13, 14, 15, 16, 17, 18],
  65: [13, 14, 15, 16, 17],
  70: [13, 14, 15, 16],
};

// ---------------------------------------------------------------------------
// Tab 2: Search by Vehicle
// Representative fitment sample weighted toward the actual Thai market —
// mass-market Toyota/Honda/Isuzu/Mazda/Mitsubishi/Nissan/Ford sedans, SUVs
// and 1-ton pickups (a huge, distinct segment here) make up most of the
// list, with a handful of premium imports kept for variety. Production
// would source this from a vehicle-fitment provider (e.g. TecDoc) or an
// internal table keyed by year/make/model/trim.
// ---------------------------------------------------------------------------
export interface VehicleFitmentRecord extends ResolvedFitment {
  year: number;
  make: string;
  model: string;
  option: string;
}

export const VEHICLE_FITMENTS: VehicleFitmentRecord[] = [
  // Toyota
  { year: 2024, make: 'Toyota', model: 'Vios', option: 'Entry', width: 185, profile: 60, rimSize: 15 },
  { year: 2024, make: 'Toyota', model: 'Yaris', option: 'Sport', width: 185, profile: 55, rimSize: 16 },
  { year: 2024, make: 'Toyota', model: 'Yaris Cross', option: 'Smart', width: 215, profile: 60, rimSize: 17 },
  { year: 2024, make: 'Toyota', model: 'Corolla Altis', option: 'Hybrid Premium', width: 205, profile: 55, rimSize: 16 },
  { year: 2024, make: 'Toyota', model: 'Camry', option: 'Hybrid Premium Luxury', width: 215, profile: 55, rimSize: 17 },
  { year: 2024, make: 'Toyota', model: 'Veloz', option: 'Premium', width: 205, profile: 60, rimSize: 16 },
  { year: 2023, make: 'Toyota', model: 'RAV4', option: 'Hybrid Dynamic', width: 235, profile: 60, rimSize: 18 },
  { year: 2024, make: 'Toyota', model: 'Fortuner', option: 'Legender', width: 265, profile: 60, rimSize: 18 },
  { year: 2024, make: 'Toyota', model: 'Hilux Revo', option: 'Double Cab Z Edition', width: 265, profile: 65, rimSize: 17 },

  // Honda
  { year: 2024, make: 'Honda', model: 'City', option: 'e:HEV SV', width: 185, profile: 55, rimSize: 16 },
  { year: 2024, make: 'Honda', model: 'Civic', option: 'RS', width: 215, profile: 50, rimSize: 17 },
  { year: 2024, make: 'Honda', model: 'BR-V', option: 'SV', width: 195, profile: 60, rimSize: 16 },
  { year: 2024, make: 'Honda', model: 'HR-V', option: 'RS', width: 215, profile: 55, rimSize: 17 },
  { year: 2024, make: 'Honda', model: 'CR-V', option: 'e:HEV RS', width: 235, profile: 60, rimSize: 18 },

  // Isuzu
  { year: 2024, make: 'Isuzu', model: 'D-Max', option: 'Hi-Lander', width: 265, profile: 65, rimSize: 17 },
  { year: 2024, make: 'Isuzu', model: 'MU-X', option: 'Ultimate', width: 265, profile: 60, rimSize: 18 },

  // Mazda
  { year: 2024, make: 'Mazda', model: 'Mazda 2', option: 'Sports High', width: 185, profile: 60, rimSize: 15 },
  { year: 2024, make: 'Mazda', model: 'Mazda 3', option: 'SP', width: 215, profile: 45, rimSize: 18 },
  { year: 2024, make: 'Mazda', model: 'CX-5', option: 'SP', width: 225, profile: 55, rimSize: 19 },

  // Mitsubishi
  { year: 2024, make: 'Mitsubishi', model: 'Xpander', option: 'Ultimate', width: 205, profile: 55, rimSize: 16 },
  { year: 2024, make: 'Mitsubishi', model: 'Triton', option: 'Athlete', width: 245, profile: 65, rimSize: 17 },

  // Nissan
  { year: 2024, make: 'Nissan', model: 'Almera', option: 'VL', width: 185, profile: 55, rimSize: 16 },
  { year: 2024, make: 'Nissan', model: 'Navara', option: 'Pro-4X', width: 255, profile: 60, rimSize: 18 },

  // Ford
  { year: 2024, make: 'Ford', model: 'Ranger', option: 'Wildtrak', width: 265, profile: 60, rimSize: 18 },
  { year: 2024, make: 'Ford', model: 'Everest', option: 'Titanium+', width: 255, profile: 60, rimSize: 18 },
  { year: 2024, make: 'Ford', model: 'Focus', option: 'ST-Line', width: 215, profile: 45, rimSize: 17 },

  // Suzuki
  { year: 2024, make: 'Suzuki', model: 'Swift', option: 'GLX', width: 185, profile: 55, rimSize: 16 },

  // Premium imports (kept for variety — smaller share of the real market)
  { year: 2024, make: 'BMW', model: '3 Series', option: '320i Sport', width: 225, profile: 45, rimSize: 17 },
  { year: 2024, make: 'BMW', model: '3 Series', option: '330i M Sport', width: 235, profile: 35, rimSize: 19 },
  { year: 2023, make: 'BMW', model: 'X5', option: 'xDrive40i', width: 235, profile: 60, rimSize: 18 },
  { year: 2024, make: 'Audi', model: 'A4', option: '40 TFSI', width: 225, profile: 50, rimSize: 17 },
  { year: 2023, make: 'Audi', model: 'Q5', option: '45 TFSI quattro', width: 235, profile: 55, rimSize: 18 },
];

// ---------------------------------------------------------------------------
// Tab 3: Search by plate
// Mock registration -> vehicle resolution, using real Thai plate formatting
// (two Thai consonants + 4 digits, e.g. "กข 1234") to match what the UI
// actually asks the customer to type — see platePlaceholder in lib/i18n.ts.
// A real lookup goes through a licensed data reseller (the DLT — Thailand's
// Department of Land Transport — or a commercial reseller of its data);
// this simulates that round trip for the UI without requiring the contract.
// ---------------------------------------------------------------------------
export interface PlateLookupResult extends ResolvedFitment {
  make: string;
  model: string;
}

export const MOCK_PLATE_LOOKUP: Record<string, PlateLookupResult> = {
  กข1234: { make: 'Toyota', model: 'Vios', width: 185, profile: 60, rimSize: 15 },
  ขค4567: { make: 'Honda', model: 'City', width: 185, profile: 55, rimSize: 16 },
  คง8899: { make: 'Toyota', model: 'Corolla Altis', width: 205, profile: 55, rimSize: 16 },
  งจ2345: { make: 'Isuzu', model: 'D-Max', width: 265, profile: 65, rimSize: 17 },
  ฉช6677: { make: 'Toyota', model: 'Fortuner', width: 265, profile: 60, rimSize: 18 },
  ชซ3344: { make: 'Mazda', model: 'Mazda 3', width: 215, profile: 45, rimSize: 18 },
  ญฎ1212: { make: 'Mitsubishi', model: 'Triton', width: 245, profile: 65, rimSize: 17 },
  ฎฏ3434: { make: 'Nissan', model: 'Almera', width: 185, profile: 55, rimSize: 16 },
  ฏฐ5656: { make: 'Ford', model: 'Ranger', width: 265, profile: 60, rimSize: 18 },
  ฐฑ7878: { make: 'BMW', model: '3 Series', width: 225, profile: 45, rimSize: 17 },
};

export function normalizePlate(value: string): string {
  return value.replace(/\s+/g, '').toUpperCase();
}
