import prisma from '@sushiswap/database'

import type { PoolType } from '.'

export type PoolApiArgs = {
  chainIds: number[] | undefined
  poolType: PoolType | undefined
  isIncentivized: boolean | undefined
  isWhitelisted: boolean | undefined
  cursor: string | undefined
  orderBy: string
  orderDir: 'asc' | 'desc'
}

export async function getEarnPool(chainId: number, address: string): Promise<any> {
  const id = `${chainId}:${address.toLowerCase()}`
  const pool = await prisma.sushiPool.findFirstOrThrow({
    include: {
      token0: true,
      token1: true,
      incentives: true,
    },
    where: {
      id,
    },
  })

  await prisma.$disconnect()
  return pool
}

export async function getEarnPools(args: PoolApiArgs): Promise<any> {
  const orderBy = { [args.orderBy]: args.orderDir }

  let where = {}
  let skip = 0
  let cursor = {}

  if (args.chainIds) {
    where = {
      chainId: { in: args.chainIds },
    }
  }

  if (args.poolType) {
    where = {
      type: args.poolType,
      ...where,
    }
  }

  if (args.isIncentivized) {
    where = {
      isIncentivized: args.isIncentivized,
      ...where,
    }
  }

  if (args.cursor) {
    skip = 1
    cursor = {
      cursor: { id: args.cursor },
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
  size: number
) {
  const pools = await prisma.pool.findMany({
    where: {
      AND: {
        chainId,
        isWhitelisted: true,
        protocol,
        version,
        type: poolType,
      },
    },
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

export async function getPoolsByTokenIds(
  chainId: number,
  protocol: string,
  version: string,
  poolType: PoolType,
  token0: string,
  token1: string,
  size: number,
  excludeTopPoolsSize: number
): Promise<any> {
  const token0Id = chainId.toString().concat(':').concat(token0.toLowerCase())
  const token1Id = chainId.toString().concat(':').concat(token1.toLowerCase())
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
      where: {
        AND: {
          chainId,
          isWhitelisted: true,
          protocol,
          version,
          type: poolType,
        },
      },
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
  console.log(`Flattened pools, recieved: t0: ${token0Pools.length}, t1: ${token1Pools.length}`)

  const topPoolIds = result[2].map((p) => p.id)
  const filteredToken0Pools = token0Pools.filter((p) => !topPoolIds.includes(p.id))
  const filteredToken1Pools = token1Pools.filter((p) => !topPoolIds.includes(p.id))
  console.log(`After excluding top pools: t0: ${filteredToken0Pools.length}, t1: ${filteredToken1Pools.length}`)

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

  const pools = [...pools0, ...pools1].flat()

  await prisma.$disconnect()
  return pools ? pools : []
}
