import { steerMultiPositionManager } from '@sushiswap/abi'
import { getChainIdAddressFromId } from '@sushiswap/format'
import { readContracts } from '@wagmi/core'

async function getSteerVaultsPositions(vaultIds: string[]) {
  const result = await readContracts({
    allowFailure: true,
    contracts: vaultIds.map((id) => {
      const { chainId, address } = getChainIdAddressFromId(id)

      return {
        abi: steerMultiPositionManager,
        chainId,
        address,
        functionName: 'getPositions' as const,
      }
    }),
  })

  return result.map((res) => {
    const lowerTicks = res[0]
    const upperTicks = res[1]
    const relativeWeights = res[2]

    return res.map((_, i) => ({
      lowerTick: BigInt(lowerTicks[i].toString()),
      upperTick: BigInt(upperTicks[i].toString()),
      liquidity: BigInt(relativeWeights[i].toString()),
    }))
  })
}

async function getSteerVaultPositions(vaultId: string) {
  return (await getSteerVaultsPositions([vaultId]))[0]
}

export { getSteerVaultPositions, getSteerVaultsPositions }
