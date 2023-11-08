import { type Prisma } from '@sushiswap/database'
import { deepmergeInto } from 'deepmerge-ts'
import { type PoolCountApiSchema } from '../../pure/pools/count/schema'
import { type PoolsApiSchema } from '../../pure/pools/pools/schema'

export function parsePoolArgs(
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
