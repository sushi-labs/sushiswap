import { steerMultiPositionManager } from '@sushiswap/abi'
import { getChainIdAddressFromId } from '@sushiswap/format'
import { PublicClient } from 'viem'

interface GetSteerVaultsReserves {
  client: PublicClient
  vaultIds: string[]
}

async function getSteerVaultsReserves({ client, vaultIds }: GetSteerVaultsReserves) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: vaultIds.map((id) => {
      const { chainId, address } = getChainIdAddressFromId(id)

      return {
        abi: steerMultiPositionManager,
        chainId,
        address,
        functionName: 'getTotalAmounts' as const,
      }
    }),
  })

  return result.map(({ result }) =>
    result ? ({ reserve0: BigInt(result[0].toString()), reserve1: BigInt(result[1].toString()) } as const) : null
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
