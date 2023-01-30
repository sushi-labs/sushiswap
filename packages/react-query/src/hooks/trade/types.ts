import { BigNumber } from "@ethersproject/bignumber"
import { ChainId } from '@sushiswap/chain'
import { Amount, Price, Type } from '@sushiswap/currency'
import {Percent} from "@sushiswap/math";
import { HexString } from '@sushiswap/types'
import z from 'zod'

import {legValidator, tradeValidator} from './validator'

export interface UseTradeParams {
  chainId: ChainId
  fromToken: Type
  toToken: Type
  amount: Amount<Type> | undefined
  gasPrice?: number
  slippagePercentage: string
  recipient: string | undefined
  enabled: boolean
}

export interface UseTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<Type> | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
  writeArgs: [HexString, BigNumber, HexString, BigNumber, HexString, HexString] | undefined
  route: TradeType['getBestRoute']
  currentRouteHumanString: string
}

export type UseTradeQuerySelect = (data: TradeType) => UseTradeReturn
export type TradeType = z.infer<typeof tradeValidator>
export type TradeLegType = z.infer<typeof legValidator>
