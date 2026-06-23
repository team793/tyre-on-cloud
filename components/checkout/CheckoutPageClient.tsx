'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ShoppingBag, Banknote, Truck, CheckCircle2 } from 'lucide-react';
import { useShopStore } from '@/stores/shopStore';
import { useRetailCart } from '@/hooks/useRetailCart';
import { Logo } from '@/components/shared/Logo';

type PaymentMethod = 'bank_transfer' | 'cod';

interface ConfirmedOrder {
  orderNumber: string;
  total: number;
  paymentMethod: PaymentMethod;
}

export function CheckoutPageClient() {
  const { lineItems, subtotal, installationTotal, total, isLoading } = useRetailCart();
  const clearRetailCart = useShopStore((s) => s.clearRetailCart);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    postalCode: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  const updateField = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: lineItems.map((li) => ({
            productId: li.product.id,
            quantity: li.quantity,
            installation: li.installation,
          })),
          customer: form,
          paymentMethod,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to place order');

      setConfirmedOrder({
        orderNumber: json.order.orderNumber,
        total: Number(json.order.total),
        paymentMethod: json.order.paymentMethod,
      });
      clearRetailCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return <OrderConfirmation order={confirmedOrder} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-4 sm:px-10">
        <Link href="/" aria-label="Tyre on Cloud">
          <Logo size="md" theme="light" />
        </Link>
        <Link href="/shop?mode=customer" className="text-sm text-gray-500 transition hover:text-gray-800">
          ← Back to shop
        </Link>
      </div>

      {!isLoading && lineItems.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5 py-20 text-center">
          <ShoppingBag size={32} className="text-gray-300" />
          <p className="text-gray-600">Your cart is empty.</p>
          <Link href="/shop?mode=customer" className="text-sm font-semibold text-red-600 hover:underline">
            Browse tyres →
          </Link>
        </div>
      ) : (
        <div className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-1 gap-8 px-5 py-10 sm:px-10 lg:grid-cols-[1fr_360px]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="mb-4 text-lg font-bold text-gray-900">Delivery Details</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Full name"
                  value={form.name}
                  onChange={updateField('name')}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:col-span-2"
                />
                <input
                  required
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={updateField('phone')}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={form.email}
                  onChange={updateField('email')}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <input
                  required
                  placeholder="Address"
                  value={form.addressLine}
                  onChange={updateField('addressLine')}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:col-span-2"
                />
                <input
                  required
                  placeholder="City / Province"
                  value={form.city}
                  onChange={updateField('city')}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <input
                  required
                  placeholder="Postal code"
                  value={form.postalCode}
                  onChange={updateField('postalCode')}
                  className="h-11 rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <textarea
                  placeholder="Delivery notes (optional)"
                  value={form.notes}
                  onChange={updateField('notes')}
                  rows={2}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 sm:col-span-2"
                />
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-lg font-bold text-gray-900">Payment Method</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                    paymentMethod === 'bank_transfer' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Banknote size={20} className={paymentMethod === 'bank_transfer' ? 'text-red-600' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Bank Transfer</p>
                    <p className="text-xs text-gray-500">We'll send details via LINE</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition ${
                    paymentMethod === 'cod' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Truck size={20} className={paymentMethod === 'cod' ? 'text-red-600' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when it arrives</p>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <button
              type="submit"
              disabled={submitting || lineItems.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-3.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : `Place Order · ฿${total.toLocaleString()}`}
            </button>
          </form>

          <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-gray-500">Order Summary</h3>
            <div className="space-y-3">
              {lineItems.map((li) => (
                <div key={li.product.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {li.product.name} <span className="text-gray-400">×{li.quantity}</span>
                  </span>
                  <span className="shrink-0 font-medium text-gray-900">
                    ฿{(li.product.priceRetail * li.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>฿{subtotal.toLocaleString()}</span>
              </div>
              {installationTotal > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Installation</span>
                  <span>฿{installationTotal.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between pt-1 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function OrderConfirmation({ order }: { order: ConfirmedOrder }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-5 py-12 text-center">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8">
        <CheckCircle2 size={40} className="mx-auto mb-4 text-emerald-500" />
        <h1 className="mb-1 text-xl font-bold text-gray-900">Order placed!</h1>
        <p className="mb-6 text-sm text-gray-500">
          Order <span className="font-mono font-semibold text-gray-800">{order.orderNumber}</span> · ฿{order.total.toLocaleString()}
        </p>

        {order.paymentMethod === 'bank_transfer' ? (
          <p className="mb-6 text-sm text-gray-600">
            We'll send you our bank account details via LINE shortly — please mention your order number when you message us.
          </p>
        ) : (
          <p className="mb-6 text-sm text-gray-600">
            Pay in cash when your order arrives. We'll contact you to confirm delivery details.
          </p>
        )}

        <div className="flex flex-col gap-2.5">
          <a
            href="https://line.me/ti/p/@tirehub"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full bg-line-green py-3 text-sm font-semibold text-white transition hover:bg-line-green-dark"
          >
            Message us on LINE
          </a>
          <Link
            href="/shop?mode=customer"
            className="flex items-center justify-center rounded-full border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
