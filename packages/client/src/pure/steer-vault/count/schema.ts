import { z } from 'zod'

export const SteerVaultCountApiSchema = z.object({
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
})
