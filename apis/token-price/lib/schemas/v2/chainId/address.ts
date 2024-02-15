import { getAddress } from 'viem'
import { z } from 'zod'
import { Currency } from '../../../api/v2'

export const TokenPriceV2ApiSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string().transform((address) => getAddress(address)),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})
