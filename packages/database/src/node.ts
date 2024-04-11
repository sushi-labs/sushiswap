import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { defaultPrismaClientOptions } from './common.js'

export { type DecimalToString } from './common.js'
export * from '@prisma/client'

export async function createDirectClient(options = defaultPrismaClientOptions) {
  await import('dotenv/config')
  if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')

  return new PrismaClient(options)
}

export async function createClient(options = defaultPrismaClientOptions) {
  await import('dotenv/config')
  if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')

  return new PrismaClient(options).$extends(withAccelerate())
}
