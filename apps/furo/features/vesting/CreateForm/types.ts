import { Token } from '@sushiswap/currency'
import { JSBI } from '@sushiswap/math'
import { FundSource } from 'hooks/useFundSourceToggler'

export type StepConfig = {
  label: string
  time: number
}

export type CreateVestingFormData = {
  cliff: boolean
  stepConfig: StepConfig

  token: Token | undefined
  startDate: string | undefined
  recipient: string | undefined
  cliffEndDate: string | undefined
  cliffAmount: number | undefined
  stepEndDate: string | undefined
  stepAmount: number | undefined
  fundSource: FundSource | undefined
}

export type CreateVestingFormDataValidated = {
  token: Token
  cliff: boolean
  startDate: string
  recipient: string
  cliffEndDate: string
  cliffAmount: number
  stepEndDate: string
  stepAmount: number
  stepConfig: StepConfig
  fundSource: FundSource
}

export type CreateVestingFormDataTransformed = Omit<
  CreateVestingFormDataValidated,
  'startDate' | 'cliffEndDate' | 'stepEndDate'
> & {
  startDate: Date
  cliffEndDate: Date
  stepEndDate: Date
  stepDuration: JSBI
  cliffDuration: JSBI
  steps: JSBI
}
