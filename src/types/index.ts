import { BigNumber } from '@ethersproject/bignumber'
import { Currency, CurrencyAmount, Token, Trade as LegacyTrade, TradeType } from '@sushiswap/core-sdk'
import { PoolState, Trade } from '@sushiswap/trident-sdk'

export type TradeUnion =
  | Trade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>
  | LegacyTrade<Currency, Currency, TradeType.EXACT_INPUT | TradeType.EXACT_OUTPUT>

export type PoolWithStateExists<T> = {
  state: PoolState.EXISTS
  pool: T
}

export type PoolWithStateLoading = {
  state: PoolState.LOADING
  pool?: undefined
}

export type PoolWithStateNotExists = {
  state: PoolState.NOT_EXISTS
  pool?: undefined
}

export type PoolWithStateInvalid = {
  state: PoolState.INVALID
  pool?: undefined
}

export type PoolWithState<T> =
  | PoolWithStateExists<T>
  | PoolWithStateLoading
  | PoolWithStateNotExists
  | PoolWithStateInvalid

export type MethodArg = string | number | BigNumber
export type MethodArgs = Array<MethodArg | MethodArg[]>

export type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined

export type TokenAddress = string

export type TokenBalancesMap = Record<TokenAddress, CurrencyAmount<Token> | undefined>
