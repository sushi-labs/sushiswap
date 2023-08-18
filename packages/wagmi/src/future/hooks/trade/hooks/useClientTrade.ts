import { calculateSlippageAmount } from '@sushiswap/amm'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Price, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { Percent } from '@sushiswap/math'
import { usePrice, UseTradeParams, UseTradeReturnWriteArgs } from '@sushiswap/react-query'
import {
  isRouteProcessor3ChainId,
  isRouteProcessorChainId,
  routeProcessor3Address,
  routeProcessorAddress,
} from '@sushiswap/route-processor'
import { Router } from '@sushiswap/router'
import { HexString } from '@sushiswap/types'
import { useQuery } from '@tanstack/react-query'
import { useFeeData } from 'wagmi'

import { usePoolsCodeMap } from '../../pools'

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

  // console.debug('fee data', feeData)

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
      if (
        !poolsCodeMap ||
        (!isRouteProcessorChainId(chainId) && !isRouteProcessor3ChainId(chainId)) ||
        !fromToken ||
        !amount ||
        !toToken ||
        !feeData?.gasPrice
      )
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
          value: undefined,
        }

      const route = Router.findSpecialRoute(
        poolsCodeMap,
        chainId,
        fromToken,
        amount.quotient,
        toToken,
        Number(feeData.gasPrice),
        1 // 5% impact before dex aggregation
      )

      const logPools = Array.from(poolsCodeMap.values())
        .map((pc) => `* ${pc.liquidityProvider}/${pc.pool.token0.symbol}/${pc.pool.token1.symbol}-${pc.pool.fee}\n`)
        .join('')
      console.debug(`
Pools found ${poolsCodeMap.size}: 
${logPools}
`)

      // const route = Router.findSushiRoute(
      //   poolsCodeMap,
      //   chainId,
      //   fromToken,
      //   BigNumber.from(amount.quotient.toString()),
      //   toToken,
      //   feeData.gasPrice.toNumber()
      // )

      let args = undefined

      if (recipient) {
        if (isRouteProcessor3ChainId(chainId)) {
          args = Router.routeProcessor2Params(
            poolsCodeMap,
            route,
            fromToken,
            toToken,
            recipient,
            routeProcessor3Address[chainId],
            [],
            +slippagePercentage / 100
          )
        } else if (isRouteProcessorChainId(chainId)) {
          args = Router.routeProcessorParams(
            poolsCodeMap,
            route,
            fromToken,
            toToken,
            recipient,
            routeProcessorAddress[chainId],
            +slippagePercentage / 100
          )
        }
      }

      if (route) {
        const amountIn = Amount.fromRawAmount(fromToken, route.amountInBI.toString())
        const amountOut = Amount.fromRawAmount(toToken, route.amountOutBI.toString())
        const isOffset = chainId === ChainId.POLYGON && carbonOffset

        // let writeArgs: UseTradeReturnWriteArgs = args
        let writeArgs: UseTradeReturnWriteArgs = args
          ? [
              args.tokenIn as HexString,
              args.amountIn,
              args.tokenOut as HexString,
              args.amountOutMin,
              args.to as HexString,
              args.routeCode as HexString,
            ]
          : undefined

        // const overrides = fromToken.isNative && writeArgs?.[1] ? { value: BigNumber.from(writeArgs?.[1]) } : undefined
        let value = fromToken.isNative && writeArgs?.[1] ? writeArgs?.[1] : undefined

        if (writeArgs && isOffset && chainId === ChainId.POLYGON) {
          writeArgs = ['0xbc4a6be1285893630d45c881c6c343a65fdbe278', 20000000000000000n, ...writeArgs]
          value = (fromToken.isNative ? writeArgs[3] : 0n) + 20000000000000000n
        }

        return new Promise((res) =>
          setTimeout(
            () =>
              res({
                swapPrice: amountOut.greaterThan(0n)
                  ? new Price({
                      baseAmount: amount,
                      quoteAmount: amountOut,
                    })
                  : undefined,
                priceImpact: route.priceImpact
                  ? new Percent(BigInt(Math.round(route.priceImpact * 10000)), 10000n)
                  : new Percent(0),
                amountIn,
                amountOut,
                minAmountOut: writeArgs?.[3]
                  ? Amount.fromRawAmount(toToken, writeArgs[3].toString())
                  : Amount.fromRawAmount(
                      toToken,
                      calculateSlippageAmount(amountOut, new Percent(Math.floor(0.5 * 100), 10_000))[0]
                    ),
                gasSpent:
                  price && feeData.gasPrice
                    ? Amount.fromRawAmount(
                        Native.onChain(chainId),
                        feeData.gasPrice * BigInt(route.gasSpent * 1.2)
                      ).toSignificant(4)
                    : undefined,
                // gasSpentUsd:
                //   price && feeData.gasPrice
                //     ? Amount.fromRawAmount(
                //         Native.onChain(chainId),
                //         JSBI.multiply(JSBI.BigInt(feeData.gasPrice), JSBI.BigInt(route.gasSpent * 1.2))
                //       )
                //         .multiply(price.asFraction)
                //         .toSignificant(4)
                //     : undefined,
                route,
                functionName: isOffset ? 'transferValueAndprocessRoute' : 'processRoute',
                writeArgs,
                value,
              }),
            250
          )
        )
      }
    },
    refetchInterval: 10000,
    enabled: Boolean(enabled && poolsCodeMap && feeData && fromToken && toToken && chainId),
  })
}
