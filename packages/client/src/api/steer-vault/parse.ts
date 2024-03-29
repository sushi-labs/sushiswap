import type { Prisma } from '@sushiswap/database'
import { deepmergeInto } from 'deepmerge-ts'
import { type SteerVaultCountApiSchema } from '../../pure/steer-vault/count/schema'
import { type SteerVaultsApiSchema } from '../../pure/steer-vault/vaults/schema'

export function parseSteerArgs(
  args:
    | typeof SteerVaultsApiSchema._output
    | typeof SteerVaultCountApiSchema._output,
) {
  const where: NonNullable<Prisma.SteerVaultWhereInput> = {}

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

  if ('onlyEnabled' in args && args.onlyEnabled === true) {
    addFilter({
      isEnabled: true,
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
