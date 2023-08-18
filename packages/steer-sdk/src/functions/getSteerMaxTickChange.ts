import { steerMultiPositionManager } from '@sushiswap/abi'
import { getChainIdAddressFromId } from '@sushiswap/format'
import { readContracts } from '@wagmi/core'

async function getSteerVaultsMaxTickChange(vaultIds: string[]) {
  const result = await readContracts({
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

  return result.map((r) => BigInt(r))
}

async function getSteerVaultMaxTickChange(vaultId: string) {
  return (await getSteerVaultsMaxTickChange([vaultId]))[0]
}

export { getSteerVaultMaxTickChange, getSteerVaultsMaxTickChange }
