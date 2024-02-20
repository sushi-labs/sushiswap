import type { Address, PublicClient } from 'viem'
import { type MarketId, getChainIdAuctioneerMarketFromMarketId } from '..'
import { bondFixedTermSDAAbi } from '../abi'

interface GetMaxAmountsAccepted {
  client: PublicClient
  marketIds: MarketId[]
  referrer: Address
}

export function getMaxAmountsAcceptedContracts({
  marketIds,
  referrer,
}: Omit<GetMaxAmountsAccepted, 'client'>) {
  return marketIds.map((marketId) => {
    const { chainId, auctioneerAddress, marketNumber } =
      getChainIdAuctioneerMarketFromMarketId(marketId)

    return {
      abi: bondFixedTermSDAAbi,
      chainId,
      address: auctioneerAddress,
      functionName: 'maxAmountAccepted' as const,
      args: [marketNumber, referrer] as const,
    }
  })
}

export async function GetMaxAmountsAccepted({
  client,
  marketIds,
  referrer,
}: GetMaxAmountsAccepted) {
  const result = await client.multicall({
    allowFailure: true,
    contracts: getMaxAmountsAcceptedContracts({ marketIds, referrer }),
  })

  return result.flatMap((r, i) =>
    r.result
      ? {
          marketId: marketIds[i]!,
          maxAmountAccepted: r.result,
        }
      : [],
  )
}

interface GetMaxAmountAccepted {
  client: PublicClient
  marketId: MarketId
  referrer: Address
}

export async function getMaxAmountAccepted({
  client,
  marketId,
  referrer,
}: GetMaxAmountAccepted) {
  return (
    await GetMaxAmountsAccepted({ client, marketIds: [marketId], referrer })
  )[0]
}
