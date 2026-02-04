import {
  SwapEventName,
  sendAnalyticsEvent,
  useTrace,
} from '@sushiswap/telemetry'
import { useQuery } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'
import { UI_FEE_BIPS, UI_FEE_DECIMAL, UI_FEE_PERCENT } from 'src/config'
import { API_BASE_URL } from 'src/lib/swap/api-base-url'
import { getFeeString, isAddressFeeWhitelisted } from 'src/lib/swap/fee'
import { Amount, Fraction, Percent, Price, ZERO, subtractSlippage } from 'sushi'
import {
  type EvmCurrency,
  EvmNative,
  UI_FEE_COLLECTOR_ADDRESS,
  addGasMargin,
  isEvmWNativeSupported,
  isRedSnwapperChainId,
  isUIFeeCollectorChainId,
} from 'sushi/evm'
import { type Hex, stringify, zeroAddress } from 'viem'
import { useConnection } from 'wagmi'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import { apiAdapter02To01 } from './apiAdapter'
import type { UseTradeParams, UseTradeQuerySelect } from './types'
import { tradeValidator02 } from './validator02'

export const useTradeQuery = (
  {
    chainId,
    fromToken,
    toToken,
    amount,
    gasPrice = 50n,
    fee = UI_FEE_DECIMAL,
    slippagePercentage,
    recipient,
    source,
    onlyPools,
    enabled,
  }: UseTradeParams,
  select: UseTradeQuerySelect,
) => {
  const trace = useTrace()
  const { address } = useConnection()

  return useQuery({
    queryKey: [
      'getTrade',
      {
        chainId,
        currencyA: fromToken,
        currencyB: toToken,
        amount,
        fee,
        slippagePercentage,
        gasPrice,
        address,
        recipient,
        source,
        onlyPools,
      },
    ],
    queryFn: async () => {
      if (!address) throw new Error('No address')

      const params = new URL(`${API_BASE_URL}/swap/v7/${chainId}`)
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
      params.searchParams.set('sender', `${address}`)
      recipient && params.searchParams.set('recipient', `${recipient}`)

      if (
        !isAddressFeeWhitelisted(address) ||
        (recipient && !isAddressFeeWhitelisted(recipient))
      ) {
        params.searchParams.set('fee', `${fee}`)
        if (fee > 0) {
          params.searchParams.set('feeBy', 'output')
          params.searchParams.set(
            'feeReceiver',
            isUIFeeCollectorChainId(chainId)
              ? UI_FEE_COLLECTOR_ADDRESS[chainId]
              : '0xFF64C2d5e23e9c48e8b42a23dc70055EEC9ea098',
          )
        }
      }

      if (source !== undefined) params.searchParams.set('source', `${source}`)
      if (process.env.NEXT_PUBLIC_APP_ENV === 'test')
        params.searchParams.set('simulate', 'false')
      else params.searchParams.set('simulate', 'true')
      if (onlyPools)
        onlyPools.forEach((pool) =>
          params.searchParams.append('onlyPools', pool),
        )

      const res = await fetch(params.toString())
      const json = await res.json()
      const resp2 = tradeValidator02.parse(json)

      const resp1 = apiAdapter02To01(
        resp2,
        fromToken as EvmCurrency,
        toToken as EvmCurrency,
        recipient,
      )

      sendAnalyticsEvent(SwapEventName.SWAP_QUOTE_RECEIVED, {
        route: stringify(resp1.route),
        ...trace,
      })

      return resp1
    },
    refetchOnWindowFocus: true,
    refetchInterval: 2500,
    gcTime: 0, // the length of time before inactive data gets removed from the cache
    retry: false, // dont retry on failure, immediately fallback
    select,
    enabled: Boolean(
      enabled &&
        address &&
        chainId &&
        fromToken &&
        toToken &&
        amount &&
        gasPrice,
    ),
    queryKeyHashFn: stringify,
  })
}

export const useTrade = (variables: UseTradeParams) => {
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
        isEvmWNativeSupported(chainId) &&
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
      console.log(data)
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
              subtractSlippage(
                new Amount(toToken, data.route.amountOutBI),
                UI_FEE_DECIMAL,
              ),
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
              gasPrice * addGasMargin(BigInt(Math.floor(data.route.gasSpent))),
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
          tx: data?.tx
            ? {
                from: data.tx.from,
                to: data.tx.to,
                data: data.tx.data as Hex,
                value: data.tx.value,
                gas: data.tx.gas,
                gasPrice: data.tx.gasPrice,
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

  return useTradeQuery(variables, select)
}
