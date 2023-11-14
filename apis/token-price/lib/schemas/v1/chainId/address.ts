import { z } from 'zod'

const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
} as const

export const TokenPriceV1ApiSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
  currency: z.nativeEnum(Currency).default(Currency.USD),
})
