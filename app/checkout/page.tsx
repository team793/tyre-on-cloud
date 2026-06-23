import type { Metadata } from 'next';
import { Suspense } from 'react';
import { CheckoutPageClient } from '@/components/checkout/CheckoutPageClient';

export const metadata: Metadata = {
  title: 'Checkout | Tyre on Cloud',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutPageClient />
    </Suspense>
  );
}

function CheckoutSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
    </div>
  );
}
