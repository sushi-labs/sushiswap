import prisma from '@sushiswap/database'

import type { PoolType } from '.'

export type PoolApiArgs = {
  chainIds: number[] | undefined
  poolTypes: PoolType[] | undefined
  isIncentivized: boolean | undefined
  isWhitelisted: boolean | undefined
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

type PrismaArgs = NonNullable<Parameters<typeof prisma.sushiPool.findMany>['0']>

export async function getPools(args: PoolApiArgs) {
  const orderBy = { [args.orderBy]: args.orderDir }

  let where: PrismaArgs['where'] = {}
  let skip: PrismaArgs['skip'] = 0
  let cursor: PrismaArgs['cursor'] = {}

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

  if (args.cursor) {
    skip = 1
    cursor = { id: args.cursor }
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
    cursor,
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
          type: true,
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
