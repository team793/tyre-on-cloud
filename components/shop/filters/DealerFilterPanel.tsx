'use client';

import { Slider } from '@/components/ui/slider';
import { useShopStore } from '@/stores/shopStore';
import type { WarehouseStock } from '@/types/shop';

interface DealerFilterPanelProps {
  warehouses?: Pick<WarehouseStock, 'warehouseId' | 'warehouseName'>[];
}

export function DealerFilterPanel({ warehouses = [] }: DealerFilterPanelProps) {
  const filters = useShopStore((s) => s.dealerFilters);
  const setFilters = useShopStore((s) => s.setDealerFilters);

  const toggleWarehouse = (id: string) => {
    const next = filters.warehouses.includes(id)
      ? filters.warehouses.filter((w) => w !== id)
      : [...filters.warehouses, id];
    setFilters({ warehouses: next });
  };

  return (
    <div className="space-y-8">
      {/* Bulk availability */}
      <div>
        <h3 className="mb-3 text-sm font-bold text-slate-100">Bulk Availability</h3>
        <button
          onClick={() => setFilters({ bulkAvailableOnly: !filters.bulkAvailableOnly })}
          className={`flex w-full items-center justify-between rounded-lg border-2 px-3 py-2.5 text-sm font-semibold transition ${
            filters.bulkAvailableOnly
              ? 'border-brand-500 bg-brand-500/10 text-brand-400'
              : 'border-slate-700 text-slate-300 hover:border-slate-600'
          }`}
        >
          40+ units in stock only
          <span
            className={`relative h-5 w-9 rounded-full transition-colors ${
              filters.bulkAvailableOnly ? 'bg-brand-500' : 'bg-slate-700'
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                filters.bulkAvailableOnly ? 'translate-x-[18px]' : 'translate-x-0.5'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Minimum margin — only shown once prices are set */}
      <div>
        <h3 className="mb-1 text-sm font-bold text-slate-100">
          Minimum Margin{' '}
          <span className="font-normal text-slate-500">(resale vs. wholesale)</span>
        </h3>
        <p className="mb-3 text-xs text-slate-600">Available after prices are configured</p>
        <Slider
          min={0}
          max={50}
          step={1}
          value={[filters.minMarginPercent]}
          onValueChange={(value) => setFilters({ minMarginPercent: value[0] })}
          accentClassName="bg-brand-500"
          trackClassName="bg-slate-700"
          className="mb-3"
        />
        <div className="text-xs font-medium text-slate-400">{filters.minMarginPercent}% or higher</div>
      </div>

      {/* Warehouse location — uses real IDs from the database */}
      {warehouses.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold text-slate-100">Warehouse Location</h3>
          <div className="flex flex-col gap-2">
            {warehouses.map((wh) => {
              const active = filters.warehouses.includes(wh.warehouseId);
              return (
                <button
                  key={wh.warehouseId}
                  onClick={() => toggleWarehouse(wh.warehouseId)}
                  className={`flex items-center gap-2.5 rounded-lg border-2 px-3 py-2.5 text-left text-sm font-semibold transition ${
                    active
                      ? 'border-brand-500 bg-brand-500/10 text-brand-400'
                      : 'border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${active ? 'bg-brand-500' : 'bg-slate-600'}`} />
                  {wh.warehouseName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setFilters({ bulkAvailableOnly: false, minMarginPercent: 0, warehouses: [] })}
        className="w-full rounded-lg border-2 border-slate-700 py-2.5 text-sm font-semibold text-slate-400 transition hover:border-brand-500 hover:text-brand-400"
      >
        Reset Filters
      </button>
    </div>
  );
}
