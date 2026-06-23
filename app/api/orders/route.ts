import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const INSTALLATION_FEE_PER_TYRE = 25;

interface OrderItemInput {
  productId: string;
  quantity: number;
  installation: boolean;
}

interface OrderRequestBody {
  items: OrderItemInput[];
  customer: {
    name: string;
    phone: string;
    email?: string;
    addressLine: string;
    city: string;
    postalCode: string;
    notes?: string;
  };
  paymentMethod: 'bank_transfer' | 'cod';
}

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TOC-${date}-${rand}`;
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as OrderRequestBody;

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }
  if (body.paymentMethod !== 'bank_transfer' && body.paymentMethod !== 'cod') {
    return NextResponse.json({ error: 'Invalid payment method' }, { status: 400 });
  }
  const c = body.customer;
  if (!c?.name?.trim() || !c?.phone?.trim() || !c?.addressLine?.trim() || !c?.city?.trim() || !c?.postalCode?.trim()) {
    return NextResponse.json({ error: 'Missing required customer details' }, { status: 400 });
  }

  // Prices are always recomputed from the real products table here — never
  // trust a price the client sends, only which products/quantities they want.
  const productIds = [...new Set(body.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap = new Map(products.map((p) => [p.id, p]));

  let subtotal = 0;
  let installationTotal = 0;
  const itemsToCreate = [];

  for (const item of body.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 400 });
    }
    const quantity = Math.max(1, Math.round(item.quantity) || 1);
    const unitPrice = Number(product.priceRetail);
    const lineSubtotal = unitPrice * quantity;
    subtotal += lineSubtotal;
    if (item.installation) installationTotal += INSTALLATION_FEE_PER_TYRE * quantity;

    itemsToCreate.push({
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      quantity,
      unitPrice,
      installation: !!item.installation,
      subtotal: lineSubtotal,
    });
  }

  const total = subtotal + installationTotal;

  // No login/account system on this site — every order is a guest order.
  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      customerName: c.name.trim(),
      customerPhone: c.phone.trim(),
      customerEmail: c.email?.trim() || null,
      addressLine: c.addressLine.trim(),
      city: c.city.trim(),
      postalCode: c.postalCode.trim(),
      notes: c.notes?.trim() || null,
      paymentMethod: body.paymentMethod,
      subtotal,
      installationTotal,
      total,
      items: { create: itemsToCreate },
    },
    include: { items: true },
  });

  return NextResponse.json({ order });
}
