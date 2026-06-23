'use client';

import Link from 'next/link';
import { Drawer } from 'vaul';
import { Minus, Plus, Trash2, Wrench, ShoppingBag } from 'lucide-react';
import { useShopStore } from '@/stores/shopStore';
import { useRetailCart } from '@/hooks/useRetailCart';
import { TyreThumbnail } from '@/components/shared/TyreThumbnail';

export function RetailCartDrawer() {
  const open = useShopStore((s) => s.cartDrawerOpen);
  const setOpen = useShopStore((s) => s.setCartDrawerOpen);
  const setRetailCartQty = useShopStore((s) => s.setRetailCartQty);
  const removeFromRetailCart = useShopStore((s) => s.removeFromRetailCart);

  const { lineItems, subtotal, installationTotal, total, itemCount } = useRetailCart();

  return (
    <Drawer.Root open={open} onOpenChange={setOpen} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/50" />
        <Drawer.Content className="fixed bottom-0 right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-900">Your Cart ({itemCount})</h3>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {lineItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                <ShoppingBag size={32} className="text-gray-300" />
                <p className="text-sm text-gray-500">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lineItems.map((li) => (
                  <div key={li.product.id} className="flex gap-3 border-b border-gray-100 pb-4">
                    <TyreThumbnail
                      imageUrl={li.product.imageUrl}
                      brand={li.product.brand}
                      alt={li.product.name}
                      className="h-16 w-16 shrink-0 rounded-lg bg-gray-50"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">{li.product.name}</p>
                      <p className="text-xs text-gray-500">
                        {li.product.width}/{li.product.profile} R{li.product.rimSize}
                      </p>
                      {li.installation && (
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                          <Wrench size={11} /> + Installation
                        </p>
                      )}

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setRetailCartQty(li.product.id, li.quantity - 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-gray-900">{li.quantity}</span>
                          <button
                            onClick={() => setRetailCartQty(li.product.id, li.quantity + 1)}
                            className="flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:border-gray-300"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          ฿{(li.product.priceRetail * li.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromRetailCart(li.product.id)}
                      className="self-start text-gray-300 hover:text-red-500"
                      aria-label="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {lineItems.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-4">
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              {installationTotal > 0 && (
                <div className="mb-1 flex justify-between text-sm text-gray-600">
                  <span>Installation</span>
                  <span>฿{installationTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="mb-4 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
              <Link
                href="/checkout"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center rounded-lg bg-red-600 py-3 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
