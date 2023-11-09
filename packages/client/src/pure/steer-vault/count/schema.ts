import { z } from 'zod'

export const SteerVaultCountApiSchema = z.object({
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
})
