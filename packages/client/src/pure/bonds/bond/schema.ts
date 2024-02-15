import { getChainIdAuctioneerMarketFromMarketId } from '@sushiswap/bonds-sdk'
import { z } from 'zod'

export const BondApiSchema = z.object({
  marketId: z.string().transform(getChainIdAuctioneerMarketFromMarketId),
})
