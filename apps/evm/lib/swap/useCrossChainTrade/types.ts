import { Amount, Price, Type } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import { SushiXSwapChainId } from '@sushiswap/sushixswap'
import { Address, Signature } from 'viem'

import { Action } from '../SushiXSwap'

export interface UseCrossChainTradeParams {
  tradeId: string
  network0: SushiXSwapChainId
  network1: SushiXSwapChainId
  token0: Type | undefined
  token1: Type | undefined
  amount: Amount<Type> | undefined
  slippagePercentage: string
  recipient: Address | undefined
  enabled: boolean
  bentoboxSignature?: Signature
}

export type UseCrossChainSelect = Omit<
  UseCrossChainTradeReturn,
  'priceImpact' | 'amountIn' | 'amountOut' | 'minAmountOut' | 'swapPrice'
> & {
  priceImpact: [string, string] | undefined
  amountIn: string | undefined
  amountOut: string | undefined
  minAmountOut: string | undefined
}

export interface UseCrossChainTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: Percent | undefined
  amountIn: Amount<Type> | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
  gasSpentUsd: string | undefined
  functionName: 'cook'
  writeArgs: [Action[], bigint[], `0x${string}`[]] | undefined
  route: { status: string }
  value?: bigint | undefined
}

export type UseCrossChainTradeQuerySelect = (data: UseCrossChainSelect) => UseCrossChainTradeReturn
