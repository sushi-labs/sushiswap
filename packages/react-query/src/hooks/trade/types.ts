import { Amount, Price, Type } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { tradeValidator } from './validator'
import z from 'zod'

export interface UseTradeParams {
  chainId: ChainId
  fromToken: Type
  toToken: Type
  amount: Amount<Type> | undefined
  gasPrice?: number
  slippagePercentage: string
  blockNumber: number | undefined
  recipient: string | undefined
}

export interface UseTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: number | undefined
  amountIn: Amount<Type> | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
  writeArgs: [string, { type: string; hex: string }, string, { type: string; hex: string }, string, string] | undefined
  route: string[]
}

export type UseTradeQuerySelect = (data: TradeType) => UseTradeReturn
export type TradeType = z.infer<typeof tradeValidator>
