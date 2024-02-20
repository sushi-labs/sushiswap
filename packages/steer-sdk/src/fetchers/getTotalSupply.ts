import { erc20Abi } from 'sushi/abi'
import { getChainIdAddressFromId } from 'sushi/format'
import type { PublicClient } from 'viem'

interface GetTotalSuppliesContracts {
  vaultIds: string[]
}

export function getTotalSuppliesContracts({
  vaultIds,
}: GetTotalSuppliesContracts) {
  return vaultIds.map((id) => {
    const { chainId, address } = getChainIdAddressFromId(id)

    return {
      abi: erc20Abi,
      chainId,
      address,
      functionName: 'totalSupply' as const,
    }
  })
}

interface GetTotalSupplies extends GetTotalSuppliesContracts {
  client: PublicClient
}

export async function getTotalSupplies({ client, vaultIds }: GetTotalSupplies) {
  const result = await client.multicall({
    allowFailure: false,
    contracts: getTotalSuppliesContracts({ vaultIds }),
  })

  return result.map((r, i) => ({
    vaultId: vaultIds[i]!,
    totalSupply: r,
  }))
}

interface GetTotalSupply {
  client: PublicClient
  vaultId: string
}

export async function getTotalSupply({ client, vaultId }: GetTotalSupply) {
  const result = await getTotalSupplies({ client, vaultIds: [vaultId] })
  return result[0]!.totalSupply
}
