import { z } from 'zod'

import { ZAddress, ZFundSource, ZToken } from '../../../lib/zod'
import { StepConfig } from '../types'

export const stepConfigurations: StepConfig[] = [
  { label: 'Weekly', time: 604800 },
  { label: 'Bi-weekly', time: 2 * 604800 },
  { label: 'Monthly', time: 2620800 },
  { label: 'Quarterly', time: 3 * 2620800 },
  { label: 'Yearly', time: 31449600 },
]

const CliffFieldsEnabled = z.object({
  cliffEnabled: z.literal(true),
  cliffEndDate: z.date().nullable(),
  cliffAmount: z.string().refine((val) => Number(val) > 0, 'Must be at least 0'),
})
const CliffFieldsDisabled = z.object({ cliffEnabled: z.literal(false) })
const CliffFields = CliffFieldsEnabled.or(CliffFieldsDisabled)

export const CreateVestingBaseSchema = z.object({
  id: z.string(),
  currency: ZToken,
  startDate: z.date(),
  recipient: ZAddress,
  stepAmount: z.string().refine((val) => (val !== '' ? Number(val) > 0 : true), 'Must be at least 0'),
  stepPayouts: z.number().min(1).int(),
  fundSource: ZFundSource,
  stepConfig: z.object({
    label: z.string(),
    time: z.number(),
  }),
  cliff: CliffFields,
})

export const CreateVestingBaseSchemaPartial = CreateVestingBaseSchema.partial({
  currency: true,
  startDate: true,
  recipient: true,
  stepAmount: true,
})

export const CreateVestingFormSchema = CreateVestingBaseSchemaPartial
export const CreateVestingModelSchema = CreateVestingBaseSchema

export type CreateVestingFormSchemaType = z.infer<typeof CreateVestingFormSchema>
