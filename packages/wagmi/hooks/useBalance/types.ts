import { Amount, Type } from '@sushiswap/currency'
import { FundSource } from '@sushiswap/hooks'

export type BalanceMap = Record<string, Record<FundSource, Amount<Type> | undefined>> | undefined
