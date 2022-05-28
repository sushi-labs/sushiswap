import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'

export type CreateStreamFormData = {
  currency: Type | undefined
  startDate: string | undefined
  endDate: string | undefined
  recipient: string | undefined
  amount: string | undefined
  fundSource: FundSource | undefined
}

export type CreateStreamFormDataValidated = {
  currency: Type
  startDate: string
  endDate: string
  recipient: string
  amount: string
  fundSource: FundSource
}
