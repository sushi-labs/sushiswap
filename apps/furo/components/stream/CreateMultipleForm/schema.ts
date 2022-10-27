import { z } from 'zod'

import { CreateStreamBaseSchema, CreateStreamBaseSchemaPartial } from '../CreateForm'

export const CreateMultipleStreamBaseSchema = z.object({
  streams: z.array(CreateStreamBaseSchema),
})

export const CreateMultipleStreamPartialBaseSchema = z.object({
  streams: z.array(CreateStreamBaseSchemaPartial),
})

export const CreateMultipleStreamFormSchema = CreateMultipleStreamPartialBaseSchema.partial()
export const CreateMultipleStreamModelSchema = CreateMultipleStreamBaseSchema

export type CreateMultipleStreamFormSchemaType = z.infer<typeof CreateMultipleStreamFormSchema>
