import {BigNumber} from '@ethersproject/bignumber'
import {calculateSlippageAmount} from '@sushiswap/amm'
import {ChainId} from "@sushiswap/chain";
import {Amount, Native, nativeCurrencyIds, Price, WNATIVE_ADDRESS} from '@sushiswap/currency'
import {JSBI, Percent, ZERO} from '@sushiswap/math'
import {HexString} from '@sushiswap/types'
import {useQuery} from '@tanstack/react-query'
import {useCallback} from 'react'

import {usePrice} from '../prices'
import {UseTradeParams, UseTradeQuerySelect, UseTradeReturnWriteArgs} from './types'
import {tradeValidator} from './validator'

export const useTradeQuery = (
  { chainId, fromToken, toToken, amount, gasPrice = 50, recipient, enabled }: UseTradeParams,
  select: UseTradeQuerySelect
) => {
    return useQuery({
        queryKey: ['NoCache', 'getTrade', {chainId, fromToken, toToken, amount, gasPrice, recipient}],
        queryFn: async () => {
            const res = await (
                await fetch(
                    `${
                        process.env.NEXT_PUBLIC_SWAP_API_V0_BASE_URL || 'https://swap.sushi.com/v0'
                    }?chainId=${chainId}&fromTokenId=${
                        fromToken?.isNative ? nativeCurrencyIds[chainId] : fromToken?.wrapped.address
                    }&toTokenId=${
                        toToken?.isNative ? nativeCurrencyIds[chainId] : toToken?.wrapped.address
                    }&amount=${amount?.quotient.toString()}&gasPrice=${gasPrice}${recipient ? `&to=${recipient}` : ''}`
                )
            ).json()

            return tradeValidator.parse(res)
        },
        refetchOnWindowFocus: true,
        refetchInterval: 10000,
        keepPreviousData: !!amount,
        cacheTime: 0,
        select,
        enabled: enabled && Boolean(chainId && fromToken && toToken && amount && gasPrice),
    })
}

export const useTrade = (variables: UseTradeParams) => {
  const { chainId, fromToken, toToken, amount, slippagePercentage, carbonOffset } = variables
  const { data: price } = usePrice({ chainId, address: WNATIVE_ADDRESS[chainId] })

  const select: UseTradeQuerySelect = useCallback(
    (data) => {
      if (data && amount && data.getBestRoute && fromToken && toToken) {
          const amountIn = Amount.fromRawAmount(fromToken, data.getBestRoute.amountInBN)
          const amountOut = Amount.fromRawAmount(toToken, data.getBestRoute.amountOutBN)
          const isOffset = chainId === ChainId.POLYGON && carbonOffset

          let writeArgs: UseTradeReturnWriteArgs = data?.getCurrentRouteRPParams
              ? [
                  data.getCurrentRouteRPParams.tokenIn as HexString,
                  BigNumber.from(data.getCurrentRouteRPParams.amountIn),
                  data.getCurrentRouteRPParams.tokenOut as HexString,
                  BigNumber.from(data.getCurrentRouteRPParams.amountOutMin),
                  data.getCurrentRouteRPParams.to as HexString,
                  data.getCurrentRouteRPParams.routeCode as HexString,
              ]
              : undefined
          let overrides = fromToken.isNative && writeArgs?.[1] ? { value: BigNumber.from(writeArgs?.[1]) } : undefined

          if (writeArgs && isOffset && chainId === ChainId.POLYGON) {
              writeArgs = ['0xbc4a6be1285893630d45c881c6c343a65fdbe278', BigNumber.from('20000000000000000'), ...writeArgs]
              overrides = { value: BigNumber.from(fromToken.isNative ? writeArgs[3] : '0').add(BigNumber.from('20000000000000000')) }
          }

          return {
              swapPrice: amountOut.greaterThan(ZERO) ? new Price({
                  baseAmount: amount,
                  quoteAmount: amountOut
              }) : undefined,
              priceImpact: new Percent(JSBI.BigInt(Math.round(data.getBestRoute.priceImpact * 10000)), JSBI.BigInt(10000)),
              amountIn,
              amountOut,
              minAmountOut: Amount.fromRawAmount(
                  toToken,
                  calculateSlippageAmount(amountOut, new Percent(Math.floor(+slippagePercentage * 100), 10_000))[0]
              ),
              gasSpent: price
                  ? Amount.fromRawAmount(Native.onChain(chainId), data.getBestRoute.gasSpent * 1e9)
                      .multiply(price.asFraction)
                      .toSignificant(4)
                  : undefined,
              route: data.getBestRoute,
              currentRouteHumanString: data?.getCurrentRouteHumanString,
              functionName: isOffset ? 'transferValueAndprocessRoute' : 'processRoute',
              writeArgs,
              overrides
          }
      }

        return {
            swapPrice: undefined,
            priceImpact: undefined,
            amountIn: undefined,
            amountOut: undefined,
            minAmountOut: undefined,
            gasSpent: undefined,
            writeArgs: undefined,
            route: undefined,
            functionName: 'processRoute',
            currentRouteHumanString: '',
            overrides: undefined
        }
    },
    [carbonOffset, amount, chainId, fromToken, price, slippagePercentage, toToken]
  )

  return useTradeQuery(variables, select)
}
