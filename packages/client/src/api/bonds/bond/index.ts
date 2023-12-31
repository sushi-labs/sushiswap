import { getMarketIdFromChainIdAuctioneerMarket } from '@sushiswap/bonds-sdk'
import { getBondsFromSubgraph } from '..'
import { type BondApiSchema } from '../../../pure/bonds/bond/schema'
import { BondsApiSchema } from '../../../pure/bonds/bonds/schema'

export async function getBondFromSubgraph(args: typeof BondApiSchema._output) {
  const bondsArgs = BondsApiSchema.parse({
    ids: getMarketIdFromChainIdAuctioneerMarket(args.marketId),
    chainIds: String(args.marketId.chainId),
    anyIssuer: 'true',
  })

  return (await getBondsFromSubgraph(bondsArgs))[0]
}
