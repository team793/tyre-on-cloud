import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Next.js dev hot-reload re-evaluates this module on every edit. Without
// caching the instance on `globalThis`, each reload would open a fresh
// PrismaClient (and a fresh pool of DB connections) on top of the last one.
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
