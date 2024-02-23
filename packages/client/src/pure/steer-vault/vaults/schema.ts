import { z } from 'zod'

export const SteerVaultsApiSchema = z.object({
  take: z.coerce.number().int().lte(1000).default(1000),
  ids: z
    .string()
    .transform((ids) => ids?.split(',').map((id) => id.toLowerCase()))
    .optional(),
  chainIds: z
    .string()
    .transform((val) => val.split(',').map((v) => parseInt(v)))
    .optional(),
  onlyEnabled: z.coerce
    .string()
    .transform((val) => {
      switch (val) {
        case 'true':
          return true
        case 'false':
          return false
        default:
          throw new Error('onlyEnabled must true or false')
      }
    })
    .optional(),
  cursor: z.string().optional(),
  orderBy: z.string().default('reserveUSD'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})
