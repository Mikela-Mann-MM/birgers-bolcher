import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a mock client for build time
const createPrismaClient = () => {
  if (process.env.DATABASE_URL) {
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } else {
    // Mock client for build time
    console.warn('No DATABASE_URL found, using mock Prisma client for build')
    return {
      bolche: {
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      $queryRaw: async () => null,
      $disconnect: async () => {},
    } as any
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma