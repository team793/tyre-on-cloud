'use client';

import { useMemo } from 'react';
import { useShopStore } from '@/stores/shopStore';
import { useProducts } from '@/hooks/useProducts';
import { RetailFilterPanel } from './filters/RetailFilterPanel';
import { RetailProductCard } from './RetailProductCard';

export function RetailView() {
  const filters = useShopStore((s) => s.retailFilters);

  const { data, isLoading, isError } = useProducts();
  const allProducts = data?.products ?? [];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Skip price filter when product price is unset (฿0 means no price loaded yet)
      if (product.priceRetail > 0 && (product.priceRetail < filters.priceRange[0] || product.priceRetail > filters.priceRange[1])) return false;
      if (filters.seasons.length > 0 && !filters.seasons.includes(product.season)) return false;
      if (filters.wetGripRatings.length > 0 && !filters.wetGripRatings.includes(product.wetGripRating)) return false;
      if (filters.fuelEfficiencyRatings.length > 0 && !filters.fuelEfficiencyRatings.includes(product.fuelEfficiencyRating)) return false;
      if (product.noiseLevelDb > filters.maxNoiseLevel) return false;
      return true;
    });
  }, [allProducts, filters]);

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr]">
      <aside className="hidden md:block">
        <div className="sticky top-24 rounded-2xl border border-gray-200 bg-white p-5">
          <RetailFilterPanel />
        </div>
      </aside>

      <section>
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {isLoading ? 'Loading…' : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Tyre' : 'Tyres'} Available`}
          </h1>
          <p className="text-sm text-gray-500">Showing best matches for your filters</p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-2xl border-2 border-dashed border-red-200 py-20 text-center">
            <p className="text-red-600">Failed to load products. Please refresh.</p>
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <RetailProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 py-20 text-center">
            <p className="text-gray-600">No tyres match your current filters.</p>
          </div>
        )}
      </section>
    </div>
  );
}
