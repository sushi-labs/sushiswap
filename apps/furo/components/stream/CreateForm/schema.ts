import { z } from 'zod'

import { ZAddress, ZAmount } from '../../../lib/zod'

export const CreateStreamBaseSchema = z.object({
  dates: z
    .object({
      startDate: z
        .date()
        .refine(
          (val) => val.getTime() > new Date(Date.now() + 5 * 60 * 1000).getTime(),
          'Must be at least 5 minutes from now'
        )
        .nullable(),
      endDate: z.date().nullable(),
    })
    .required()
    .refine(
      (data) => {
        if (!data.startDate || !data.endDate) return true
        return data.startDate < data.endDate
      },
      { message: 'Must be later than start date', path: ['endDate'] }
    ),
  recipient: ZAddress,
  amount: ZAmount,
  fundSource: z.string(),
})

export const CreateStreamBaseSchemaPartial = CreateStreamBaseSchema.partial()

export const CreateStreamFormSchema = CreateStreamBaseSchemaPartial
export const CreateStreamModelSchema = CreateStreamBaseSchema

export type CreateStreamFormSchemaType = z.infer<typeof CreateStreamFormSchema>
