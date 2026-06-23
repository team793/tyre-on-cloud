import { NextRequest, NextResponse } from 'next/server';
import type { TyreType } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const width = params.get('width');
  const tyreProfile = params.get('profile');
  const rimSize = params.get('rimSize');
  const tyreType = params.get('tyreType');

  // No login/account system on this site — it's a catalog that drives
  // customers to LINE OA for the actual sale, so retail and dealer views
  // are both just display modes of the same public catalog.
  const products = await prisma.product.findMany({
    where: {
      ...(width && { width: Number(width) }),
      ...(tyreProfile && { profile: Number(tyreProfile) }),
      ...(rimSize && { rimSize: Number(rimSize) }),
      ...(tyreType && { tyreType: tyreType as TyreType }),
    },
    include: { pricingTiers: true, inventory: { include: { warehouse: true } } },
    orderBy: { rating: 'desc' },
  });

  return NextResponse.json({ products });
}
