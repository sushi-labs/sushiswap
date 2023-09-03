import { getChainIdAddressFromId } from '@sushiswap/format'
import { PublicClient } from 'viem'

import { steerPeripheryAbi } from '../abi/steerPeripheryAbi.js'
import { isSteerChainId, STEER_PERIPHERY_ADDRESS } from '../constants.js'

interface GetSteerVaultsReserves {
  client: PublicClient
  vaultIds: string[]
}

async function getSteerVaultsReserves({ client, vaultIds }: GetSteerVaultsReserves) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: vaultIds.map((id) => {
      const { chainId, address } = getChainIdAddressFromId(id)

      if (!isSteerChainId(chainId)) throw new Error(`Invalid chainId: ${chainId}`)
      const steerPeriphery = STEER_PERIPHERY_ADDRESS[chainId]

      return {
        abi: steerPeripheryAbi,
        chainId,
        address: steerPeriphery,
        args: [address],
        functionName: 'vaultBalancesByAddressWithFees' as const,
      }
    }),
  })

  return result.map(({ result }) =>
    result ? ({ reserve0: result.amountToken0, reserve1: result.amountToken1 } as const) : null
  )
}

interface GetSteerVaultReserves {
  client: PublicClient
  vaultId: string
}

async function getSteerVaultReserves({ client, vaultId }: GetSteerVaultReserves) {
  return (await getSteerVaultsReserves({ client, vaultIds: [vaultId] }))[0]
}

export { getSteerVaultReserves, getSteerVaultsReserves }
