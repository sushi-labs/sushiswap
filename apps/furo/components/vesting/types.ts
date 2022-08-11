import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'
import { JSBI } from '@sushiswap/math'

export type StepConfig = {
  label: string
  time: number
}

export type CreateVestingFormData = {
  cliff: boolean
  stepConfig: StepConfig

  currency: Type | undefined
  startDate: string | ''
  recipient: string | ''
  cliffEndDate: string | null
  cliffAmount: number | ''
  stepPayouts: number | undefined
  stepAmount: number | ''
  fundSource: FundSource
  insufficientBalance: boolean
}

export type CreateVestingFormDataValidated = {
  currency: Type
  cliff: boolean
  startDate: string
  recipient: string
  cliffEndDate: string | undefined
  cliffAmount: number | undefined
  stepPayouts: number
  stepAmount: number | undefined
  stepConfig: StepConfig
  fundSource: FundSource
  insufficientBalance: boolean
}

export type CreateVestingFormDataTransformed = Omit<
  CreateVestingFormData,
  'startDate' | 'cliffEndDate' | 'stepEndDate' | 'cliffAmount' | 'stepAmount'
> & {
  startDate: Date
  cliffEndDate: Date | undefined
  cliffDuration: JSBI
  cliffAmount: Amount<Type> | undefined
  stepAmount: Amount<Type> | undefined
  stepPercentage: JSBI
  totalAmount: Amount<Type> | undefined
  endDate: Date | undefined
}
export type CreateVestingFormDataTransformedAndValidated = Omit<
  CreateVestingFormDataValidated,
  'startDate' | 'cliffEndDate' | 'stepEndDate'
> & {
  startDate: Date
  cliffEndDate: Date | undefined
  cliffDuration: JSBI
  stepPercentage: JSBI
  totalAmount: Amount<Type> | undefined
  cliffAmount: Amount<Type> | undefined
  stepAmount: Amount<Type> | undefined
}

export type CreateMultipleVestingFormData = {
  vestings: CreateVestingFormData[]
}

export type CreateMultipleVestingFormDataTransformed = {
  vestings: CreateVestingFormDataTransformed[]
}
