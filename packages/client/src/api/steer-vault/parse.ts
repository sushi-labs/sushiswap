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

  // if ('chainIds' in args && args.chainIds !== undefined) {
  //   addFilter({
  //     chainId: { in: args.chainIds },
  //   })
  // }

  if ('isEnabled' in args && args.isEnabled !== undefined) {
    addFilter({
      isEnabled: args.isEnabled,
    })
  }

  return where
}
