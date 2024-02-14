import type { PublicClient } from 'viem'
import { type MarketId, getChainIdAuctioneerMarketFromMarketId } from '..'
import { bondFixedTermSDAAbi } from '../abi'

interface GetMarketsPrices {
  client: PublicClient
  marketIds: MarketId[]
}

export function getMarketPricesContracts({
  marketIds,
}: { marketIds: MarketId[] }) {
  return marketIds.map((marketId) => {
    const { chainId, auctioneerAddress, marketNumber } =
      getChainIdAuctioneerMarketFromMarketId(marketId)

    return {
      abi: bondFixedTermSDAAbi,
      chainId,
      address: auctioneerAddress,
      functionName: 'marketPrice' as const,
      args: [marketNumber] as const,
    }
  })
}

export async function getMarketsPrices({
  client,
  marketIds,
}: GetMarketsPrices) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: getMarketPricesContracts({ marketIds }),
  })

  return result.flatMap((r, i) =>
    r.result
      ? {
          marketId: marketIds[i]!,
          marketPrice: r.result,
        }
      : [],
  )
}

interface GetMarketPrice {
  client: PublicClient
  marketId: MarketId
}

export async function getMarketPrice({ client, marketId }: GetMarketPrice) {
  return (await getMarketsPrices({ client, marketIds: [marketId] }))[0]
}
