import { z } from 'zod'

export const SearchTokenApiSchema = z.object({
  address: z.coerce.string(),
})
