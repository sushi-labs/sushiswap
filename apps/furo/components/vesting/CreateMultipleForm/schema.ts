import { z } from 'zod'

import { CreateVestingBaseSchema, CreateVestingBaseSchemaPartial } from '../CreateForm'

export const CreateMultipleVestingBaseSchema = z.object({
  vestings: z.array(CreateVestingBaseSchema),
})

export const CreateMultipleVestingPartialBaseSchema = z.object({
  vestings: z.array(CreateVestingBaseSchemaPartial),
})

export const CreateMultipleVestingFormSchema = CreateMultipleVestingPartialBaseSchema.partial()
export const CreateMultipleVestingModelSchema = CreateMultipleVestingBaseSchema

export type CreateMultipleVestingFormSchemaType = z.infer<typeof CreateMultipleVestingFormSchema>
export type CreateMultipleVestingModelSchemaType = z.infer<typeof CreateMultipleVestingModelSchema>

// Helper schema to generate type below
const _CreateMultipleVestBaseSchemaFormErrors = z.object({
  FORM_ERRORS: z.array(
    z.object({
      amount: z.string(),
    })
  ),
})
export type CreateMultipleStreamBaseSchemaFormErrorsType = z.infer<typeof _CreateMultipleVestBaseSchemaFormErrors>
