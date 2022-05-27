import { Token } from '@sushiswap/currency'
import { FundSource } from 'hooks/useFundSourceToggler'

export type CreateIncentiveFormData = {
  token: Token | undefined
  startDate: string | undefined
  endDate: string | undefined
  recipient: string | undefined
  amount: string | undefined
  fundSource: FundSource | undefined
}

export type CreateIncentiveFormDataValidated = {
  token: Token
  startDate: string
  endDate: string
  recipient: string
  amount: string
  fundSource: FundSource
}
