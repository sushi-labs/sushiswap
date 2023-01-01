import { useQuery } from '@tanstack/react-query'
import { Amount, Native, Price, Type } from '@sushiswap/currency'
import { ChainId } from '@sushiswap/chain'
import { Trade } from './types'
import { usePrices } from '../usePrices'
import { Fraction, Percent } from '@sushiswap/math'
import { calculateSlippageAmount } from '@sushiswap/amm'

interface UseTradeReturn {
  swapPrice: Price<Type, Type> | undefined
  priceImpact: number | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  gasSpent: string | undefined
  route: string[]
}

const INITIAL_DATA: UseTradeReturn = {
  swapPrice: undefined,
  priceImpact: undefined,
  amountOut: undefined,
  minAmountOut: undefined,
  gasSpent: undefined,
  route: [],
}

interface UseTrade {
  chainId: ChainId
  fromToken: Type
  toToken: Type
  amount: Amount<Type> | undefined
  gasPrice?: number
  slippagePercentage: string
}

const _hydrate = (
  { chainId, toToken, amount, slippagePercentage }: UseTrade,
  prices: Record<string, Fraction> | undefined,
  data: Trade
): UseTradeReturn => {
  if (!data || !amount) return INITIAL_DATA

  const amountOut = Amount.fromRawAmount(toToken, Math.floor(data.getBestRoute.totalAmountOut))
  const minAmountOut = Amount.fromRawAmount(
    toToken,
    calculateSlippageAmount(amountOut, new Percent(Math.floor(+slippagePercentage * 100), 10_000))[0]
  )
  const gasSpentInGwei = Amount.fromRawAmount(Native.onChain(chainId), data.getBestRoute.gasSpent * 1e9)
  const gasSpent =
    prices && gasSpentInGwei
      ? gasSpentInGwei.multiply(prices?.[Native.onChain(chainId).wrapped.address].asFraction).toFixed(2)
      : undefined

  return {
    swapPrice: new Price({ baseAmount: amount, quoteAmount: amountOut }),
    priceImpact: data.getBestRoute.priceImpact,
    amountOut,
    minAmountOut,
    gasSpent,
    route: data.getCurrentRouteHumanArray,
  }
}

export const useTrade = (variables: UseTrade) => {
  const { chainId, fromToken, toToken, amount, gasPrice = 50 } = variables
  const { data: prices } = usePrices({ chainId })

  return useQuery<unknown, unknown, UseTradeReturn>(
    ['getTrade', { chainId, fromToken, toToken, amount, gasPrice }],
    () =>
      fetch(
        `https://swap.sushi.com/?chainId=${chainId}&fromTokenId=${
          fromToken.isNative ? 'ETH' : fromToken.wrapped.address
        }&toTokenId=${
          toToken.isNative ? 'ETH' : toToken.wrapped.address
        }&amount=${amount?.quotient.toString()}&gasPrice=${gasPrice}&to=0x8f54C8c2df62c94772ac14CcFc85603742976312`
      ).then((res) => res.json()),
    {
      refetchInterval: 12000,
      staleTime: 0,
      keepPreviousData: false,
      initialData: INITIAL_DATA,
      enabled: Boolean(chainId && fromToken && toToken && amount && gasPrice),
      select: (data) => _hydrate(variables, prices, data as Trade),
    }
  )
}
