import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { defaultPrismaClientOptions } from './common'

export { type DecimalToString } from './common'
export * from '@prisma/client'

export async function createClient(options = defaultPrismaClientOptions) {
  await import('dotenv/config')
  if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')

  return new PrismaClient(options).$extends(withAccelerate())
}
