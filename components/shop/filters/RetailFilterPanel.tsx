'use client';

import { Sun, Droplets, CloudRain } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useShopStore } from '@/stores/shopStore';
import type { EfficiencyRating, TyreSeason } from '@/types/shop';

const RATINGS: EfficiencyRating[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

const SEASON_OPTIONS: { value: TyreSeason; label: string; icon: typeof Sun }[] = [
  { value: 'Summer', label: 'Summer', icon: Sun },
  { value: 'Rainy', label: 'Rainy', icon: Droplets },
  { value: 'AllSeason', label: 'All-Season', icon: CloudRain },
];

function ratingColorClass(rating: EfficiencyRating): string {
  const colors: Record<EfficiencyRating, string> = {
    A: 'bg-emerald-500',
    B: 'bg-green-500',
    C: 'bg-lime-500',
    D: 'bg-yellow-500',
    E: 'bg-amber-500',
    F: 'bg-orange-500',
    G: 'bg-red-500',
  };
  return colors[rating];
}

export function RetailFilterPanel() {
  const filters = useShopStore((s) => s.retailFilters);
  const setFilters = useShopStore((s) => s.setRetailFilters);

  const toggleSeason = (season: TyreSeason) => {
    const next = filters.seasons.includes(season)
      ? filters.seasons.filter((s) => s !== season)
      : [...filters.seasons, season];
    setFilters({ seasons: next });
  };

  const toggleWetGrip = (rating: EfficiencyRating) => {
    const next = filters.wetGripRatings.includes(rating)
      ? filters.wetGripRatings.filter((r) => r !== rating)
      : [...filters.wetGripRatings, rating];
    setFilters({ wetGripRatings: next });
  };

  const toggleFuelEfficiency = (rating: EfficiencyRating) => {
    const next = filters.fuelEfficiencyRatings.includes(rating)
      ? filters.fuelEfficiencyRatings.filter((r) => r !== rating)
      : [...filters.fuelEfficiencyRatings, rating];
    setFilters({ fuelEfficiencyRatings: next });
  };

  return (
    <div className="space-y-8">
      {/* Seasonal fitment */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Seasonal Fitment</h3>
        <div className="flex flex-col gap-2">
          {SEASON_OPTIONS.map(({ value, label, icon: Icon }) => {
            const active = filters.seasons.includes(value);
            return (
              <button
                key={value}
                onClick={() => toggleSeason(value)}
                className={`flex items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition ${
                  active ? 'border-red-600 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">
          Price Range <span className="font-normal text-gray-500">(per tyre)</span>
        </h3>
        <Slider
          min={50}
          max={250}
          step={5}
          value={filters.priceRange}
          onValueChange={(value) => setFilters({ priceRange: value as [number, number] })}
          className="mb-3"
        />
        <div className="flex justify-between text-xs font-medium text-gray-600">
          <span>฿{filters.priceRange[0].toLocaleString()}</span>
          <span>฿{filters.priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Wet grip rating */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Wet Grip Rating</h3>
        <div className="flex flex-wrap gap-1.5">
          {RATINGS.map((rating) => {
            const active = filters.wetGripRatings.includes(rating);
            return (
              <button
                key={rating}
                onClick={() => toggleWetGrip(rating)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white transition ${ratingColorClass(
                  rating
                )} ${active ? 'ring-2 ring-offset-2 ring-gray-900' : 'opacity-40 hover:opacity-70'}`}
              >
                {rating}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fuel efficiency rating */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Fuel Efficiency Rating</h3>
        <div className="flex flex-wrap gap-1.5">
          {RATINGS.map((rating) => {
            const active = filters.fuelEfficiencyRatings.includes(rating);
            return (
              <button
                key={rating}
                onClick={() => toggleFuelEfficiency(rating)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white transition ${ratingColorClass(
                  rating
                )} ${active ? 'ring-2 ring-offset-2 ring-gray-900' : 'opacity-40 hover:opacity-70'}`}
              >
                {rating}
              </button>
            );
          })}
        </div>
      </div>

      {/* Noise level */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-gray-900">Max Noise Level</h3>
        <Slider
          min={65}
          max={80}
          step={1}
          value={[filters.maxNoiseLevel]}
          onValueChange={(value) => setFilters({ maxNoiseLevel: value[0] })}
          className="mb-3"
        />
        <div className="text-xs font-medium text-gray-600">Up to {filters.maxNoiseLevel} dB</div>
      </div>

      <button
        onClick={() =>
          setFilters({
            priceRange: [50, 250],
            wetGripRatings: [],
            fuelEfficiencyRatings: [],
            maxNoiseLevel: 80,
            seasons: [],
          })
        }
        className="w-full rounded-lg border-2 border-gray-200 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-red-600 hover:text-red-600"
      >
        Reset Filters
      </button>
    </div>
  );
}
