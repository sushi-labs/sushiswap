import prisma from '@sushiswap/database'

import type { PoolType } from '.'

export type PoolApiArgs = {
  chainIds: number[] | undefined
  poolTypes: PoolType[] | undefined
  isIncentivized: boolean | undefined
  cursor: string | undefined
  orderBy: string
  orderDir: 'asc' | 'desc'
}

export async function getPool(chainId: number, address: string): Promise<any> {
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

export async function getPools(args: PoolApiArgs): Promise<any> {
  const orderBy = { [args.orderBy]: args.orderDir }

  let where = {}
  let skip = 0
  let cursor = {}

  if (args.chainIds) {
    where = {
      chainId: { in: args.chainIds.map((c) => c.toString()) },
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

  if (args.cursor) {
    skip = 1
    cursor = {
      cursor: { id: args.cursor },
    }
  }

  console.log({ where })
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
      apr: true,
      totalApr: true,
      isIncentivized: true,
      volume1d: true,
      fees1d: true,
      volume1w: true,
      fees1w: true,
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
          chainId: true,
          type: true,
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
