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
  isEnabled: z.coerce
    .string()
    .transform((val) => {
      if (val === 'true') {
        return true
      } else if (val === 'false') {
        return false
      } else {
        throw new Error('isEnabled must true or false')
      }
    })
    .optional(),
  cursor: z.string().optional(),
  orderBy: z.string().default('reserveUSD'),
  orderDir: z.enum(['asc', 'desc']).default('desc'),
})
