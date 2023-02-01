import 'dotenv/config'

import { Prisma, PrismaClient } from '@prisma/client'
import Redis from 'ioredis'
import { createPrismaRedisCache } from 'prisma-redis-middleware'

if (!process.env['DATABASE_URL']) throw new Error('DATABASE_URL is required')
if (!process.env['REDIS_URL']) throw new Error('REDIS_URL is required')

declare let global: { prisma: PrismaClient }

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient

if (process.env['NODE_ENV'] === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

const redis = new Redis(process.env['REDIS_URL'])

const cacheMiddleware = createPrismaRedisCache({
  models: [
    { model: 'Token', cacheTime: 900 },
    { model: 'Incentive', cacheTime: 180 },
  ],
  storage: {
    type: 'redis',
    options: { client: redis, invalidation: { referencesTTL: 900 } },
  },
  cacheTime: 900,
  onHit: (key: string) => {
    console.log('Hit: ✅', key)
  },
  onMiss: (key: string) => {
    console.log('Miss: ❌', key)
  },
})

prisma.$use(cacheMiddleware)

export default prisma as PrismaClient

export * from '@prisma/client'

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
