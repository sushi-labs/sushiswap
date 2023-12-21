import type { PublicClient } from 'viem'
import { type MarketId, getChainIdAuctioneerMarketFromMarketId } from '..'
import { bondFixedTermSDAAbi } from '../abi'

interface GetRemainingCapacities {
  client: PublicClient
  marketIds: MarketId[]
}

export function getRemainingCapacitiesContracts({
  marketIds,
}: { marketIds: MarketId[] }) {
  return marketIds.map((marketId) => {
    const { chainId, auctioneerAddress, marketNumber } =
      getChainIdAuctioneerMarketFromMarketId(marketId)

    return {
      abi: bondFixedTermSDAAbi,
      chainId,
      address: auctioneerAddress,
      functionName: 'currentCapacity' as const,
      args: [marketNumber] as const,
    }
  })
}

export async function getRemainingCapacities({
  client,
  marketIds,
}: GetRemainingCapacities) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: getRemainingCapacitiesContracts({ marketIds }),
  })

  return result.flatMap((r, i) =>
    r.result
      ? {
          marketId: marketIds[i]!,
          remainingCapacity: r.result,
        }
      : [],
  )
}

interface GetRemainingCapacity {
  client: PublicClient
  marketId: MarketId
}

export async function getRemainingCapacity({
  client,
  marketId,
}: GetRemainingCapacity) {
  return (await getRemainingCapacities({ client, marketIds: [marketId] }))[0]
}
