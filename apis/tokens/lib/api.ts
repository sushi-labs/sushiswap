import { createPrismaRedisCache } from 'prisma-redis-middleware'

import prisma from './prisma'
import redis from './redis'

const cacheMiddleware = createPrismaRedisCache({
  models: [{ model: 'Token', cacheTime: 900 }],
  storage: { type: 'redis', options: { client: redis, invalidation: { referencesTTL: 900 } } },
  cacheTime: 900,
  onHit: (key: string) => {
    console.log('Hit: ✅', key)
  },
  onMiss: (key: string) => {
    console.log('Miss: ❌', key)
  },
})

prisma.$use(cacheMiddleware)

export async function getTokens() {
  const tokens = await prisma.token.findMany({
    select: {
      id: true,
      address: true,
      chainId: true,
      name: true,
      symbol: true,
      decimals: true,
    },
    where: {
      AND: {
        chainId: '1',
        status: 'APPROVED',
      },
    },
  })
  await prisma.$disconnect()
  return tokens ? tokens : []
}
