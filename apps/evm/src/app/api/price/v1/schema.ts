import { z } from 'zod'

const Currency = {
  USD: 'USD',
  NATIVE: 'NATIVE',
} as const

export const schema = z.object({
  currency: z
    .nativeEnum(Currency)
    .nullable()
    .transform((transform) => transform ?? Currency.USD),
})
