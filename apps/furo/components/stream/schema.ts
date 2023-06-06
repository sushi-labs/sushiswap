import { z } from 'zod'
import { ZAddress, ZToken } from '../../lib/zod'

export const CreateStreamBaseSchema = z.object({
  id: z.string(),
  dates: z
    .object({
      startDate: z.date(),
      endDate: z.date(),
    })
    .required(),
  recipient: ZAddress,
  currency: ZToken,
  amount: z.string().refine((val) => Number(val) > 0, 'Must be at least 0'),
  fundSource: z.string(),
})

export const CreateStreamFormSchema = CreateStreamBaseSchema.partial({
  dates: true,
  recipient: true,
  currency: true,
  amount: true,
  fundSource: true,
})

export type CreateStreamFormSchemaType = z.infer<typeof CreateStreamFormSchema>

export const CreateMultipleStreamBaseSchema = z.object({
  streams: z.array(CreateStreamBaseSchema),
})

export const CreateMultipleStreamPartialBaseSchema = z.object({
  streams: z.array(CreateStreamFormSchema),
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
