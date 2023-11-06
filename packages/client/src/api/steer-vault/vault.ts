import type * as _ from '@prisma/client/runtime'

import { type SteerVaultApiSchema } from '../../pure/steer-vault/vault/schema'
import { getSteerVaultsFromDB } from './vaults'

export async function getSteerVaultFromDB(
  args: typeof SteerVaultApiSchema._output,
) {
  const id = `${args.chainId}:${args.address.toLowerCase()}`

  // Need to specify take, orderBy and orderDir to make TS happy
  const [vault]: Awaited<ReturnType<typeof getSteerVaultsFromDB>> =
    await getSteerVaultsFromDB({
      ids: [id],
      take: 1,
      orderBy: 'liquidityUSD',
      orderDir: 'desc',
    })

  if (!vault) throw new Error('Vault not found.')

  return vault
}
