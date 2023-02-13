// eslint-disable-next-line
import type * as _ from '@prisma/client/runtime'

import { client, DecimalToString } from '@sushiswap/database'
import { isPromiseFulfilled } from '@sushiswap/validate'
import { deepmergeInto } from 'deepmerge-ts'
import type { PoolApiSchema, PoolCountApiSchema, PoolsApiSchema } from './schemas/index.js'

type PrismaArgs = NonNullable<Parameters<typeof client.sushiPool.findMany>['0']>

function parseWhere(args: typeof PoolsApiSchema._output | typeof PoolCountApiSchema._output) {
  let where: NonNullable<PrismaArgs['where']> = {}

  const addFilter = (filter: typeof where) => deepmergeInto(where, filter)

  if ('ids' in args && args.ids !== undefined) {
    addFilter({
      id: {
        in: args.ids,
      },
    })
  }

  if ('chainIds' in args && args.chainIds !== undefined) {
    addFilter({
      chainId: { in: args.chainIds },
    })
  }

  if ('poolTypes' in args && args.poolTypes !== undefined) {
    addFilter({
      type: { in: args.poolTypes },
    })
  }

  if ('poolVersions' in args && args.poolVersions !== undefined) {
    addFilter({
      version: { in: args.poolVersions },
    })
  }

  if ('isIncentivized' in args && args.isIncentivized !== undefined) {
    addFilter({
      isIncentivized: args.isIncentivized,
    })
  }

  if ('isWhitelisted' in args && args.isWhitelisted !== undefined) {
    addFilter({
      token0: {
        status: 'APPROVED',
      },
      token1: {
        status: 'APPROVED',
      },
    })
  }

  if ('tokenSymbols' in args && args.tokenSymbols !== undefined) {
    if (args.tokenSymbols.length === 1) {
      addFilter({
        OR: [
          { token0: { symbol: { contains: args.tokenSymbols[0]! } } },
          { token1: { symbol: { contains: args.tokenSymbols[0]! } } },
        ],
      })
    } else {
      // Create every possible set of two
      const sets = args.tokenSymbols.flatMap((token0, i, arr) =>
        arr.slice(i + 1).map((token1) => [token0, token1] as const)
      )
      addFilter({
        OR: sets.flatMap((set) => [
          { token0: { symbol: { contains: set[0] } }, token1: { symbol: { contains: set[1] } } },
          { token0: { symbol: { contains: set[1] } }, token1: { symbol: { contains: set[0] } } },
        ]),
      })
    }
  }

  return where
}

export async function getPool(args: typeof PoolApiSchema._output) {
  const id = `${args.chainId}:${args.address.toLowerCase()}`

  // Need to specify take, orderBy and orderDir to make TS happy
  const [pool] = await getPools({ ids: [id], take: 1, orderBy: 'liquidityUSD', orderDir: 'desc' })

  if (!pool) throw new Error('Pool not found.')

  await client.$disconnect()
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

  const pools = await client.sushiPool.findMany({
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

  const poolsRetyped = pools as unknown as DecimalToString<typeof pools>

  if (args.ids && args.ids.length > poolsRetyped.length) {
    const fetchedPoolIds = poolsRetyped.map((pool) => pool.id)
    const unfetchedPoolIds = args.ids.filter((id) => !fetchedPoolIds.includes(id))

    const { getUnindexedPool } = await import('./getUnindexedPool.js')

    const unindexedPoolsResults = await Promise.allSettled(unfetchedPoolIds.map((id) => getUnindexedPool(id)))
    const unindexedPools = unindexedPoolsResults.flatMap((res) => (isPromiseFulfilled(res) ? [res.value] : []))

    poolsRetyped.push(...unindexedPools)
  }

  await client.$disconnect()
  return poolsRetyped
}

export async function getPoolCount(args: typeof PoolCountApiSchema._output) {
  const where: PrismaArgs['where'] = parseWhere(args)

  const count = await client.sushiPool.count({
    where,
  })

  await client.$disconnect()
  return { count }
}
