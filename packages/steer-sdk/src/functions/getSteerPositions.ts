import { steerMultiPositionManager } from '@sushiswap/abi'
import { getChainIdAddressFromId } from '@sushiswap/format'
import { PublicClient } from 'viem'

interface GetSteerVaultsPositions {
  client: PublicClient
  vaultIds: string[]
}

async function getSteerVaultsPositions({ client, vaultIds }: GetSteerVaultsPositions) {
  const result = await client.multicall({
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
    if (!res.result) return null

    const lowerTicks = res.result[0]
    const upperTicks = res.result[1]
    const relativeWeights = res.result[2]

    return lowerTicks.map((_, i) => ({
      lowerTick: BigInt(lowerTicks[i].toString()),
      upperTick: BigInt(upperTicks[i].toString()),
      relativeWeight: BigInt(relativeWeights[i].toString()),
    }))
  })
}

interface GetSteerVaultPositions {
  client: PublicClient
  vaultId: string
}

async function getSteerVaultPositions({ client, vaultId }: GetSteerVaultPositions) {
  return (await getSteerVaultsPositions({ client, vaultIds: [vaultId] }))[0]
}

export { getSteerVaultPositions, getSteerVaultsPositions }
