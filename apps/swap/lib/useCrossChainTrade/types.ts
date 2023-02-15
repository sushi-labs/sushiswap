import { ChainId } from '@sushiswap/chain'
import { Amount, Price, Type } from '@sushiswap/currency'
import { HexString } from '@sushiswap/types'
import { Percent } from '@sushiswap/math'
import { BigNumber } from '@ethersproject/bignumber'
import { Action } from '../SushiXSwap'
import { TradeType } from '@sushiswap/react-query'

export interface UseCrossChainTradeParams {
  network0: ChainId
  network1: ChainId
  token0: Type
  token1: Type
  amount: Amount<Type> | undefined
  slippagePercentage: string
  recipient: string | undefined
  enabled: boolean
}

export type UseCrossChainSelect = Omit<
  UseCrossChainTradeReturn,
  'priceImpact' | 'amountIn' | 'amountOut' | 'minAmountOut' | 'swapPrice'
> & {
  priceImpact: string | undefined
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
  functionName: 'cook'
  writeArgs: [Action[], BigNumber[], `0x${string}`[]] | undefined
  route: TradeType['getBestRoute']
  currentRouteHumanString: string
  overrides: { value: BigNumber } | undefined
}

export type UseCrossChainTradeQuerySelect = (data: UseCrossChainSelect) => UseCrossChainTradeReturn
