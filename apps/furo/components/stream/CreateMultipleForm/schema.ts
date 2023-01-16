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

// Helper schema to generate type below
const _CreateMultipleStreamBaseSchemaFormErrors = z.object({
  FORM_ERRORS: z.array(
    z.object({
      amount: z.string(),
    })
  ),
})
export type CreateMultipleStreamBaseSchemaFormErrorsType = z.infer<typeof _CreateMultipleStreamBaseSchemaFormErrors>
