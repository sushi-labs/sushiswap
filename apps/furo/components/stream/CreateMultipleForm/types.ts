import { Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'

export type StreamData = {
  currency: Type | undefined
  startDate: string | undefined
  endDate: string | undefined
  recipient: string | undefined
  amount: string | undefined
  fundSource: FundSource | undefined
}

export type CreateStreamFormData = {
  streams: StreamData[]
}
