import { Prisma, PrismaClient } from '@prisma/client'
export * from '@prisma/client'

// const { Prisma, PrismaClient } =   await import('@prisma/client/edge')
// const { Prisma, PrismaClient } =   await import('@prisma/client')

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices
declare let global: { prisma: Map<string, PrismaClient> }

const defaultPrismaClientOptions = {
  datasources: {
    db: {
      url: process.env['DATABASE_URL'] as string,
    },
  },
  // log: ['query'],
} satisfies Prisma.PrismaClientOptions

// const cache = new Map<string, PrismaClient>()

export async function createClient(options = defaultPrismaClientOptions) {
  await import('dotenv/config')
  if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')

  // const _cache =
  //   process.env['NODE_ENV'] === 'production' ? cache : !global.prisma ? (global.prisma = new Map()) : global.prisma

  // const key = JSON.stringify(options)
  // if (!_cache.has(key)) {
  //   _cache.set(key, new PrismaClient(options))
  // }
  // const client = _cache.get(key) as PrismaClient

  // if (process.env['REDIS_URL']) {
  //   const Redis = (await import('ioredis')).default
  //   const { createPrismaRedisCache } = await import('prisma-redis-middleware')
  //   const redis = new Redis(process.env['REDIS_URL'])
  //   const cacheMiddleware = createPrismaRedisCache({
  //     models: [
  //       { model: 'Token', cacheTime: 900 },
  //       { model: 'Incentive', cacheTime: 180 },
  //       { model: 'Pool', cacheTime: 24 * 60 * 60 },
  //       { model: 'SushiPool', cacheTime: 900 },
  //     ],
  //     storage: {
  //       type: 'redis',
  //       options: { client: redis, invalidation: { referencesTTL: 24 * 60 * 60 } },
  //     } as any, // Issue open on github,
  //     onHit: (key: string) => {
  //       console.log('Hit: ✅', key)
  //     },
  //     onMiss: (key: string) => {
  //       console.log('Miss: ❌', key)
  //     },
  //   })
  //   client.$use(cacheMiddleware as Prisma.Middleware)
  // }

  return new PrismaClient(options)
}

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
