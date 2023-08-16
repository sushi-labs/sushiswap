import { z } from 'zod'

export const PopularTokensApiSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256),
})
