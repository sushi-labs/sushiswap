// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'

import prisma from '@sushiswap/database'

import type { PoolType } from '.'

type PartialWithUndefined<T extends object> = Partial<{
  [K in keyof T]: T[K] | undefined
}>

export type PoolApiArgs = PartialWithUndefined<{
  chainIds: number[]
  poolTypes: PoolType[]
  isIncentivized: boolean
  isWhitelisted: boolean
  cursor: string
  orderBy: string
  orderDir: 'asc' | 'desc'
  count: boolean
}>

export async function getEarnPool(chainId: number, address: string) {
  const id = `${chainId}:${address.toLowerCase()}`
  const pool = await prisma.sushiPool.findFirstOrThrow({
    include: {
      token0: true,
      token1: true,
      incentives: {
        select: {
          id: true,
          pid: true,
          chainId: true,
          chefType: true,
          apr: true,
          rewarderAddress: true,
          rewarderType: true,
          rewardPerDay: true,
          rewardToken: {
            select: {
              id: true,
              address: true,
              name: true,
              symbol: true,
              decimals: true,
            },
          },
        },
      },
    },
    where: {
      id,
    },
  })

  await prisma.$disconnect()
  return pool
}

type EarnArgs = NonNullable<Parameters<typeof prisma.sushiPool.findMany>['0']>
type AggregatorArgs = NonNullable<Parameters<typeof prisma.pool.findMany>['0']>

function parseWhere(args: PoolApiArgs) {
  let where: EarnArgs['where'] = {}

  if (args.chainIds) {
    where = {
      chainId: { in: args.chainIds },
    }
  }

  if (args.poolTypes) {
    where = {
      type: { in: args.poolTypes },
      ...where,
    }
  }

  if (args.isIncentivized) {
    where = {
      isIncentivized: args.isIncentivized,
      ...where,
    }
  }

  if (args.isWhitelisted) {
    where = {
      token0: {
        status: 'APPROVED',
      },
      token1: {
        status: 'APPROVED',
      },
      ...where,
    }
  }

  return where
}

export async function getEarnPools(args: PoolApiArgs) {
  const orderBy: EarnArgs['orderBy'] = args.orderBy ? { [args.orderBy]: args.orderDir } : { ['liquidityUSD']: 'desc' }
  const where: EarnArgs['where'] = parseWhere(args)

  let skip: EarnArgs['skip'] = 0
  let cursor: { cursor: EarnArgs['cursor'] } | object = {}

  if (args.cursor) {
    skip = 1
    cursor = { cursor: { id: args.cursor } }
  }

  const pools = await prisma.sushiPool.findMany({
    take: 20,
    skip,
    ...cursor,
    where,
    orderBy,
    select: {
      id: true,
      address: true,
      name: true,
      chainId: true,
      version: true,
      type: true,
      swapFee: true,
      twapEnabled: true,
      liquidityUSD: true,
      volumeUSD: true,
      feeApr: true,
      incentiveApr: true,
      totalApr: true,
      isIncentivized: true,
      fees1d: true,
      fees1w: true,
      volume1d: true,
      volume1w: true,
      isBlacklisted: true,
      token0: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      token1: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      incentives: {
        select: {
          id: true,
          pid: true,
          chainId: true,
          chefType: true,
          apr: true,
          rewarderAddress: true,
          rewarderType: true,
          rewardPerDay: true,
          rewardToken: {
            select: {
              id: true,
              address: true,
              name: true,
              symbol: true,
              decimals: true,
            },
          },
        },
      },
    },
  })

  await prisma.$disconnect()
  return pools ? pools : []
}

export async function getAggregatorTopPools(
  chainId: number,
  protocol: string,
  version: string,
  poolType: PoolType,
  size: number,
  minLiquidity?: number
) {
  let where: AggregatorArgs['where'] = {
    chainId,
    isWhitelisted: true,
    protocol,
    version,
    type: poolType,
  }
  if (minLiquidity) {
    where = {
      liquidityUSD: {
        gte: minLiquidity,
      },
      ...where,
    }
  }
  const pools = await prisma.pool.findMany({
    where,
    take: size,
    orderBy: {
      liquidityUSD: 'desc',
    },
    select: {
      address: true,
      token0: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
      token1: {
        select: {
          id: true,
          address: true,
          name: true,
          symbol: true,
          decimals: true,
        },
      },
    },
  })

  await prisma.$disconnect()
  return pools ? pools : []
}

export async function getEarnPoolCount(args: PoolApiArgs) {
  const where: EarnArgs['where'] = parseWhere(args)

  const count = await prisma.sushiPool.count({
    where,
  })

  await prisma.$disconnect()
  return count ? count : null
}

export async function getAggregatorPoolsByTokenIds(
  chainId: number,
  protocol: string,
  version: string,
  poolType: PoolType,
  token0: string,
  token1: string,
  size: number,
  excludeTopPoolsSize: number,
  topPoolMinLiquidity?: number,
) {
  const token0Id = chainId.toString().concat(':').concat(token0.toLowerCase())
  const token1Id = chainId.toString().concat(':').concat(token1.toLowerCase())

  let topPoolWhere: AggregatorArgs['where'] = {
    chainId,
    isWhitelisted: true,
    protocol,
    version,
    type: poolType,
  }
  if (topPoolMinLiquidity) {
    topPoolWhere = {
      liquidityUSD: {
        gte: topPoolMinLiquidity,
      },
      ...topPoolWhere,
    }
  }

  const select = {
    id: true,
    address: true,
    liquidityUSD: true,
    token0: {
      select: {
        id: true,
        address: true,
        name: true,
        symbol: true,
        decimals: true,
      },
    },
    token1: {
      select: {
        id: true,
        address: true,
        name: true,
        symbol: true,
        decimals: true,
      },
    },
  }
  const result = await Promise.all([
    prisma.token.findFirstOrThrow({
      include: {
        pools0: {
          where: {
            chainId,
            protocol,
            version,
            type: poolType,
            OR: [
              {
                token0Id: token0Id,
                token1: {
                  status: 'APPROVED',
                },
              },
              {
                token1Id: token0Id,
                token0: {
                  status: 'APPROVED',
                },
              },
            ],
          },
          select,
        },
        pools1: {
          where: {
            chainId,
            protocol,
            version,
            type: poolType,
            OR: [
              {
                token0Id: token0Id,
                token1: {
                  status: 'APPROVED',
                },
              },
              {
                token1Id: token0Id,
                token0: {
                  status: 'APPROVED',
                },
              },
            ],
          },
          select,
        },
      },
      where: {
        id: token0Id,
      },
    }),

    prisma.token.findFirstOrThrow({
      include: {
        pools0: {
          where: {
            chainId,
            protocol,
            version,
            type: poolType,
            OR: [
              {
                token0Id: token1Id,
                token1: {
                  status: 'APPROVED',
                },
              },
              {
                token1Id: token1Id,
                token0: {
                  status: 'APPROVED',
                },
              },
            ],
          },
          select,
        },
        pools1: {
          where: {
            chainId,
            protocol,
            version,
            type: poolType,
            OR: [
              {
                token0Id: token1Id,
                token1: {
                  status: 'APPROVED',
                },
              },
              {
                token1Id: token1Id,
                token0: {
                  status: 'APPROVED',
                },
              },
            ],
          },
          select,
        },
      },
      where: {
        id: token1Id,
      },
    }),
    prisma.pool.findMany({
      where: topPoolWhere,
      take: excludeTopPoolsSize,
      orderBy: {
        liquidityUSD: 'desc',
      },
      select: {
        id: true,
      },
    }),
  ])

  await prisma.$disconnect()

  let token0PoolSize = 0
  let token1PoolSize = 0
  const token0Pools = [result[0].pools0, result[0].pools1].flat()
  const token1Pools = [result[1].pools0, result[1].pools1].flat()
  // console.log(`Flattened pools, recieved: t0: ${token0Pools.length}, t1: ${token1Pools.length}`)

  const topPoolIds = result[2].map((p) => p.id)
  const filteredToken0Pools = token0Pools.filter((p) => !topPoolIds.includes(p.id))
  const filteredToken1Pools = token1Pools.filter((p) => !topPoolIds.includes(p.id))
  // console.log(`After excluding top pools: t0: ${filteredToken0Pools.length}, t1: ${filteredToken1Pools.length}`)

  if (filteredToken0Pools.length >= size / 2 && filteredToken1Pools.length >= size / 2) {
    token0PoolSize = size / 2
    token1PoolSize = size / 2
  } else if (filteredToken0Pools.length >= size / 2 && filteredToken1Pools.length < size / 2) {
    token1PoolSize = filteredToken1Pools.length
    token0PoolSize = size - filteredToken1Pools.length
  } else if (filteredToken1Pools.length >= size / 2 && filteredToken0Pools.length < size / 2) {
    token0PoolSize = filteredToken0Pools.length
    token1PoolSize = size - filteredToken0Pools.length
  } else {
    token0PoolSize = filteredToken0Pools.length
    token1PoolSize = filteredToken1Pools.length
  }

  const pools0 = filteredToken0Pools
    .sort((a, b) => Number(b.liquidityUSD) - Number(a.liquidityUSD))
    .slice(0, token0PoolSize)
  const pools1 = filteredToken1Pools
    .sort((a, b) => Number(b.liquidityUSD) - Number(a.liquidityUSD))
    .slice(0, token1PoolSize)
  // console.log(`${chainId}~${protocol}: t0: ${pools0.length}, t1: ${pools1.length}`)

  const pools = [...pools0, ...pools1].flat()

  await prisma.$disconnect()
  return pools ? pools : []
}
