import { useQuery } from '@tanstack/react-query'
import { Amount, Native, nativeCurrencyIds, Price } from '@sushiswap/currency'
import { UseTradeParams, UseTradeQuerySelect } from './types'
import { Percent, ZERO } from '@sushiswap/math'
import { calculateSlippageAmount } from '@sushiswap/amm'
import { tradeValidator } from './validator'
import { useCallback } from 'react'
import { usePrice } from '../prices'

export const useTradeQuery = (
  { chainId, fromToken, toToken, amount, gasPrice = 50, blockNumber, recipient }: UseTradeParams,
  select: UseTradeQuerySelect
) =>
  useQuery({
    queryKey: ['getTrade', { chainId, fromToken, toToken, amount, gasPrice, blockNumber, recipient }],
    queryFn: async () => {
      const res = await (
        await fetch(
          `${
            process.env.NEXT_PUBLIC_SWAP_API_V0_BASE_URL || 'https://swap.sushi.com/v0'
          }?chainId=${chainId}&fromTokenId=${
            fromToken.isNative ? nativeCurrencyIds[chainId] : fromToken.wrapped.address
          }&toTokenId=${
            toToken.isNative ? nativeCurrencyIds[chainId] : toToken.wrapped.address
          }&amount=${amount?.quotient.toString()}&gasPrice=${gasPrice}${recipient ? `&to=${recipient}` : ''}`
        )
      ).json()
      return tradeValidator.parse(res)
    },
    keepPreviousData: !!amount,
    select,
    enabled: Boolean(chainId && fromToken && toToken && amount && gasPrice && blockNumber),
  })

export const useTrade = (variables: UseTradeParams) => {
  const { chainId, fromToken, toToken, amount, slippagePercentage } = variables
  const { data: price } = usePrice({ chainId, address: Native.onChain(chainId).wrapped.address })

  const select: UseTradeQuerySelect = useCallback(
    (data) => {
      if (!data || !amount) {
        return {
          swapPrice: undefined,
          priceImpact: undefined,
          amountIn: undefined,
          amountOut: undefined,
          minAmountOut: undefined,
          gasSpent: undefined,
          writeArgs: undefined,
          route: [],
        }
      }

      const amountIn = Amount.fromRawAmount(fromToken, data.getBestRoute.amountInBN)
      const amountOut = Amount.fromRawAmount(toToken, data.getBestRoute.amountOutBN)

      return {
        swapPrice: amountOut.greaterThan(ZERO) ? new Price({ baseAmount: amount, quoteAmount: amountOut }) : undefined,
        priceImpact: data.getBestRoute.priceImpact,
        amountIn,
        amountOut,
        minAmountOut: Amount.fromRawAmount(
          toToken,
          calculateSlippageAmount(amountOut, new Percent(Math.floor(+slippagePercentage * 100), 10_000))[0]
        ),
        // TODO: all prices for just gasSpent? refactor for single price retrieval...
        gasSpent: price
          ? Amount.fromRawAmount(Native.onChain(chainId), data.getBestRoute.gasSpent * 1e9)
              .multiply(price.asFraction)
              .toSignificant(4)
          : undefined,
        route: data.getCurrentRouteHumanArray,
        writeArgs: data?.getCurrentRouteRPParams
          ? [
              data.getCurrentRouteRPParams.tokenIn,
              data.getCurrentRouteRPParams.amountIn,
              data.getCurrentRouteRPParams.tokenOut,
              data.getCurrentRouteRPParams.amountOutMin,
              data.getCurrentRouteRPParams.to,
              data.getCurrentRouteRPParams.routeCode,
            ]
          : undefined,
      }
    },
    [amount, chainId, fromToken, price, slippagePercentage, toToken]
  )

  return useTradeQuery(variables, select)
}
