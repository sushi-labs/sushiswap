import { getChainIdAddressFromId } from 'sushi/format'
import type { PublicClient } from 'viem'

import { steerPeripheryAbi } from '../abi/steerPeripheryAbi.js'
import { STEER_PERIPHERY_ADDRESS, isSteerChainId } from '../constants.js'
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
      contracts: vaultIds.map((id) => {
        const { chainId, address } = getChainIdAddressFromId(id)

        if (!isSteerChainId(chainId))
          throw new Error(`Invalid chainId: ${chainId}`)
        const steerPeriphery = STEER_PERIPHERY_ADDRESS[chainId]

        return {
          abi: steerPeripheryAbi,
          address: steerPeriphery,
          chainId,
          args: [address] as const,
          functionName: 'vaultBalancesByAddressWithFees' as const,
        }
      }),
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
  return (
    await getSteerVaultsReserves({ clients: [client], vaultIds: [vaultId] })
  )[0]
}

export { getSteerVaultReserves, getSteerVaultsReserves }
