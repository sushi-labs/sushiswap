import { z } from 'zod'

import { ZAddress, ZFundSource, ZToken } from '../../../lib/zod'

export const STEP_CONFIGURATIONS: Record<string, number> = {
  Weekly: 604800,
  'Bi-weekly': 2 * 604800,
  Monthly: 2620800,
  Quarterly: 3 * 2620800,
  Yearly: 31449600,
}

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
  stepConfig: z.string(),
  cliff: CliffFields,
})

export const CreateVestingFormSchema = CreateVestingBaseSchema.partial({
  currency: true,
  startDate: true,
  recipient: true,
  stepAmount: true,
  stepConfig: true,
})

export type CreateVestingFormSchemaType = z.infer<typeof CreateVestingFormSchema>
