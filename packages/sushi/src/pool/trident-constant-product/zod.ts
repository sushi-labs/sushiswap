import z from 'zod'
import { amountSchema } from '../../currency/index.js'
import { Fee } from '../../dex/index.js'

export const tridentConstantPoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
  fee: z.nativeEnum(Fee),
  twap: z.boolean(),
})

export type SerializedConstantPool = z.infer<typeof tridentConstantPoolSchema>
