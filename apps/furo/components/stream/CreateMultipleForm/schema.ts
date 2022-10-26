import { z } from 'zod'

import { CreateStreamBaseSchema } from '../CreateForm'

export const CreateMultipleStreamBaseSchema = z.object({
  streams: z.array(CreateStreamBaseSchema.partial()),
})

export type CreateMultipleStreamBaseSchemaType = z.infer<typeof CreateMultipleStreamBaseSchema>
