import { getChainIdAddressFromId } from 'sushi/format'
import type { PublicClient } from 'viem'
import { steerPeripheryAbi } from '../abi/steerPeripheryAbi'
import { STEER_PERIPHERY_ADDRESS, isSteerChainId } from '../constants'

interface GetVaultsReservesContracts {
  vaultIds: string[]
}

export function getVaultsReservesContracts({
  vaultIds,
}: GetVaultsReservesContracts) {
  return vaultIds.map((id) => {
    const { chainId, address } = getChainIdAddressFromId(id)

    if (!isSteerChainId(chainId)) throw new Error(`Invalid chainId: ${chainId}`)

    const steerPeriphery = STEER_PERIPHERY_ADDRESS[chainId]

    return {
      abi: steerPeripheryAbi,
      address: steerPeriphery,
      chainId,
      args: [address] as const,
      functionName: 'vaultBalancesByAddressWithFees' as const,
    }
  })
}

interface GetVaultsReserves extends GetVaultsReservesContracts {
  client: PublicClient
}

export async function getVaultsReserves({
  client,
  vaultIds,
}: GetVaultsReserves) {
  const result = await client.multicall({
    allowFailure: false,
    contracts: getVaultsReservesContracts({ vaultIds }),
  })

  return result.map((r, i) => ({
    vaultId: vaultIds[i]!,
    reserve0: r.amountToken0,
    reserve1: r.amountToken1,
  }))
}

interface GetVaultReserves {
  client: PublicClient
  vaultId: string
}

export async function getVaultReserves({ client, vaultId }: GetVaultReserves) {
  const result = await getVaultsReserves({ client, vaultIds: [vaultId] })
  return result[0]!
}
