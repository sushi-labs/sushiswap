import { steerMultiPositionManager } from '@sushiswap/abi'
import { getChainIdAddressFromId } from '@sushiswap/format'
import { PublicClient } from 'viem'

async function getSteerVaultsReserves(client: PublicClient, vaultIds: string[]) {
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

async function getSteerVaultReserves(client: PublicClient, vaultId: string) {
  return (await getSteerVaultsReserves(client, [vaultId]))[0]
}

export { getSteerVaultReserves, getSteerVaultsReserves }
