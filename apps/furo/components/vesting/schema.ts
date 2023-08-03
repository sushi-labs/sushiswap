import { z } from 'zod'
import { RefinementCtx } from 'zod/lib/types'

import { ZAddress, ZFundSource, ZToken } from '../../lib/zod'

export const STEP_CONFIGURATIONS_SECONDS: Record<string, number> = {
  Weekly: 604800,
  'Bi-weekly': 2 * 604800,
  Monthly: 2620800,
  Quarterly: 3 * 2620800,
  Yearly: 31449600,
}

export const STEP_CONFIGURATIONS_MAP: Record<string, number> = {
  '0': STEP_CONFIGURATIONS_SECONDS['Weekly'],
  '1': STEP_CONFIGURATIONS_SECONDS['Bi-weekly'],
  '2': STEP_CONFIGURATIONS_SECONDS['Monthly'],
  '3': STEP_CONFIGURATIONS_SECONDS['Quarterly'],
  '4': STEP_CONFIGURATIONS_SECONDS['Yearly'],
}

export const STEP_CONFIGURATIONS_LABEL: Record<string, string> = {
  '0': 'Weekly',
  '1': 'Bi-weekly',
  '2': 'Monthly',
  '3': 'Quarterly',
  '4': 'Yearly',
}

const cliffValidator = (
  val: { startDate?: Date; cliffEnabled?: boolean; cliffEndDate?: Date; cliffAmount?: string },
  ctx: RefinementCtx
) => {
  if (val.startDate && val.startDate.getTime() <= new Date(Date.now() + 5 * 60 * 1000).getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be at least 5 minutes from now',
      path: ['startDate'],
    })
  }

  if (!val.cliffEnabled) {
    return z.NEVER
  }

  if (!val.cliffEndDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Required',
      path: ['cliffEndDate'],
    })
  }

  if (val.startDate && val.cliffEnabled && val.cliffEndDate && val.cliffEndDate < val.startDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be later than start date',
      path: ['cliffEndDate'],
    })
  }

  if (!val.cliffAmount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Required',
      path: ['cliffAmount'],
    })
  }

  if (val.cliffAmount && !isNaN(+val.cliffAmount) && +val.cliffAmount <= 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Must be greater than 0',
      path: ['cliffAmount'],
    })
  }

  return z.NEVER
}

export const CreateVestingBaseSchema = z.object({
  id: z.string(),
  currency: ZToken,
  startDate: z.coerce
    .date()
    .refine(
      (val) => val && val.getTime() >= new Date(Date.now() + 5 * 60 * 1000).getTime(),
      'Must be at least 5 minutes from now'
    ),
  recipient: ZAddress,
  stepAmount: z.coerce.string().refine((val) => (val !== '' ? Number(val) > 0 : true), 'Must be greater than 0'),
  stepPayouts: z.coerce.number().min(1).int(),
  fundSource: ZFundSource,
  stepConfig: z.string(),
  cliffEnabled: z.boolean(),
  cliffEndDate: z.date().optional(),
  cliffAmount: z.string().optional(),
})

export const CreateVestingFormSchema = CreateVestingBaseSchema.partial({
  currency: true,
  startDate: true,
  recipient: true,
  stepAmount: true,
  stepConfig: true,
  cliffAmount: true,
  cliffEndDate: true,
}).superRefine(cliffValidator)

export type CreateVestingFormSchemaType = z.infer<typeof CreateVestingFormSchema>

export const CreateMultipleVestingBaseSchema = z.object({
  vestings: z.array(CreateVestingBaseSchema.superRefine(cliffValidator)),
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
