import { z } from 'zod'

import { CreateVestingBaseSchema, CreateVestingFormSchema } from '../CreateForm'

export const CreateMultipleVestingBaseSchema = z.object({
  vestings: z.array(CreateVestingBaseSchema),
})

export const CreateMultipleVestingPartialBaseSchema = z.object({
  vestings: z.array(CreateVestingFormSchema),
})

export const CreateMultipleVestingFormSchema = CreateMultipleVestingPartialBaseSchema.partial()
export const CreateMultipleVestingModelSchema = CreateMultipleVestingBaseSchema

export type CreateMultipleVestingFormSchemaType = z.infer<typeof CreateMultipleVestingFormSchema>

// Helper schema to generate type below
const _CreateMultipleVestBaseSchemaFormErrors = z.object({
  FORM_ERRORS: z.array(
    z.object({
      stepAmount: z.string(),
    })
  ),
})

export type CreateMultipleVestingBaseSchemaFormErrorsType = z.infer<typeof _CreateMultipleVestBaseSchemaFormErrors>
