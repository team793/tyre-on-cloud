import { NextRequest, NextResponse } from 'next/server';
import type { TyreType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const width = params.get('width');
  const tyreProfile = params.get('profile');
  const rimSize = params.get('rimSize');
  const tyreType = params.get('tyreType');

  // Dealers get wholesale fields (volume pricing tiers, per-warehouse
  // stock); everyone else gets the retail-safe shape — mirrors
  // products_public in the SQL migration. This is defense-in-depth on top
  // of RLS, not a replacement for it: see ARCHITECTURE.md → "RLS + Prisma".
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();

  let isDealer = false;
  if (userData.user) {
    const dealerProfile = await prisma.profile.findUnique({
      where: { id: userData.user.id },
      select: { role: true },
    });
    isDealer = dealerProfile?.role === 'dealer';
  }

  const products = await prisma.product.findMany({
    where: {
      ...(width && { width: Number(width) }),
      ...(tyreProfile && { profile: Number(tyreProfile) }),
      ...(rimSize && { rimSize: Number(rimSize) }),
      ...(tyreType && { tyreType: tyreType as TyreType }),
    },
    include: isDealer
      ? { pricingTiers: true, inventory: { include: { warehouse: true } } }
      : undefined,
    orderBy: { rating: 'desc' },
  });

  const shaped = isDealer
    ? products
    : products.map(({ priceDealer, ...rest }) => rest);

  return NextResponse.json({ products: shaped, isDealer });
}
