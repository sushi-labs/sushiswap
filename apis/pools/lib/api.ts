// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'

import prisma, { DecimalToString } from '@sushiswap/database'

import type { PoolsApiSchema } from '../api/v0/'
import type { PoolCountApiSchema } from '../api/v0/count'
import type { PoolApiSchema } from '../api/v0/[chainId]/[address]'

export async function getPool(args: (typeof PoolApiSchema)['_output']) {
  const id = `${args.chainId}:${args.address.toLowerCase()}`
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
  return pool as unknown as DecimalToString<typeof pool>
}

type PrismaArgs = NonNullable<Parameters<typeof prisma.sushiPool.findMany>['0']>

function parseWhere(args: typeof PoolsApiSchema._output | typeof PoolCountApiSchema._output) {
  let where: PrismaArgs['where'] = {}

  if ('ids' in args && args.ids !== undefined) {
    where = {
      id: {
        in: args.ids,
      },
    }
  }

  if ('chainIds' in args && args.chainIds !== undefined) {
    where = {
      chainId: { in: args.chainIds },
    }
  }

  if ('poolTypes' in args && args.poolTypes !== undefined) {
    where = {
      type: { in: args.poolTypes },
      ...where,
    }
  }

  if ('isIncentivized' in args && args.isIncentivized !== undefined) {
    where = {
      isIncentivized: args.isIncentivized,
      ...where,
    }
  }

  if ('isWhitelisted' in args && args.isWhitelisted !== undefined) {
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

export async function getPools(args: typeof PoolsApiSchema._output) {
  const take = args.take
  const orderBy: PrismaArgs['orderBy'] = { [args.orderBy]: args.orderDir }
  const where: PrismaArgs['where'] = parseWhere(args)

  let skip: PrismaArgs['skip'] = 0
  let cursor: { cursor: PrismaArgs['cursor'] } | object = {}

  if (args.cursor) {
    skip = 1
    cursor = { cursor: { id: args.cursor } }
  }

  const pools = await prisma.sushiPool.findMany({
    take,
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
      totalSupply: true,
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
  return pools ? (pools as unknown as DecimalToString<typeof pools>) : []
}

export async function getPoolCount(args: typeof PoolCountApiSchema._output) {
  const where: PrismaArgs['where'] = parseWhere(args)

  const count = await prisma.sushiPool.count({
    where,
  })

  await prisma.$disconnect()
  return count ? count : null
}
