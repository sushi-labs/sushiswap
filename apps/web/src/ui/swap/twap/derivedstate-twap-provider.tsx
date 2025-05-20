'use client'

import {
  type DerivedSwapValuesArgs,
  type DerivedSwapValuesResponse,
  type TimeDuration,
  TimeUnit,
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
import { getTradeSizeWarning } from 'src/lib/swap/twap/warnings'
import { ChainId } from 'sushi/chain'
import { Amount, Price, type Type } from 'sushi/currency'
import type { Fraction } from 'sushi/math'
import { sz } from 'sushi/validate'
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
    limitPrice: Price<Type, Type> | undefined
    marketPrice: Price<Type, Type> | undefined
    token0PriceUSD: Fraction | undefined
    token1PriceUSD: Fraction | undefined
    expiry: TimeDuration
    chunks: number
    fillDelay: TimeDuration
  }
  mutate: DerivedStateSimpleSwapState['mutate'] & {
    setLimitPrice: Dispatch<SetStateAction<Price<Type, Type> | undefined>>
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

  const [limitPrice, setLimitPrice] = useState<Price<Type, Type> | undefined>(
    undefined,
  )
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

        return {
          mutate: {
            ...mutate,
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
            limitPrice,
            token0PriceUSD,
            token1PriceUSD,
            expiry,
            chunks,
            fillDelay,
          },
          isLoading,
          isToken0Loading,
          isToken1Loading,
        }
      }, [
        derivedStateSimpleSwap,
        isLimitOrder,
        marketPrice,
        limitPrice,
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

const useTwapTrade = ():
  | (Omit<
      DerivedSwapValuesResponse,
      'srcChunkAmount' | 'destTokenMinAmount' | 'destTokenAmount'
    > & {
      amountIn: Amount<Type>
      amountInChunk: Amount<Type>
      amountOut: Amount<Type> | undefined
      minAmountOut: Amount<Type>
      fee: string | undefined
    })
  | undefined => {
  const {
    state: {
      isLimitOrder,
      chainId,
      swapAmount,
      marketPrice,
      limitPrice,
      token0PriceUSD,
      token1PriceUSD,
      token0,
      token1,
      expiry,
      chunks,
      fillDelay,
    },
  } = useDerivedStateTwap()

  return useMemo(() => {
    if (!swapAmount || !marketPrice || !token0PriceUSD || !token0 || !token1)
      return undefined

    const derivedValueArgs: DerivedSwapValuesArgs = {
      srcAmount: swapAmount?.quotient.toString(),
      oneSrcTokenUsd: token0PriceUSD.toFixed(6),
      srcDecimals: token0.decimals,
      destDecimals: token1.decimals,
    }

    if (isLimitOrder) {
      derivedValueArgs.isLimitPanel = true
      derivedValueArgs.customDuration = expiry
      derivedValueArgs.price = (limitPrice ?? marketPrice)
        .quote(Amount.fromRawAmount(token0, parseUnits('1', token0.decimals)))
        .quotient.toString()
    } else {
      derivedValueArgs.isMarketOrder = true
      derivedValueArgs.customChunks = chunks
      derivedValueArgs.customFillDelay = fillDelay
    }

    const { srcChunkAmount, destTokenAmount, destTokenMinAmount, ...trade } =
      TwapSDK.onNetwork(chainId).derivedSwapValues(derivedValueArgs)

    const amountOut = destTokenAmount
      ? Amount.fromRawAmount(token1, destTokenAmount)
      : undefined

    const minAmountOut = Amount.fromRawAmount(token1, destTokenMinAmount)

    const amountInChunk = Amount.fromRawAmount(token1, srcChunkAmount)

    return {
      ...trade,
      amountIn: swapAmount,
      amountInChunk,
      amountOut,
      minAmountOut,
      fee: isLimitOrder
        ? getFeeString({
            fromToken: token0,
            toToken: token1,
            tokenOutPrice: token1PriceUSD,
            minAmountOut,
          })
        : undefined,
    }
  }, [
    swapAmount,
    chainId,
    marketPrice,
    limitPrice,
    token0PriceUSD,
    token1PriceUSD,
    isLimitOrder,
    token0,
    token1,
    expiry,
    chunks,
    fillDelay,
  ])
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
  z.preprocess((v) => {
    // twap SDK incorrectly returns data as an array, looks like it always returns [] though
    if (Array.isArray(v)) {
      if (v.length === 0) return '0x'
      if (v.length === 1) return v[0]
      throw new Error('data must be a single hex string')
    }
    return v ?? '0x'
  }, sz.hex()), // 9: data
])

const usePrepareTwapOrderArgs = (trade: ReturnType<typeof useTwapTrade>) => {
  const {
    state: { chainId, swapAmount, token0, token1 },
  } = useDerivedStateTwap()

  return useMemo(() => {
    if (!trade || !swapAmount || !token0 || !token1)
      return { params: undefined, error: undefined }

    const { minAmountOut, amountInChunk, duration, fillDelay } = trade

    const deadline = TwapSDK.onNetwork(chainId).orderDeadline(
      Date.now(),
      duration,
    )

    const sdkParams = TwapSDK.onNetwork(chainId).prepareOrderArgs({
      destTokenMinAmount: minAmountOut.quotient.toString(),
      srcChunkAmount: amountInChunk.quotient.toString(),
      deadline,
      fillDelay,
      srcAmount: swapAmount.quotient.toString(),
      srcTokenAddress: token0?.wrapped.address,
      destTokenAddress: token1?.wrapped.address,
    })

    const {
      success,
      data: params,
      error,
    } = prepareOrderArgsValidator.safeParse(sdkParams)

    if (!success) {
      return {
        params: undefined,
        error: error,
      }
    }

    return {
      params: {
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
      error: undefined,
    }
  }, [trade, swapAmount, token0, token1, chainId])
}

export {
  DerivedStateTwapProvider,
  useDerivedStateTwap,
  useTwapTrade,
  usePrepareTwapOrderArgs,
}
