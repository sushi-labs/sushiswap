'use client'

import {
  type TimeDuration,
  TimeUnit,
  zeroAddress,
} from '@orbs-network/twap-sdk'
import {
  type Dispatch,
  type FC,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { type TwapSupportedChainId, isTwapSupportedChainId } from 'src/config'
import { getFeeString } from 'src/lib/swap/fee'
import { TwapExpiryTimeDurations, TwapSDK } from 'src/lib/swap/twap'
import { twapAbi_ask } from 'src/lib/swap/twap/abi'
import { ChainId, type EvmChainId } from 'sushi/chain'
import { Amount, Price, type Type, tryParseAmount } from 'sushi/currency'
import type { Fraction } from 'sushi/math'
import { sz } from 'sushi/validate'
import { type Hex, encodeFunctionData } from 'viem'
import type { Address } from 'viem/accounts'
import { parseUnits } from 'viem/utils'
import { z } from 'zod'
import { usePrices } from '~evm/_common/ui/price-provider/price-provider/use-prices'
import {
  DerivedstateSimpleSwapProvider,
  useDerivedStateSimpleSwap,
} from '../simple/derivedstate-simple-swap-provider'

type DerivedStateSimpleSwapState = ReturnType<typeof useDerivedStateSimpleSwap>

type State = DerivedStateSimpleSwapState & {
  state: Omit<DerivedStateSimpleSwapState['state'], 'chainId'> & {
    chainId: TwapSupportedChainId
    isLimitOrder: boolean
    isLimitPriceInverted: boolean
    limitPriceString: string
    limitPrice: Price<Type, Type> | undefined
    marketPrice: Price<Type, Type> | undefined
    token0PriceUSD: Fraction | undefined
    token1PriceUSD: Fraction | undefined
    expiry: TimeDuration
    chunks: number
    fillDelay: TimeDuration
    deadline: number
    amountOut: Amount<Type> | undefined
    minAmountOut: Amount<Type> | undefined
    amountInPerChunk: Amount<Type> | undefined
  }
  mutate: DerivedStateSimpleSwapState['mutate'] & {
    setIsLimitPriceInverted: Dispatch<SetStateAction<boolean>>
    setLimitPrice: Dispatch<SetStateAction<string>>
    setExpiry: Dispatch<SetStateAction<TimeDuration>>
    setChunks: Dispatch<SetStateAction<number>>
    setFillDelay: Dispatch<SetStateAction<TimeDuration>>
  }
}

const DerivedStateTwapContext = createContext<State>({} as State)

interface DerivedStateTwapProviderProps {
  children: React.ReactNode
  isLimitOrder?: boolean
}

const DerivedStateTwapProvider: FC<DerivedStateTwapProviderProps> = ({
  children,
  isLimitOrder,
}) => {
  return (
    <DerivedstateSimpleSwapProvider>
      <_DerivedStateTwapProvider isLimitOrder={isLimitOrder}>
        {children}
      </_DerivedStateTwapProvider>
    </DerivedstateSimpleSwapProvider>
  )
}

const _DerivedStateTwapProvider: FC<DerivedStateTwapProviderProps> = ({
  children,
  isLimitOrder = false,
}) => {
  const derivedStateSimpleSwap = useDerivedStateSimpleSwap()

  const { data: prices, isLoading: _isPricesLoading } = usePrices({
    chainId: derivedStateSimpleSwap.state.chainId,
  })

  const [isLimitPriceInverted, setIsLimitPriceInverted] =
    useState<boolean>(false)
  const [limitPriceString, setLimitPrice] = useState<string>('')
  const [expiry, setExpiry] = useState<TimeDuration>(
    TwapExpiryTimeDurations.Day,
  )
  const [chunks, setChunks] = useState<number>(1)
  const [fillDelay, setFillDelay] = useState<TimeDuration>({
    unit: TimeUnit.Minutes,
    value: 5,
  })

  const [marketPrice, token0PriceUSD, token1PriceUSD] = useMemo(() => {
    const [token0, token1] = [
      derivedStateSimpleSwap.state.token0,
      derivedStateSimpleSwap.state.token1,
    ]

    if (!token0 || !token1) return [undefined, undefined, undefined]

    const token0PriceFraction = prices?.getFraction(token0.wrapped.address)
    const token1PriceFraction = prices?.getFraction(token1.wrapped.address)

    if (token0PriceFraction && token1PriceFraction) {
      const token0OverToken1 = token0PriceFraction.divide(token1PriceFraction)
      const quoteRaw = token0OverToken1.multiply(
        parseUnits('1', token1.decimals),
      ).quotient

      return [
        new Price({
          baseAmount: Amount.fromRawAmount(
            token0,
            parseUnits('1', token0.decimals),
          ),
          quoteAmount: Amount.fromRawAmount(token1, quoteRaw),
        }),
        token0PriceFraction,
        token1PriceFraction,
      ]
    }

    return [undefined, undefined, undefined]
  }, [
    prices,
    derivedStateSimpleSwap.state.token0,
    derivedStateSimpleSwap.state.token1,
  ])

  return (
    <DerivedStateTwapContext.Provider
      value={useMemo(() => {
        const { state, mutate, isLoading, isToken0Loading, isToken1Loading } =
          derivedStateSimpleSwap

        const chainId = isTwapSupportedChainId(state.chainId)
          ? state.chainId
          : ChainId.ETHEREUM

        const sdk = TwapSDK.onNetwork(chainId)

        const duration = sdk.getOrderDuration(
          chunks,
          fillDelay,
          isLimitOrder ? expiry : undefined,
        )

        const deadline = sdk.getOrderDeadline(Date.now(), duration)

        const amountInPerChunk =
          state.swapAmount && chunks
            ? Amount.fromRawAmount(
                state.swapAmount.currency,
                sdk.getSrcTokenChunkAmount(
                  state.swapAmount.quotient.toString(),
                  chunks,
                ),
              )
            : undefined

        const [baseCurrency, quoteCurrency] =
          state.token0 && state.token1
            ? isLimitPriceInverted
              ? [state.token1, state.token0]
              : [state.token0, state.token1]
            : [undefined, undefined]

        const baseAmount = baseCurrency
          ? Amount.fromRawAmount(
              baseCurrency,
              parseUnits('1', baseCurrency.decimals),
            )
          : undefined

        const quoteAmount = tryParseAmount(limitPriceString, quoteCurrency)

        const _limitPrice =
          baseAmount && quoteAmount
            ? new Price({ baseAmount, quoteAmount })
            : undefined

        const limitPrice = isLimitPriceInverted
          ? _limitPrice?.invert()
          : _limitPrice

        const orderPrice = isLimitOrder ? limitPrice : marketPrice

        const orderPriceOfOneToken0 = orderPrice
          ? orderPrice.quote(
              Amount.fromRawAmount(
                orderPrice.baseCurrency,
                parseUnits('1', orderPrice.baseCurrency.decimals),
              ),
            )
          : undefined

        const destTokenAmount =
          state.swapAmount && orderPriceOfOneToken0
            ? sdk.getDestTokenAmount(
                state.swapAmount.quotient.toString(),
                orderPriceOfOneToken0.quotient.toString(),
                state.swapAmount.currency.decimals,
              )
            : undefined

        const amountOut =
          state.token1 && destTokenAmount
            ? Amount.fromRawAmount(state.token1, destTokenAmount)
            : undefined

        const destMinAmount =
          state.token0 && amountInPerChunk && orderPriceOfOneToken0
            ? sdk.getDestTokenMinAmount(
                amountInPerChunk.quotient.toString(),
                orderPriceOfOneToken0.quotient.toString(),
                !isLimitOrder,
                state.token0.decimals,
              )
            : undefined

        const minAmountOut =
          state.token1 && destMinAmount
            ? Amount.fromRawAmount(state.token1, destMinAmount)
            : undefined

        return {
          mutate: {
            ...mutate,
            setIsLimitPriceInverted,
            setLimitPrice,
            setExpiry,
            setChunks,
            setFillDelay,
          },
          state: {
            ...state,
            chainId,
            isLimitOrder,
            marketPrice,
            isLimitPriceInverted,
            limitPriceString,
            limitPrice,
            token0PriceUSD,
            token1PriceUSD,
            expiry,
            chunks,
            fillDelay,
            deadline,
            amountOut,
            minAmountOut,
            amountInPerChunk,
          },
          isLoading,
          isToken0Loading,
          isToken1Loading,
        }
      }, [
        derivedStateSimpleSwap,
        isLimitPriceInverted,
        isLimitOrder,
        marketPrice,
        limitPriceString,
        token0PriceUSD,
        token1PriceUSD,
        expiry,
        chunks,
        fillDelay,
      ])}
    >
      {children}
    </DerivedStateTwapContext.Provider>
  )
}

const useDerivedStateTwap = () => {
  const context = useContext(DerivedStateTwapContext)
  if (!context) {
    throw new Error('Hook can only be used inside Twap Derived State Context')
  }

  return context
}

const bigIntValidator = z.preprocess(
  (v) => (typeof v === 'string' ? BigInt(v) : v),
  z.bigint(),
)

const prepareOrderArgsValidator = z.tuple([
  sz.address(), // 0: exchange
  sz.address(), // 1: srcToken
  sz.address(), // 2: dstToken
  bigIntValidator, // 3: srcAmount
  bigIntValidator, // 4: srcBidAmount
  bigIntValidator, // 5: dstMinAmount
  z.coerce
    .number()
    .int()
    .gte(0), // 6: deadline
  z.coerce
    .number()
    .int()
    .gte(0), // 7: bidDelay
  z.coerce
    .number()
    .int()
    .gte(0), // 8: fillDelay
  z.preprocess((val) => (val === '' ? '0x' : val), sz.hex()), // 9: data
])

export interface UseTwapTradeReturn {
  isLimitOrder: boolean | undefined
  limitPrice: Price<Type, Type> | undefined
  marketPrice: Price<Type, Type> | undefined
  amountIn: Amount<Type> | undefined
  chunks: number | undefined
  fillDelay: TimeDuration | undefined
  amountInPerChunk: Amount<Type> | undefined
  amountOut: Amount<Type> | undefined
  minAmountOut: Amount<Type> | undefined
  tx:
    | {
        chainId: EvmChainId
        to: Address
        data: Hex
      }
    | undefined
  params: z.infer<typeof prepareOrderArgsValidator>
  fee: string | undefined
}

const useTwapTrade = () => {
  const {
    state: {
      chainId,
      swapAmount,
      token0,
      token1,
      deadline,
      amountOut,
      minAmountOut,
      amountInPerChunk,
      fillDelay,
      limitPrice,
      marketPrice,
      token1PriceUSD,
      chunks,
      isLimitOrder,
    },
  } = useDerivedStateTwap()

  return useMemo(() => {
    if (
      !swapAmount ||
      !token0 ||
      !token1 ||
      !minAmountOut ||
      !amountInPerChunk ||
      !fillDelay ||
      !chunks
    )
      return { data: undefined, error: undefined }

    const sdkParams = TwapSDK.onNetwork(chainId).getAskParams({
      destTokenMinAmount: minAmountOut.quotient.toString(),
      srcChunkAmount: amountInPerChunk.quotient.toString(),
      deadline,
      fillDelay,
      srcAmount: swapAmount.quotient.toString(),
      srcTokenAddress: token0.wrapped.address,
      destTokenAddress: token1.isToken ? token1.address : zeroAddress,
    })

    const {
      success,
      data: params,
      error,
    } = prepareOrderArgsValidator.safeParse(sdkParams)

    if (!success) {
      return {
        data: undefined,
        error: error,
      }
    }

    const tx = {
      chainId,
      to: TwapSDK.onNetwork(chainId).config.twapAddress as Address,
      data: encodeFunctionData({
        abi: twapAbi_ask,
        functionName: 'ask',
        args: [
          {
            exchange: params[0],
            srcToken: params[1],
            dstToken: params[2],
            srcAmount: params[3],
            srcBidAmount: params[4],
            dstMinAmount: params[5],
            deadline: params[6],
            bidDelay: params[7],
            fillDelay: params[8],
            data: params[9],
          },
        ],
      }),
    }

    return {
      data: {
        isLimitOrder,
        limitPrice,
        marketPrice,
        amountIn: swapAmount,
        chunks,
        fillDelay,
        amountInPerChunk,
        amountOut,
        minAmountOut,
        tx,
        params,
        fee: isLimitOrder
          ? getFeeString({
              fromToken: token0,
              toToken: token1,
              tokenOutPrice: token1PriceUSD,
              minAmountOut,
            })
          : undefined,
      } satisfies UseTwapTradeReturn,
      error: undefined,
    }
  }, [
    token0,
    token1,
    chainId,
    fillDelay,
    deadline,
    swapAmount,
    chunks,
    amountInPerChunk,
    amountOut,
    minAmountOut,
    limitPrice,
    marketPrice,
    token1PriceUSD,
    isLimitOrder,
  ])
}

const useTwapTradeErrors = () => {
  const {
    state: {
      chainId,
      amountInPerChunk,
      fillDelay,
      token0PriceUSD,
      chunks,
      isLimitOrder,
    },
  } = useDerivedStateTwap()

  return useMemo(() => {
    const sdk = TwapSDK.onNetwork(chainId)

    const minFillDelayError = isLimitOrder
      ? false
      : sdk.getMinFillDelayError(fillDelay).isError
    const maxFillDelayError = isLimitOrder
      ? false
      : sdk.getMaxFillDelayError(fillDelay, chunks).isError

    const minTradeSizeError =
      amountInPerChunk && token0PriceUSD
        ? sdk.getMinTradeSizeError(
            amountInPerChunk.toExact(),
            token0PriceUSD.toFixed(6),
            sdk.config.minChunkSizeUsd,
          ).isError
        : false

    return {
      minFillDelayError,
      maxFillDelayError,
      minTradeSizeError,
    }
  }, [
    chainId,
    isLimitOrder,
    fillDelay,
    chunks,
    amountInPerChunk,
    token0PriceUSD,
  ])
}

export {
  DerivedStateTwapProvider,
  useDerivedStateTwap,
  useTwapTrade,
  useTwapTradeErrors,
}
