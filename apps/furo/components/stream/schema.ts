import { z } from 'zod'
import { RefinementCtx } from 'zod/lib/types'

import { ZAddress, ZToken } from '../../lib/zod'

const dateRangeValidator = (val: { startDate?: Date; endDate?: Date }, ctx: RefinementCtx) => {
  console.log('dateRangeValidator', val)

  if (!val.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Required',
      path: ['startDate'],
    })
  }
  if (!val.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Required',
      path: ['endDate'],
    })
  }

  if (val.startDate && val.startDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be at least 5 minutes from now',
      path: ['startDate'],
    })
  }

  if (val.endDate && val.endDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be at least 5 minutes from now',
      path: ['endDate'],
    })
  }

  if (val.startDate && val.endDate && val.endDate.getTime() < val.startDate.getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be later than start date',
      path: ['endDate'],
    })
  }

  return z.NEVER
}

export const CreateStreamBaseSchema = z.object({
  id: z.string(),
  dates: z
    .object({
      startDate: z.date().optional(),
      endDate: z.date().optional(),
    })
    .superRefine(dateRangeValidator),
  recipient: ZAddress,
  currency: ZToken,
  amount: z.coerce.string().refine((val) => Number(val) > 0, 'Must be greater than 0'),
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
