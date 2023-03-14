import { BigNumber } from "@ethersproject/bignumber"
import { ChainId } from '@sushiswap/chain'
import { Amount, Price, Type } from '@sushiswap/currency'
import {Percent} from "@sushiswap/math";
import { HexString } from '@sushiswap/types'
import z from 'zod'

import {legValidator, tradeValidator} from './validator'

export interface UseTradeParams {
  chainId: ChainId
  fromToken: Type | undefined
  toToken: Type | undefined
  amount: Amount<Type> | undefined
  gasPrice?: number
  slippagePercentage: string
  recipient: string | undefined
  enabled: boolean
  carbonOffset: boolean
  onError?(e: Error): void
}

export type UseTradeReturnWriteArgs = [HexString, BigNumber, HexString, BigNumber, HexString, BigNumber, HexString, HexString] | [HexString, BigNumber, HexString, BigNumber, HexString, HexString] | undefined

export interface UseTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<Type> | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
  functionName: 'processRoute' | 'transferValueAndprocessRoute'
  writeArgs: UseTradeReturnWriteArgs
  route: TradeType['route']
  overrides: { value: BigNumber} | undefined
}

export type UseTradeQuerySelect = (data: TradeType) => UseTradeReturn
export type TradeType = z.infer<typeof tradeValidator>
export type TradeLegType = z.infer<typeof legValidator>
