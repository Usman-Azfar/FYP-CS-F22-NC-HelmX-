import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
  pgPool?: Pool
}

const pgPool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  })

const adapter = new PrismaPg(pgPool)

const prismaClient = new PrismaClient({ adapter })

export const prisma =
  process.env.NODE_ENV === "production"
    ? globalForPrisma.prisma ?? prismaClient
    : prismaClient

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pgPool
}

if (process.env.NODE_ENV === "production") {
  globalForPrisma.prisma = prisma
}
