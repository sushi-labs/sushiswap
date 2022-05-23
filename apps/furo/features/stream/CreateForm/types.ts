import { Token } from '@sushiswap/currency'
import { FundSource } from 'hooks/useFundSourceToggler'

export type CreateStreamFormData = {
  token: Token | undefined
  startDate: string | undefined
  endDate: string | undefined
  recipient: string | undefined
  amount: string | undefined
  fundSource: FundSource | undefined
}

export type CreateStreamFormDataValidated = {
  token: Token
  startDate: string
  endDate: string
  recipient: string
  amount: string
  fundSource: FundSource
}

export type CreateStreamFormDataTransformed = Omit<CreateStreamFormDataValidated, 'startDate' | 'endDate'> & {
  startDate: Date
  endDate: Date
}
