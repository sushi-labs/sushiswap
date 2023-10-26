import { amountSchema } from 'sushi/currency'
import { Fee } from 'sushi/dex'
import z from 'zod'

export const tridentStablePoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
  fee: z.nativeEnum(Fee),
  total0: z.object({
    base: z.string(),
    elastic: z.string(),
  }),
  total1: z.object({
    base: z.string(),
    elastic: z.string(),
  }),
})

export type SerializedStablePool = z.infer<typeof tridentStablePoolSchema>
