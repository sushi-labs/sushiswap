import { Fee } from 'sushi/dex'
import { amountSchema } from 'sushi/currency'
import z from 'zod'

export const tridentConstantPoolSchema = z.object({
  reserve0: amountSchema,
  reserve1: amountSchema,
  fee: z.nativeEnum(Fee),
  twap: z.boolean(),
})

export type SerializedConstantPool = z.infer<typeof tridentConstantPoolSchema>
