import { useMemo } from 'react';
import { useShopStore } from '@/stores/shopStore';
import { useProducts } from '@/hooks/useProducts';
import type { TyreProduct } from '@/types/shop';

const INSTALLATION_FEE_PER_TYRE = 25;

export interface RetailCartLine {
  product: TyreProduct;
  quantity: number;
  installation: boolean;
}

/** Joins the cart's {productId -> qty} store state with full product data, and totals it up. */
export function useRetailCart() {
  const retailCart = useShopStore((s) => s.retailCart);
  const { data, isLoading } = useProducts();
  const allProducts = data?.products ?? [];

  const lineItems = useMemo<RetailCartLine[]>(() => {
    return Object.entries(retailCart)
      .map(([productId, item]) => {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) return null;
        return { product, ...item };
      })
      .filter((x): x is RetailCartLine => x !== null);
  }, [retailCart, allProducts]);

  const subtotal = lineItems.reduce((sum, li) => sum + li.product.priceRetail * li.quantity, 0);
  const installationTotal = lineItems.reduce(
    (sum, li) => sum + (li.installation ? INSTALLATION_FEE_PER_TYRE * li.quantity : 0),
    0
  );
  const total = subtotal + installationTotal;
  const itemCount = lineItems.reduce((sum, li) => sum + li.quantity, 0);

  return { lineItems, subtotal, installationTotal, total, itemCount, isLoading };
}
