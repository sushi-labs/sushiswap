import { Amount, Currency, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'

export type CreateStreamFormData = {
  currency: Type | undefined
  startDate: string | undefined
  endDate: string | undefined
  recipient: string | undefined
  amount: string
  fundSource: FundSource
}

export type CreateStreamFormDataValidated = {
  currency: Currency
  startDate: string
  endDate: string
  recipient: string
  amount: string
  fundSource: FundSource
}

export type CreateMultipleStreamFormData = {
  streams: CreateStreamFormData[]
}

export type CreateStreamFormDataTransformed = Omit<
  CreateStreamFormDataValidated,
  'startDate' | 'endDate' | 'amount'
> & {
  startDate: Date
  endDate: Date
  amount: Amount<Type> | undefined
}
