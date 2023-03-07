import { Prisma, PrismaClient } from '@prisma/client'
export * from '@prisma/client'

const cache = new Map<string, PrismaClient>()

export async function createClient(
  options: Prisma.PrismaClientOptions = {
    datasources: {
      db: {
        url: process.env['DATABASE_URL'] as string,
      },
    },
    log: ['query'],
  }
) {
  const cacheKey = JSON.stringify(options)
  if (!cache.has(cacheKey)) {
    if (process.env['NODE_ENV'] === 'production') {
      const client = new PrismaClient(options)
      cache.set(cacheKey, client)
    } else {
      if (!global.prisma) {
        global.prisma = new PrismaClient(options)
      }
      const client = global.prisma
      cache.set(cacheKey, client)
    }
  }

  const client = cache.get(cacheKey) as PrismaClient

  await import('dotenv/config')
  const Redis = (await import('ioredis')).default
  const { createPrismaRedisCache } = await import('prisma-redis-middleware')

  if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')

  if (process.env['REDIS_URL']) {
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
      } as any, // Issue open on github,
      onHit: (key: string) => {
        console.log('Hit: ✅', key)
      },
      onMiss: (key: string) => {
        console.log('Miss: ❌', key)
      },
    })
    client.$use(cacheMiddleware as Prisma.Middleware)
  }

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
