import { z } from 'zod'

const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
} as const

export const schema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
  address: z.coerce.string(),
  currency: z
    .nativeEnum(Currency)
    .nullable()
    .transform((currency) => currency ?? Currency.USD),
})
