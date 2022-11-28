import { Prisma, Token } from '@prisma/client'
import type { VercelResponse } from '@vercel/node'
import { createPrismaRedisCache } from 'prisma-redis-middleware'
import prisma from './prisma'
import redis from './redis'

const cacheMiddleware = createPrismaRedisCache({
  models: [{ model: 'Pool', cacheTime: 900 }],
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

export async function getPools(chainId: string, tokenAddress: string, protocols: string[]) {
  const tokenWithPools = await prisma.token.findFirst({
    where: {
      address: tokenAddress,
      chainId: chainId.toString(),
    },
    include: {
      pools0: {
        select: {
          address: true,
          protocol: true,
          type: true,
          version: true,
          token0: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
          token1: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
        },
        where: {
          liquidityUSD: { gt: 100 },
          protocol: { in: protocols },
        },
      },
      pools1: {
        select: {
          address: true,
          protocol: true,
          type: true,
          version: true,
          token0: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
          token1: {
            select: {
              address: true,
              symbol: true,
              name: true,
              decimals: true,
            },
          },
        },
        where: {
          liquidityUSD: { gt: 100 },
          protocol: { in: protocols },
        },
      },
    },
  })

  if (!tokenWithPools) {
    await prisma.$disconnect()
    return []
  }
  if (tokenWithPools.pools0.length === 0 && tokenWithPools.pools1.length === 0) {
    await prisma.$disconnect()
    return []
  }

  const pools = Array.from(
    new Set(
      [
        tokenWithPools.pools0.map((pool) => ({
          address: pool.address,
          protocol: pool.protocol,
          type: pool.type,
          version: pool.version,
          token: pool.token0.address.toLowerCase() === tokenAddress.toString() ? pool.token1 : pool.token0,
        })),
        ,
        tokenWithPools.pools1.map((pool) => ({
          address: pool.address,
          protocol: pool.protocol,
          type: pool.type,
          version: pool.version,
          token: pool.token0.address.toLowerCase() === tokenAddress.toString() ? pool.token1 : pool.token0,
        })),
        ,
      ].flat()
    )
  )
  const result = {
    token: {
      address: tokenWithPools.address,
      symbol: tokenWithPools.symbol,
      name: tokenWithPools.name,
      decimals: tokenWithPools.decimals,
      pools,
    },
  }
  await prisma.$disconnect()
  return result
}

export async function getBase(
  chainId: string,
  excludeTokens: string[],
  protocols: string[],
  size: number = 500
) {
  const pools = await prisma.pool.findMany({
    take: size,
    where: {
      chainId: chainId.toString(),
      protocol: { in: protocols },
      AND: {
        token0Id: {
          notIn: excludeTokens,
        },
        token1Id: {
          notIn: excludeTokens,
        },
      },
    },
    select: {
      address: true,
      protocol: true,
      type: true,
      version: true,
    },
    // include: {
    //   token0: true,
    //   token1: true,
    // },
    orderBy: {
      liquidityUSD: 'desc',
    },
  })

  if (!pools) {
    await prisma.$disconnect()
    return []
  }
  await prisma.$disconnect()
  return pools
}
