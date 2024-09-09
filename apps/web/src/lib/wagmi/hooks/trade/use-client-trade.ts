import { UseQueryResult, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { type UseTradeParams, UseTradeReturn } from 'src/lib/hooks/react-query'
import { getBigInt } from 'sushi'
import { calculateFee } from 'sushi/calculate'
import {
  ROUTE_PROCESSOR_5_ADDRESS,
  TOKEN_CHOMPER_ADDRESS,
  isRouteProcessor5ChainId,
  isTokenChomperChainId,
  isWNativeSupported,
} from 'sushi/config'
import { Amount, Native, Price } from 'sushi/currency'
import { Fraction, Percent } from 'sushi/math'
import {
  ProcessFunction,
  type Router,
  RouterLiquiditySource,
  isLsd,
  isStable,
  isWrapOrUnwrap,
} from 'sushi/router'
import { stringify, zeroAddress } from 'viem'
import { useGasPrice } from 'wagmi'
import { usePrice } from '~evm/_common/ui/price-provider/price-provider/use-price'
import { usePoolsCodeMap } from '../pools/hooks/usePoolsCodeMap'

export const useClientTrade = (
  variables: UseTradeParams,
): UseQueryResult<UseTradeReturn> => {
  const {
    chainId,
    fromToken,
    toToken,
    slippagePercentage,
    amount,
    enabled,
    recipient,
    source,
    tokenTax,
  } = variables

  const [router, setRouter] = useState<typeof Router | undefined>()

  const { data: gasPrice } = useGasPrice({
    chainId,
    query: { enabled },
  })

  const { data: _price } = usePrice({
    chainId,
    address: Native.onChain(chainId).wrapped.address,
    enabled: isWNativeSupported(chainId),
  })

  const price = useMemo(() => {
    return Native.onChain(chainId).wrapped.address === zeroAddress
      ? new Fraction(0)
      : _price
  }, [_price, chainId])

  const { data: tokenOutPrice } = usePrice({
    chainId,
    address: toToken?.wrapped.address,
  })

  const { data: poolsCodeMap } = usePoolsCodeMap({
    chainId,
    currencyA: fromToken,
    currencyB: toToken,
    enabled,
    withBentoPools: true,
  })

  useEffect(() => {
    if (enabled && !router) {
      const fetchRouter = async () => {
        const Router = (
          await import(/* webpackExports: "Router" */ 'sushi/router')
        ).Router
        setRouter(() => Router)
      }

      fetchRouter()
    }
  }, [router, enabled])

  return useQuery({
    queryKey: [
      'useClientTrade',
      {
        chainId,
        currencyA: fromToken,
        currencyB: toToken,
        amount,
        slippagePercentage,
        gasPrice,
        recipient,
        source,
        poolsCodeMap,
        tokenTax,
        router: !!router,
      },
    ],
    queryFn: async () => {
      if (
        poolsCodeMap &&
        isRouteProcessor5ChainId(chainId) &&
        fromToken &&
        amount &&
        toToken &&
        gasPrice &&
        router
      ) {
        const route = router.findSpecialRoute(
          poolsCodeMap,
          chainId,
          fromToken,
          amount.quotient,
          toToken,
          Number(gasPrice),
          1, // 5% impact before dex aggregation
        )

        const maxSlippage = +slippagePercentage / 100

        const chargeFee =
          !isWrapOrUnwrap({ fromToken, toToken }) &&
          !isStable({ fromToken, toToken }) &&
          !isLsd({ fromToken, toToken })

        const minAmountOut = Amount.fromRawAmount(
          toToken,
          (route.amountOutBI * getBigInt((1 - maxSlippage) * 1_000_000)) /
            1_000_000n,
        )

        const args = recipient
          ? router.routeProcessor5Params(
              poolsCodeMap,
              route,
              fromToken,
              toToken,
              recipient,
              ROUTE_PROCESSOR_5_ADDRESS[chainId],
              [],
              maxSlippage,
              RouterLiquiditySource.Sender,
              chargeFee
                ? ProcessFunction.ProcessRouteWithTransferValueOutput
                : ProcessFunction.ProcessRoute,
              chargeFee
                ? isTokenChomperChainId(chainId)
                  ? TOKEN_CHOMPER_ADDRESS[chainId]
                  : '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098'
                : undefined,
              chargeFee ? calculateFee(minAmountOut) : undefined,
            )
          : undefined

        const amountIn = Amount.fromRawAmount(fromToken, route.amountInBI)
        const amountOut = Amount.fromRawAmount(
          toToken,
          new Fraction(route.amountOutBI).multiply(
            tokenTax ? new Percent(1).subtract(tokenTax) : 1,
          ).quotient,
        )

        // const isOffset = chainId === ChainId.POLYGON && carbonOffset

        // if (writeArgs && isOffset && chainId === ChainId.POLYGON) {
        //   writeArgs = [
        //     '0xbc4a6be1285893630d45c881c6c343a65fdbe278',
        //     20000000000000000n,
        //     ...writeArgs,
        //   ]
        //   value = (fromToken.isNative ? writeArgs[3] : 0n) + 20000000000000000n
        // }

        const value =
          fromToken.isNative && args?.amountIn ? args.amountIn : undefined

        const gasSpent = gasPrice
          ? Amount.fromRawAmount(
              Native.onChain(chainId),
              gasPrice * BigInt(route.gasSpent * 1.2),
            )
          : undefined

        return {
          swapPrice: amountOut.greaterThan(0n)
            ? new Price({
                baseAmount: amount,
                quoteAmount: amountOut,
              })
            : undefined,
          priceImpact: route.priceImpact
            ? new Percent(Math.round(route.priceImpact * 10000), 10000)
            : new Percent(0),
          amountIn,
          amountOut,
          minAmountOut,
          gasSpent: gasSpent?.toSignificant(4),
          gasSpentUsd:
            price && gasSpent
              ? gasSpent.multiply(price).toSignificant(4)
              : undefined,
          fee:
            !isWrapOrUnwrap({ fromToken, toToken }) &&
            !isStable({ fromToken, toToken }) &&
            !isLsd({ fromToken, toToken })
              ? `${tokenOutPrice ? '$' : ''}${minAmountOut
                  .multiply(new Percent(25, 10000))
                  .multiply(tokenOutPrice ? tokenOutPrice : 1)
                  .toSignificant(4)} ${!tokenOutPrice ? toToken.symbol : ''}`
              : '$0',
          route,
          tx: args
            ? {
                from: recipient,
                to: ROUTE_PROCESSOR_5_ADDRESS[chainId],
                data: args?.data,
                value,
              }
            : undefined,
          tokenTax,
        }
      }

      return {
        swapPrice: undefined,
        priceImpact: undefined,
        amountIn: undefined,
        amountOut: undefined,
        minAmountOut: undefined,
        gasSpent: undefined,
        gasSpentUsd: undefined,
        fee: undefined,
        route: undefined,
        tx: undefined,
        tokenTax: undefined,
      }
    },
    refetchInterval: 10000,
    enabled: Boolean(
      enabled && poolsCodeMap && gasPrice && fromToken && toToken && chainId,
    ),
    queryKeyHashFn: stringify,
  })
}
