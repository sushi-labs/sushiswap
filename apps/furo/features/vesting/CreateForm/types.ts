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
  startDate: string | ''
  recipient: string | ''
  cliffEndDate: string | ''
  cliffAmount: number | ''
  stepPayouts: number | ''
  stepAmount: number | ''
  fundSource: FundSource | undefined
}

export type CreateVestingFormDataValidated = {
  token: Token
  cliff: boolean
  startDate: string
  recipient: string
  cliffEndDate: string | undefined
  cliffAmount: number | undefined
  stepPayouts: number
  stepAmount: number
  stepConfig: StepConfig
  fundSource: FundSource
}

export type CreateVestingFormDataTransformed = Omit<
  CreateVestingFormDataValidated,
  'startDate' | 'cliffEndDate' | 'stepEndDate'
> & {
  startDate: Date
  cliffEndDate: Date | undefined
  cliffDuration: JSBI
}
