import { z } from 'zod'

export const CommonTokensApiSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})
