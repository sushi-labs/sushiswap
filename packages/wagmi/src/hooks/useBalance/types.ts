import { Amount, Type } from 'sushi/currency'
import { FundSource } from '@sushiswap/hooks'

export type BalanceMap =
  | Record<string, Record<FundSource, Amount<Type> | undefined>>
  | undefined
