import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ShopPageClient } from '@/components/shop/ShopPageClient';

const title = 'Shop Tyres | Tyre on Cloud';
const description =
  'Browse premium tyres as a retail customer, or switch to the authorized dealer matrix for wholesale pricing, bulk inventory, and freight estimates.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/shop' },
  openGraph: { title, description, type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopPageSkeleton />}>
      <ShopPageClient />
    </Suspense>
  );
}

function ShopPageSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-red-600" />
    </div>
  );
}
