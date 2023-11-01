// eslint-disable-next-line
import { type DecimalToString, Prisma, createClient } from '@sushiswap/database'
import { deepmergeInto } from 'deepmerge-ts'
import { isPromiseFulfilled } from 'sushi/validate'
import { getUnindexedPool } from '../getUnindexedPool'
import { PoolApiSchema, PoolCountApiSchema, PoolsApiSchema } from '../schemas'
import { SushiPoolSelect } from './select'

function parseWhere(
  args: typeof PoolsApiSchema._output | typeof PoolCountApiSchema._output,
) {
  const where: NonNullable<Prisma.SushiPoolWhereInput> = {}

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

  if ('protocols' in args && args.protocols !== undefined) {
    addFilter({ protocol: { in: args.protocols } })
  }

  if (
    'isIncentivized' in args &&
    args.isIncentivized !== undefined &&
    args.isIncentivized
  ) {
    addFilter({
      isIncentivized: args.isIncentivized,
    })
  }

  if (
    'isWhitelisted' in args &&
    args.isWhitelisted !== undefined &&
    args.isWhitelisted
  ) {
    addFilter({
      token0: {
        status: 'APPROVED',
      },
      token1: {
        status: 'APPROVED',
      },
    })
  }

  if (
    'isWhitelisted' in args &&
    args.isWhitelisted !== undefined &&
    !args.isWhitelisted
  ) {
    addFilter({
      OR: [
        {
          token0: {
            status: 'UNKNOWN',
          },
          token1: {
            status: 'UNKNOWN',
          },
        },

        {
          token0: {
            status: 'UNKNOWN',
          },
          token1: {
            status: 'APPROVED',
          },
        },
        {
          token0: {
            status: 'APPROVED',
          },
          token1: {
            status: 'UNKNOWN',
          },
        },
      ],
    })
  }

  if (
    'hasEnabledSteerVault' in args &&
    args.hasEnabledSteerVault !== undefined
  ) {
    addFilter({
      hasEnabledSteerVault: args.hasEnabledSteerVault,
    })
  }

  if ('tokenSymbols' in args && Array.isArray(args.tokenSymbols)) {
    if (args.tokenSymbols.length === 1) {
      addFilter({
        OR: [
          { token0: { symbol: { contains: args.tokenSymbols[0] as string } } },
          { token1: { symbol: { contains: args.tokenSymbols[0] as string } } },
        ],
      })
    } else {
      // Create every possible set of two
      const sets = args.tokenSymbols.flatMap((token0, i, arr) =>
        arr.slice(i + 1).map((token1) => [token0, token1] as const),
      )
      addFilter({
        AND: [
          {
            OR: sets.flatMap((set) => [
              {
                token0: { symbol: { contains: set[0] } },
                token1: { symbol: { contains: set[1] } },
              },
              {
                token0: { symbol: { contains: set[1] } },
                token1: { symbol: { contains: set[0] } },
              },
            ]),
          },
        ],
      })
    }
  }

  return where
}

export async function getEarnPool(args: typeof PoolApiSchema._output) {
  console.log('getEarnPool args', args)

  const id = `${args.chainId}:${args.address.toLowerCase()}`

  // Need to specify take, orderBy and orderDir to make TS happy
  let [pool]: Awaited<ReturnType<typeof getEarnPools>> = await getEarnPools({
    ids: [id],
    take: 1,
    orderBy: 'liquidityUSD',
    orderDir: 'desc',
  })

  console.log('getEarnPool pool', pool)

  if (!pool) {
    pool = (await getUnindexedPool(id)) as any
  }

  if (!pool) throw new Error('Pool not found.')

  return pool
}

export async function getEarnPools(args: typeof PoolsApiSchema._output) {
  const take = args.take
  const orderBy: Prisma.SushiPoolOrderByWithRelationInput = {
    [args.orderBy]: args.orderDir,
  }
  const where: Prisma.SushiPoolWhereInput = parseWhere(args)

  let skip = 0
  let cursor: { cursor: Prisma.SushiPoolWhereUniqueInput } | object = {}

  if (args.cursor) {
    skip = 1
    cursor = { cursor: { id: args.cursor } }
  }

  const client = await createClient()
  const pools = await client.sushiPool.findMany({
    take,
    skip,
    ...cursor,
    where,
    orderBy,
    select: SushiPoolSelect,
  })

  const poolsRetyped = pools as unknown as DecimalToString<typeof pools>

  if (args.ids && args.ids.length > poolsRetyped.length) {
    const fetchedPoolIds = poolsRetyped.map((pool) => pool.id)
    const unfetchedPoolIds = args.ids.filter(
      (id) => !fetchedPoolIds.includes(id),
    )

    const { getUnindexedPool } = await import('../getUnindexedPool')

    const unindexedPoolsResults = await Promise.allSettled(
      unfetchedPoolIds.map((id) => getUnindexedPool(id)),
    )
    const unindexedPools = unindexedPoolsResults.flatMap((res) =>
      isPromiseFulfilled(res) ? [res.value] : [],
    )

    poolsRetyped.push(...unindexedPools)
  }

  await client.$disconnect()
  return poolsRetyped
}

export async function getEarnPoolCount(
  args: typeof PoolCountApiSchema._output,
) {
  const where: Prisma.SushiPoolWhereInput = parseWhere(args)

  const client = await createClient()
  const count = await client.sushiPool.count({
    where,
  })

  await client.$disconnect()
  return { count }
}
