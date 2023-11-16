import { z } from 'zod'

const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
} as const

export const TokenPricesV1ApiSchema = z.object({
  currency: z.nativeEnum(Currency).default(Currency.USD),
})
