import {
  routeProcessor2Abi_processRoute,
  routeProcessor2Abi_transferValueAndprocessRoute,
} from 'sushi/abi'
import { ChainId } from 'sushi/chain'
import { Amount, Price, type Type } from 'sushi/currency'
import { Percent } from 'sushi/math'
import { RouterLiquiditySource } from 'sushi/router'
import type { Address, WriteContractParameters } from 'viem'
import z from 'zod'
import { legValidator, tradeValidator01 } from './validator01'
import { tradeValidator02 } from './validator02'
import { routeValidator, tradeValidator03 } from './validator03'

export interface UseTradeParams {
  chainId: ChainId
  fromToken: Type | undefined
  toToken: Type | undefined
  amount: Amount<Type> | undefined
  gasPrice?: bigint | null | undefined
  slippagePercentage: string
  recipient: Address | undefined
  source?: RouterLiquiditySource
  enabled: boolean
  carbonOffset: boolean
  onError?(e: Error): void
  tokenTax?: Percent | false | undefined
}

export type UseTradeReturnWriteArgs =
  | WriteContractParameters<
      typeof routeProcessor2Abi_transferValueAndprocessRoute,
      'transferValueAndprocessRoute'
    >['args']
  | WriteContractParameters<
      typeof routeProcessor2Abi_processRoute,
      'processRoute'
    >['args']
  | undefined

export interface UseTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<Type> | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
  gasSpentUsd: string | undefined
  route: Route | undefined
  tx:
    | {
        from: Address
        to: Address
        data: string
        value?: bigint | undefined
      }
    | undefined
  tokenTax: Percent | false | undefined
  fee: string | undefined
}

export type UseTradeQuerySelect = (data: TradeType3Return) => UseTradeReturn
export type TradeType1 = z.infer<typeof tradeValidator01>
export type TradeType2 = z.infer<typeof tradeValidator02>
export type TradeType3 = z.infer<typeof tradeValidator03>
export type TradeType3Return = z.infer<typeof tradeValidator03> & {
  tokenFrom: Type
  tokenTo: Type
}
export type TradeLegType = z.infer<typeof legValidator>
export type Route = z.infer<typeof routeValidator>

