import { Prisma, PrismaClient } from '@prisma/client'

export * from '@prisma/client'

export async function createClient() {
  let client: PrismaClient

  if (process.env['NODE_ENV'] === 'production') {
    client = new PrismaClient()
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient()
    }
    client = global.prisma
  }

  await import('dotenv/config')
  const Redis = (await import('ioredis')).default
  const { createPrismaRedisCache } = await import('prisma-redis-middleware')

  if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')
  if (!process.env['REDIS_URL']) throw new Error('REDIS_URL is required')

  const redis = new Redis(process.env['REDIS_URL'])

  const cacheMiddleware = createPrismaRedisCache({
    models: [
      { model: 'Token', cacheTime: 900 },
      { model: 'Incentive', cacheTime: 180 },
      { model: 'Pool', cacheTime: 24 * 60 * 60 },
      { model: 'SushiPool', cacheTime: 900 },
    ],
    storage: {
      type: 'redis',
      options: { client: redis, invalidation: { referencesTTL: 24 * 60 * 60 } },
    },
    onHit: (key: string) => {
      console.log('Hit: ✅', key)
    },
    onMiss: (key: string) => {
      console.log('Miss: ❌', key)
    },
  })

  client.$use(cacheMiddleware as Prisma.Middleware)

  return client
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices
declare let global: { prisma: PrismaClient }

/** Deep-replaces the Prisma.Decimal type with string, which prisma actually returns.
 * 
  Will add 'string' for null-only types, don't think we should ever come across those though.
*/
export type DecimalToString<T> = {
  [P in keyof T]: T[P] extends Prisma.Decimal | null
    ? Exclude<T[P], Prisma.Decimal> | string
    : T[P] extends Array<unknown>
    ? Array<DecimalToString<T[P][0]>>
    : T[P] extends object
    ? DecimalToString<T[P]>
    : T[P]
}
