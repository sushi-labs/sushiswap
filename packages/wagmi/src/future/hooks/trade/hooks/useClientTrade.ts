import { useQuery } from '@tanstack/react-query'
import { usePoolsCodeMap } from '../../pools'
import { useFeeData } from 'wagmi'
import { ChainId } from '@sushiswap/chain'
import { Amount, Native, Price, WNATIVE_ADDRESS } from '@sushiswap/currency'
import { usePrice, UseTradeParams, UseTradeReturnWriteArgs } from '@sushiswap/react-query'
import { JSBI, Percent, ZERO } from '@sushiswap/math'
import { BigNumber } from 'ethers'
import { LiquidityProviders, Router } from '@sushiswap/router'
import {
  isRouteProcessor3ChainId,
  isRouteProcessorChainId,
  routeProcessor3Address,
  routeProcessorAddress,
} from '@sushiswap/route-processor'
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
      console.log('useClientTrade')

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
          overrides: undefined,
        }

      console.log('useClientTrade 2')

      const route = Router.findSpecialRoute(
        poolsCodeMap,
        chainId,
        fromToken,
        BigNumber.from(amount.quotient.toString()),
        toToken,
        feeData.gasPrice.toNumber(),
        1 // 1% impact before dex aggregation
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

      console.log({ recipient })

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
        const amountIn = Amount.fromRawAmount(fromToken, route.amountInBN.toString())
        const amountOut = Amount.fromRawAmount(toToken, route.amountOutBN.toString())
        const isOffset = chainId === ChainId.POLYGON && carbonOffset

        // let writeArgs: UseTradeReturnWriteArgs = args
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

        // const overrides = fromToken.isNative && writeArgs?.[1] ? { value: BigNumber.from(writeArgs?.[1]) } : undefined
        let overrides = fromToken.isNative && writeArgs?.[1] ? { value: BigNumber.from(writeArgs?.[1]) } : undefined

        if (writeArgs && isOffset && chainId === ChainId.POLYGON) {
          writeArgs = ['0xbc4a6be1285893630d45c881c6c343a65fdbe278', BigNumber.from('20000000000000000'), ...writeArgs]
          overrides = {
            value: BigNumber.from(fromToken.isNative ? writeArgs[3] : '0').add(BigNumber.from('20000000000000000')),
          }
        }

        return new Promise((res) =>
          setTimeout(
            () =>
              res({
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
                gasSpent:
                  price && feeData.gasPrice
                    ? Amount.fromRawAmount(
                        Native.onChain(chainId),
                        JSBI.multiply(JSBI.BigInt(feeData.gasPrice), JSBI.BigInt(route.gasSpent * 1.2))
                      )
                        .multiply(price.asFraction)
                        .toSignificant(4)
                    : undefined,
                route,
                functionName: isOffset ? 'transferValueAndprocessRoute' : 'processRoute',
                // functionName: 'processRoute',
                writeArgs,
                overrides,
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
