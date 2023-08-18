import { steerMultiPositionManager } from '@sushiswap/abi'
import { getChainIdAddressFromId } from '@sushiswap/format'
import { PublicClient } from 'viem'

async function getSteerVaultsMaxTickChange(client: PublicClient, vaultIds: string[]) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: vaultIds.map((id) => {
      const { chainId, address } = getChainIdAddressFromId(id)

      return {
        abi: steerMultiPositionManager,
        chainId,
        address,
        functionName: 'maxTickChange' as const,
      }
    }),
  })

  return result.map((r) => (r.result ? BigInt(r.result) : null))
}

async function getSteerVaultMaxTickChange(client: PublicClient, vaultId: string) {
  return (await getSteerVaultsMaxTickChange(client, [vaultId]))[0]
}

export { getSteerVaultMaxTickChange, getSteerVaultsMaxTickChange }
