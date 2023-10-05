import { routeProcessor2Abi } from 'sushi/abi'
import { ChainId } from '@sushiswap/chain'
import { Amount, Price, type Type } from '@sushiswap/currency'
import { Percent } from 'sushi/math'
import type { Address, GetFunctionArgs } from 'viem'
import z from 'zod'

import { legValidator, tradeValidator } from './validator'

export interface UseTradeParams {
  chainId: ChainId
  fromToken: Type | undefined
  toToken: Type | undefined
  amount: Amount<Type> | undefined
  gasPrice?: bigint | null | undefined
  slippagePercentage: string
  recipient: Address | undefined
  enabled: boolean
  carbonOffset: boolean
  onError?(e: Error): void
}

export type UseTradeReturnWriteArgs =
  | GetFunctionArgs<typeof routeProcessor2Abi, 'transferValueAndprocessRoute'>['args']
  | GetFunctionArgs<typeof routeProcessor2Abi, 'processRoute'>['args']
  | undefined

export interface UseTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<Type> | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
  gasSpentUsd: string | undefined
  functionName: 'processRoute' | 'transferValueAndprocessRoute'
  writeArgs: UseTradeReturnWriteArgs
  route: TradeType['route']
  value?: bigint | undefined
}

export type UseTradeQuerySelect = (data: TradeType) => UseTradeReturn
export type TradeType = z.infer<typeof tradeValidator>
export type TradeLegType = z.infer<typeof legValidator>
