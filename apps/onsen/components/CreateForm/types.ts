import { Currency } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'

export type CreateIncentiveFormData = {
  currency: Currency | undefined
  startDate: string | undefined
  endDate: string | undefined
  stakeTokenAddress: string | undefined
  amount: string
  fundSource: FundSource | undefined
}

export type CreateIncentiveFormDataValidated = {
  currency: Currency
  startDate: string
  endDate: string
  stakeTokenAddress: string
  amount: string
  fundSource: FundSource
}
