import { Currency } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'

export type CreateStreamFormData = {
  currency: Currency | undefined
  startDate: string | undefined
  endDate: string | undefined
  recipient: string | undefined
  amount: string | undefined
  fundSource: FundSource | undefined
}

export type CreateStreamFormDataValidated = {
  currency: Currency
  startDate: string
  endDate: string
  recipient: string
  amount: string
  fundSource: FundSource
}
