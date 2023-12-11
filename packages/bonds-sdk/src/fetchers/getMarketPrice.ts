import type { PublicClient } from 'viem'
import { type MarketId, getChainIdAuctioneerMarketFromMarketId } from '..'
import { bondFixedTermSDAAbi } from '../abi'

interface GetBondMarketsPrices {
  client: PublicClient
  marketIds: MarketId[]
}

export async function getBondMarketsPrices({
  client,
  marketIds,
}: GetBondMarketsPrices) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: marketIds.map((marketId) => {
      const { chainId, auctioneerAddress, marketNumber } =
        getChainIdAuctioneerMarketFromMarketId(marketId)

      return {
        abi: bondFixedTermSDAAbi,
        chainId,
        address: auctioneerAddress,
        functionName: 'marketPrice' as const,
        args: [marketNumber] as const,
      }
    }),
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

interface GetBondMarketPrice {
  client: PublicClient
  marketId: MarketId
}

export async function getBondMarketPrice({
  client,
  marketId,
}: GetBondMarketPrice) {
  return (await getBondMarketsPrices({ client, marketIds: [marketId] }))[0]
}
