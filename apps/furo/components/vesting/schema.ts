import { z } from 'zod'
import { ZAddress, ZFundSource, ZToken } from '../../lib/zod'

export const STEP_CONFIGURATIONS: Record<string, number> = {
  Weekly: 604800,
  'Bi-weekly': 2 * 604800,
  Monthly: 2620800,
  Quarterly: 3 * 2620800,
  Yearly: 31449600,
}

export const CreateVestingBaseSchema = z.object({
  id: z.string(),
  currency: ZToken,
  startDate: z.date(),
  recipient: ZAddress,
  stepAmount: z.string().refine((val) => (val !== '' ? Number(val) > 0 : true), 'Must be at least 0'),
  stepPayouts: z.number().min(1).int(),
  fundSource: ZFundSource,
  stepConfig: z.string(),
  cliff: z.object({
    cliffEnabled: z.boolean(),
    cliffEndDate: z.date().optional(),
    cliffAmount: z.string().optional(),
  }),
})

export const CreateVestingFormSchema = CreateVestingBaseSchema.partial({
  currency: true,
  startDate: true,
  recipient: true,
  stepAmount: true,
  stepConfig: true,
})

export type CreateVestingFormSchemaType = z.infer<typeof CreateVestingFormSchema>

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
