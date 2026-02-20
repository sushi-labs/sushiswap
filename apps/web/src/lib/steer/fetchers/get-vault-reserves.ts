import { isSmartPoolChainId } from '@sushiswap/graph-client/data-api'
import { getChainIdAddressFromId } from 'sushi'
import type { EvmID } from 'sushi/evm'
import type { ContractFunctionReturnType, PublicClient } from 'viem'
import { steerPeripheryAbi } from '../abi/steer-periphery'
import { STEER_PERIPHERY_ADDRESS } from '../config'

interface GetVaultsReservesContracts {
  vaultIds: EvmID[]
}

export function getVaultsReservesContracts({
  vaultIds,
}: GetVaultsReservesContracts) {
  return vaultIds.map((id) => {
    const { chainId, address } = getChainIdAddressFromId(id)

    if (!isSmartPoolChainId(chainId))
      throw new Error(`Invalid chainId: ${chainId}`)

    const steerPeriphery = STEER_PERIPHERY_ADDRESS[chainId]

    return {
      abi: steerPeripheryAbi,
      address: steerPeriphery,
      chainId,
      args: [address] as const,
      functionName: 'vaultDetailsByAddress' as const,
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
    allowFailure: true,
    contracts: getVaultsReservesContracts({ vaultIds }),
  })

  return result.map((res, i) => {
    if (typeof res.result === 'undefined') return null
    return getVaultsReservesSelect(vaultIds[i]!, res.result)
  })
}

export function getVaultsReservesSelect(
  vaultId: string,
  result: ContractFunctionReturnType<
    typeof steerPeripheryAbi,
    'view',
    'vaultDetailsByAddress'
  >,
) {
  return {
    vaultId,
    reserve0: result.token0Balance,
    reserve1: result.token1Balance,
  }
}

interface GetVaultReserves {
  client: PublicClient
  vaultId: EvmID
}

export async function getVaultReserves({ client, vaultId }: GetVaultReserves) {
  const results = await getVaultsReserves({ client, vaultIds: [vaultId] })

  if (!results[0]) {
    throw new Error(`Failed to fetch reserves for vaultId: ${vaultId}`)
  }

  return results[0]!
}
