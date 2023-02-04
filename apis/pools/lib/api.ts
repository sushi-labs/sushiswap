// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'

import { DecimalToString, prisma } from '@sushiswap/database'

import type { PoolApiSchema } from '../api/v0/[chainId]/[address].js'
import type { PoolCountApiSchema } from '../api/v0/count.js'
import type { PoolsApiSchema } from '../api/v0/index.js'
import type { ChefType, PoolType, PoolVersion, RewarderType } from './index.js'

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

export async function getPool(args: typeof PoolApiSchema._output) {
  const id = `${args.chainId}:${args.address.toLowerCase()}`

  // Need to specify take, orderBy and orderDir to make TS happy
  const [pool] = await getPools({ ids: [id], take: 1, orderBy: 'liquidityUSD', orderDir: 'desc' })

  if (!pool) throw new Error('Pool not found.')

  await prisma.$disconnect()
  return pool
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

  // TODO: Get rid of manual enums when the DB is migrated
  type Pool = DecimalToString<
    (typeof pools)[0] & {
      type: PoolType
      version: PoolVersion
      incentives: Array<
        (typeof pools)[0]['incentives'][0] & {
          chefType: ChefType
          rewarderType: RewarderType
        }
      >
    }
  >

  const poolsRetyped = pools as unknown as Pool[]

  if (args.ids && args.ids.length > poolsRetyped.length) {
    const fetchedPoolIds = poolsRetyped.map((pool) => pool.id)
    const unfetchedPoolIds = args.ids.filter((id) => !fetchedPoolIds.includes(id))

    const { getUnindexedPool } = await import('./getUnindexedPool.js')

    const unindexedPools = await Promise.all(unfetchedPoolIds.map((id) => getUnindexedPool(id)))
    poolsRetyped.push(...unindexedPools)
  }

  await prisma.$disconnect()
  return poolsRetyped ? poolsRetyped : []
}

export async function getPoolCount(args: typeof PoolCountApiSchema._output) {
  const where: PrismaArgs['where'] = parseWhere(args)

  const count = await prisma.sushiPool.count({
    where,
  })

  await prisma.$disconnect()
  return count ? count : null
}
