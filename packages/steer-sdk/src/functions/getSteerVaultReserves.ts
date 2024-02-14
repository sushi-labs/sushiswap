import type { PublicClient } from 'viem'

import { getVaultsReservesContracts } from 'src/fetchers/getVaultReserves.js'
import { multichainMulticall } from '../helpers/multichainMulticall.js'

interface GetSteerVaultsReserves {
  clients: PublicClient[]
  vaultIds: string[]
}

async function getSteerVaultsReserves({
  clients,
  vaultIds,
}: GetSteerVaultsReserves) {
  const result = await multichainMulticall({
    clients,
    params: {
      contracts: getVaultsReservesContracts({ vaultIds }),
    },
  })

  return result.map(({ result }) =>
    result
      ? ({
          reserve0: result.amountToken0,
          reserve1: result.amountToken1,
        } as const)
      : null,
  )
}

interface GetSteerVaultReserves {
  client: PublicClient
  vaultId: string
}

async function getSteerVaultReserves({
  client,
  vaultId,
}: GetSteerVaultReserves) {
  const result = (
    await getSteerVaultsReserves({ clients: [client], vaultIds: [vaultId] })
  )[0]

  if (!result)
    throw new Error(`Failed to fetch reserves for vaultId: ${vaultId}`)

  return result
}

export { getSteerVaultReserves, getSteerVaultsReserves }
