import { z } from 'zod'
import { Currency } from '../../../api/v2'

export const TokenPricesChainV2ApiSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})
