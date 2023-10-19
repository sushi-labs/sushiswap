import { FundSource } from '@sushiswap/hooks'
import { Amount, Type } from 'sushi/currency'

export type BalanceMap =
  | Record<string, Record<FundSource, Amount<Type> | undefined>>
  | undefined
