import { useQuery } from '@tanstack/react-query'
import { usePoolsCodeMap } from '../../pools'
import { useFeeData } from 'wagmi'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Price, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { usePrice, UseTradeParams, UseTradeReturnWriteArgs } from '@sushiswap/react-query'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { BigNumber } from 'ethers'
import { LiquidityProviders, Router } from '@sushiswap/router'
import { isRouteProcessor2ChainId, isRouteProcessorChainId, routeProcessor2Address, routeProcessorAddress } from '@sushiswap/route-processor'
import { HexString } from '@sushiswap/types'
import { calculateSlippageAmount } from '@sushiswap/amm'

export const useClientTrade = (variables: UseTradeParams) => {
  const { chainId, fromToken, toToken, slippagePercentage, carbonOffset, amount, enabled, recipient } = variables

  const { data: feeData } = useFeeData({ chainId, enabled })
  const { data: price } = usePrice({ chainId, address: WNATIVE_ADDRESS[chainId] })
  const { data: poolsCodeMap } = usePoolsCodeMap({
    chainId,
    currencyA: fromToken,
    currencyB: toToken,
    enabled,
    withBentoPools: true,
  })

  return useQuery({
    queryKey: [
      'useClientTrade',
      {
        chainId,
        currencyA: fromToken,
        currencyB: toToken,
        amount,
        slippagePercentage,
        recipient,
        poolsCodeMap,
      },
    ],
    queryFn: async () => {
      if (!poolsCodeMap || !isRouteProcessor2ChainId(chainId) || !fromToken || !amount || !toToken || !feeData?.gasPrice)
        return {
          abi: undefined,
          address: undefined,
          swapPrice: undefined,
          priceImpact: undefined,
          amountIn: undefined,
          amountOut: undefined,
          minAmountOut: undefined,
          gasSpent: undefined,
          writeArgs: undefined,
          route: undefined,
          functionName: 'processRoute',
          overrides: undefined,
        }

      // const route = Router.findSushiRoute(
      //   poolsCodeMap,
      //   chainId,
      //   fromToken,
      //   BigNumber.from(amount.quotient.toString()),
      //   toToken,
      //   feeData.gasPrice.toNumber()
      // )
      
      const route = Router.findBestRoute(
        poolsCodeMap,
        chainId,
        fromToken,
        BigNumber.from(amount.quotient.toString()),
        toToken,
        feeData.gasPrice.toNumber(),
        [LiquidityProviders.UniswapV3, LiquidityProviders.NativeWrap],
      )

      let args = undefined
      if (recipient) {
        args = Router.routeProcessor2Params(
          poolsCodeMap,
          route,
          fromToken,
          toToken,
          recipient,
          routeProcessor2Address[42161],
          +slippagePercentage / 100
        )
      }

      if (route) {
        const amountIn = Amount.fromRawAmount(fromToken, route.amountInBN.toString())
        const amountOut = Amount.fromRawAmount(toToken, route.amountOutBN.toString())
        const isOffset = chainId === ChainId.POLYGON && carbonOffset

        let writeArgs: UseTradeReturnWriteArgs = args
          ? [
              args.tokenIn as HexString,
              BigNumber.from(args.amountIn),
              args.tokenOut as HexString,
              BigNumber.from(args.amountOutMin),
              args.to as HexString,
              args.routeCode as HexString,
            ]
          : undefined

        let overrides = fromToken.isNative && writeArgs?.[1] ? { value: BigNumber.from(writeArgs?.[1]) } : undefined

        if (writeArgs && isOffset && chainId === ChainId.POLYGON) {
          writeArgs = ['0xbc4a6be1285893630d45c881c6c343a65fdbe278', BigNumber.from('20000000000000000'), ...writeArgs]
          overrides = {
            value: BigNumber.from(fromToken.isNative ? writeArgs[3] : '0').add(BigNumber.from('20000000000000000')),
          }
        }

        return {
          swapPrice: amountOut.greaterThan(ZERO)
            ? new Price({
                baseAmount: amount,
                quoteAmount: amountOut,
              })
            : undefined,
          priceImpact: route.priceImpact
            ? new Percent(JSBI.BigInt(Math.round(route.priceImpact * 10000)), JSBI.BigInt(10000))
            : new Percent(0),
          amountIn,
          amountOut,
          minAmountOut: writeArgs?.[3]
            ? Amount.fromRawAmount(toToken, writeArgs[3].toString())
            : Amount.fromRawAmount(
                toToken,
                calculateSlippageAmount(amountOut, new Percent(Math.floor(0.5 * 100), 10_000))[0]
              ),
          gasSpent: price
            ? Amount.fromRawAmount(Native.onChain(chainId), route.gasSpent * 1e9)
                .multiply(price.asFraction)
                .toSignificant(4)
            : undefined,
          route,
          functionName: isOffset ? 'transferValueAndprocessRoute' : 'processRoute',
          writeArgs,
          overrides,
        }
      }
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && poolsCodeMap && feeData && fromToken && toToken && chainId),
  })
}
