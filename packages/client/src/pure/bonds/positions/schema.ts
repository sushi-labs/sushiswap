import { BONDS_ENABLED_CHAIN_IDS, isBondChainId } from '@sushiswap/bonds-sdk'
import type { ChainId } from 'sushi/chain'
import { z } from 'zod'

export const BondsPositionsApiSchema = z.object({
  userAddress: z.string().transform((address) => address.toLowerCase()),
  onlyUnclaimedBonds: z.coerce
    .string()
    .optional()
    .default('true')
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('onlyUnclaimedBonds must true or false')
      }
    }),
  payoutTokenId: z
    .string()
    .transform((id) => id.toLowerCase())
    .optional(),
  chainIds: z
    .string()
    .optional()
    .default(BONDS_ENABLED_CHAIN_IDS.join(','))
    .transform((val) => val.split(',').map((v) => parseInt(v) as ChainId))
    .transform((chainIds) => chainIds.filter(isBondChainId)),
})
