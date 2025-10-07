import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { API_BASE_URL } from 'src/lib/swap/api-base-url'
import { getFeeString } from 'src/lib/swap/fee'
import { Amount, Fraction, Percent, Price, ZERO, subtractSlippage } from 'sushi'
import {
  type EvmAddress,
  type EvmCurrency,
  type EvmID,
  EvmNative,
  isLsd,
  isRedSnwapperChainId,
  isStable,
  isWNativeSupported,
  isWrapOrUnwrap,
} from 'sushi/evm'
import { stringify, zeroAddress } from 'viem'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { apiAdapter02To01 } from './apiAdapter'
import type { UseTradeParams, UseTradeQuerySelect } from './types'
import { tradeValidator02 } from './validator02'

const excludePoolsByToken: Partial<Record<EvmID<true>, EvmAddress[]>> = {
  '1:0x9ea3b5b4ec044b70375236a281986106457b20ef': [
    '0x7d7e813082ef6c143277c71786e5be626ec77b20',
  ],
}

function applyPoolExclusion(
  fromToken: EvmCurrency,
  toToken: EvmCurrency,
  searchParams: URLSearchParams,
) {
  if (excludePoolsByToken[fromToken.id] || excludePoolsByToken[toToken.id]) {
    const excludePools = [
      ...(excludePoolsByToken[fromToken.id] || []),
      ...(excludePoolsByToken[toToken.id] || []),
    ]

    searchParams.set('excludePools', excludePools.join(','))
  }
}

export const useTradeQuoteQuery = (
  {
    chainId,
    fromToken,
    toToken,
    amount,
    gasPrice = 50n,
    fee = 0.0025,
    slippagePercentage,
    recipient,
    source,
    onlyPools,
    enabled,
  }: UseTradeParams,
  select: UseTradeQuerySelect,
) => {
  return useQuery({
    queryKey: [
      'getTradeQuote',
      {
        chainId,
        currencyA: fromToken,
        currencyB: toToken,
        amount,
        fee,
        slippagePercentage,
        gasPrice,
        source,
        onlyPools,
      },
    ],
    queryFn: async () => {
      if (!chainId || !fromToken || !toToken || !amount) {
        throw new Error('Missing required parameters for trade quote')
      }

      const params = new URL(`${API_BASE_URL}/quote/v7/${chainId}`)
      params.searchParams.set('referrer', 'sushi')
      params.searchParams.set(
        'tokenIn',
        `${
          fromToken?.type === 'native'
            ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
            : fromToken?.wrap().address
        }`,
      )
      params.searchParams.set(
        'tokenOut',
        `${
          toToken?.type === 'native'
            ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
            : toToken?.wrap().address
        }`,
      )
      params.searchParams.set('amount', `${amount?.amount.toString()}`)
      params.searchParams.set('maxSlippage', `${+slippagePercentage / 100}`)
      params.searchParams.set('fee', `${fee}`)
      params.searchParams.set('feeBy', 'output')
      if (onlyPools)
        onlyPools.forEach((pool) =>
          params.searchParams.append('onlyPools', pool),
        )

      applyPoolExclusion(fromToken, toToken, params.searchParams)

      const res = await fetch(params.toString())
      const json = await res.json()
      const resp2 = tradeValidator02.parse(json)

      const resp1 = apiAdapter02To01(resp2, fromToken, toToken, recipient)

      return resp1
    },
    refetchOnWindowFocus: true,
    refetchInterval: 2500,
    gcTime: 0, // the length of time before inactive data gets removed from the cache
    retry: false, // dont retry on failure, immediately fallback
    select,
    enabled:
      enabled && Boolean(chainId && fromToken && toToken && amount && gasPrice),
    queryKeyHashFn: stringify,
  })
}

export const useTradeQuote = (variables: UseTradeParams) => {
  const {
    chainId,
    fromToken,
    toToken,
    amount,
    slippagePercentage,
    // carbonOffset,
    gasPrice,
    tokenTax,
  } = variables
  const { data: prices } = usePrices({
    chainId,
  })

  const [nativePrice, tokenOutPrice] = useMemo(() => {
    const result = [new Fraction(0), undefined]

    if (prices) {
      if (
        isWNativeSupported(chainId) &&
        EvmNative.fromChainId(chainId).wrap().address !== zeroAddress
      ) {
        result[0] = prices.getFraction(
          EvmNative.fromChainId(chainId).wrap().address,
        )
      }

      if (toToken) {
        result[1] = prices.getFraction(toToken.wrap().address)
      }
    }

    return result
  }, [chainId, prices, toToken])

  const select: UseTradeQuerySelect = useCallback(
    (data) => {
      if (
        isRedSnwapperChainId(chainId) &&
        data &&
        amount &&
        data.route &&
        fromToken &&
        toToken
      ) {
        const amountIn = new Amount(fromToken, data.route.amountInBI)
        const amountOut = new Amount(
          toToken,
          new Fraction({ numerator: data.route.amountOutBI }).mul(
            tokenTax ? new Percent(1).sub(tokenTax) : 1,
          ).quotient,
        )
        const minAmountOut = data.args?.amountOutMin
          ? new Amount(toToken, data.args.amountOutMin)
          : subtractSlippage(
              new Amount(toToken, data.route.amountOutBI),
              new Percent({
                numerator: Math.floor(+slippagePercentage * 100),
                denominator: 10_000,
              }).toNumber(),
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

        // const value =
        //   fromToken.isNative && data?.args?.amountIn
        //     ? data.args.amountIn
        //     : undefined

        const gasSpent = gasPrice
          ? new Amount(
              EvmNative.fromChainId(chainId),
              gasPrice * BigInt(data.route.gasSpent * 1.2),
            )
          : undefined

        return {
          swapPrice: amountOut.gt(ZERO)
            ? new Price({
                baseAmount: amount,
                quoteAmount: amountOut,
              })
            : undefined,
          priceImpact: data.route.priceImpact
            ? new Percent({
                numerator: Math.round(data.route.priceImpact * 10000),
                denominator: 10000,
              })
            : new Percent(0),
          amountIn,
          amountOut,
          minAmountOut,
          gasSpent: gasSpent?.toSignificant(4),
          gasSpentUsd:
            nativePrice && gasSpent
              ? gasSpent.mul(nativePrice.asFraction).toSignificant(4)
              : undefined,
          fee: getFeeString({
            fromToken,
            toToken,
            tokenOutPrice,
            minAmountOut,
          }),
          route: data.route,
          tx: undefined,
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
    [
      // carbonOffset,
      amount,
      chainId,
      fromToken,
      nativePrice,
      tokenOutPrice,
      slippagePercentage,
      toToken,
      gasPrice,
      tokenTax,
    ],
  )

  return useTradeQuoteQuery(variables, select)
}
