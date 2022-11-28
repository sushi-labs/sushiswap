import { z } from 'zod'

import { ZAddress, ZToken } from '../../../lib/zod'

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

export const CreateStreamBaseSchemaPartial = CreateStreamBaseSchema.partial()

export const CreateStreamFormSchema = CreateStreamBaseSchemaPartial
export const CreateStreamModelSchema = CreateStreamBaseSchema

export type CreateStreamFormSchemaType = z.infer<typeof CreateStreamFormSchema>
