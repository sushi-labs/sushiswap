import { unsanitize } from 'sushi/format'
import type { Address } from 'viem'
import type { BondChainId } from '..'

export const getMarketIdFromChainIdAuctioneerMarket = ({
  chainId,
  auctioneerAddress,
  marketNumber,
}: {
  chainId: BondChainId
  auctioneerAddress: Address
  marketNumber: bigint | number
}) => {
  return `${chainId}:${auctioneerAddress}:${marketNumber}` as const
}

export type MarketId = ReturnType<typeof getMarketIdFromChainIdAuctioneerMarket>

export const getChainIdAuctioneerMarketFromMarketId = (marketId: string) => {
  const [chainId, auctioneerAddress, marketNumber] = unsanitize(marketId).split(
    ':',
  ) as [string, Address, string]

  if (!chainId || !auctioneerAddress || !marketNumber)
    throw new Error(`Invalid id: ${marketId}`)

  return {
    chainId: Number(chainId) as BondChainId,
    auctioneerAddress,
    marketNumber: BigInt(marketNumber),
  }
}
