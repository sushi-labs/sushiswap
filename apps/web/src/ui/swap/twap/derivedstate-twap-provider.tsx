'use client'

import { DerivedSwapValues, TimeDuration } from '@orbs-network/twap-sdk'
import {
  Dispatch,
  FC,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { TwapSupportedChainId, isTwapSupportedChainId } from 'src/config'
import { getFeeString } from 'src/lib/swap/fee'
import { TwapSDK } from 'src/lib/swap/twap/TwapSDK'
import { TwapDuration } from 'src/lib/swap/twap/types'
import { ChainId } from 'sushi/chain'
import { Amount, Price, Type, tryParseAmount } from 'sushi/currency'
import { Fraction } from 'sushi/math'
import { parseUnits } from 'viem/utils'
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
    token0Price: Fraction | undefined
    token1Price: Fraction | undefined
    expiry: TimeDuration
  }
  mutate: DerivedStateSimpleSwapState['mutate'] & {
    setLimitPrice: Dispatch<SetStateAction<Price<Type, Type> | undefined>>
    setExpiry: Dispatch<SetStateAction<TimeDuration>>
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

  const [expiry, setExpiry] = useState<TimeDuration>(TwapDuration.Day)

  const [marketPrice, token0Price, token1Price] = useMemo(() => {
    const [token0, token1] = [
      derivedStateSimpleSwap.state.token0,
      derivedStateSimpleSwap.state.token1,
    ]

    if (!token0 || !token1) return [undefined, undefined, undefined]

    const token0PriceFraction = prices?.getFraction(token0.wrapped.address)
    const token0Price = token0PriceFraction
      ? tryParseAmount('1', token0)?.multiply(token0PriceFraction)
      : undefined

    const token1PriceFraction = prices?.getFraction(token1.wrapped.address)
    const token1Price = token1PriceFraction
      ? tryParseAmount('1', token1)?.multiply(token1PriceFraction)
      : undefined

    return token0Price?.quotient && token1Price?.quotient
      ? [
          new Price({
            baseAmount: token1Price,
            quoteAmount: token0Price,
          }),
          token0PriceFraction,
          token1PriceFraction,
        ]
      : [undefined, undefined, undefined]
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

        //   const {chunks
        //   duration,
        //   fillDelay,
        //   srcChunkAmount,
        //   destTokenMinAmount,
        //   destTokenAmount,
        //   maxPossibleChunks,
        //   warnings
        // } = TwapSDK.onNetwork(chainId).derivedSwapValues({
        //     srcAmount: state.swapAmountString,
        //     price,
        //     isLimitPanel: isLimitOrder,
        //     oneSrcTokenUsd: token0Price,
        //     srcDecimals: state.token0?.decimals,
        //     destDecimals: state.token1?.decimals,
        //     isMarketOrder: inputPrice === price,
        //   })

        return {
          mutate: {
            ...mutate,
            setLimitPrice,
            setExpiry,
          },
          state: {
            ...state,
            chainId,
            isLimitOrder,
            marketPrice,
            limitPrice,
            token0Price,
            token1Price,
            expiry,
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
        token0Price,
        token1Price,
        expiry,
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

// // adapted from https://github.com/orbs-network/twap-ui/blob/e02e96e/packages/sdk/src/lib/lib.ts#L8
// const getDestTokenAmount = (
//   srcAmount?: Amount<Type>,
//   dstToken?: Type,
//   limitPrice?: string,
// ) => {
//   if (!srcAmount || !dstToken || !limitPrice) return undefined

//   // TODO: double check decimals
//   const amount = BigInt(
//     Math.floor(
//       +srcAmount.toExact() *
//         +limitPrice *
//         10 ** (2 * dstToken.decimals - srcAmount.currency.decimals),
//     ),
//   )

//   return Amount.fromRawAmount(dstToken, amount)
// }

// export const getDestTokenMinAmount = (
//   srcChunkAmount?: string,
//   limitPrice?: string,
//   isMarketOrder?: boolean,
//   srcToken?: Type,
//   dstToken?: Type,
// ) => {
//   if (!dstToken) return undefined
//   let amount
//   if (
//     isMarketOrder ||
//     !srcToken ||
//     !dstToken ||
//     !srcChunkAmount ||
//     !limitPrice
//   ) {
//     amount = 10
//   } else {
//     const result = BigInt(srcChunkAmount) * BigInt(limitPrice)
//     const decimalAdjustment = 10n ** BigInt(srcToken.decimals)
//     const adjustedResult = result / decimalAdjustment
//     amount = (adjustedResult < 1n ? 1n : adjustedResult).toString()
//   }

//   return Amount.fromRawAmount(dstToken, amount)
// }

const useTwapTrade = ():
  | (Omit<DerivedSwapValues, 'destTokenMinAmount' | 'destTokenAmount'> & {
      // amountOut: string | undefined
      amountOut: Amount<Type> | undefined
      minAmountOut: Amount<Type> | undefined
      fee: string
    })
  | undefined => {
  const {
    state: {
      isLimitOrder,
      chainId,
      swapAmount,
      marketPrice,
      token0Price,
      token1Price,
      limitPrice,
      token0,
      token1,
      expiry,
    },
  } = useDerivedStateTwap()

  return useMemo(() => {
    if (
      !swapAmount ||
      !marketPrice ||
      !limitPrice ||
      !token0 ||
      !token1 ||
      !token0Price
    )
      return undefined

    const price = limitPrice.quote(
      Amount.fromRawAmount(token1, parseUnits('1', token1.decimals)),
    )

    const { destTokenAmount, destTokenMinAmount, ...trade } = TwapSDK.onNetwork(
      chainId,
    ).derivedSwapValues({
      srcAmount: swapAmount.quotient.toString(),
      limitPrice: price.quotient.toString(),
      customDuration: expiry,
      isLimitPanel: isLimitOrder,
      oneSrcTokenUsd: tryParseAmount('1', token0)!
        .multiply(token0Price)
        .toExact(),
      srcDecimals: token0.decimals,
      destDecimals: token1.decimals,
      isMarketOrder: !isLimitOrder,
    })

    const amountOut = destTokenAmount
      ? Amount.fromRawAmount(token1, destTokenAmount)
      : undefined

    const minAmountOut = Amount.fromRawAmount(token1, destTokenMinAmount)

    return {
      ...trade,
      amountOut,
      minAmountOut,
      fee: getFeeString({
        fromToken: token0,
        toToken: token1,
        tokenOutPrice: token1Price,
        minAmountOut,
      }),
      // amountOut: getDestTokenAmount(swapAmount, token1, inputPrice),
      // minAmountOut: getDestTokenMinAmount(
      //   trade.srcChunkAmount,
      //   inputPrice,
      //   inputPrice === price, // todo: check
      //   token0,
      //   token1,
      // ),
    }
  }, [
    swapAmount,
    chainId,
    marketPrice,
    limitPrice,
    token0Price,
    isLimitOrder,
    token0,
    token1,
    expiry,
  ])
}

const usePrepareTwapOrderArgs = (trade: ReturnType<typeof useTwapTrade>) => {
  const {
    state: { chainId, swapAmount, token0, token1 },
  } = useDerivedStateTwap()

  return useMemo(() => {
    if (!trade || !trade.minAmountOut || !swapAmount || !token0 || !token1)
      return undefined

    const { minAmountOut, srcChunkAmount, duration, fillDelay } = trade

    const deadline = TwapSDK.onNetwork(chainId).orderDeadline(
      Date.now(),
      duration,
    )

    return TwapSDK.onNetwork(chainId).prepareOrderArgs({
      destTokenMinAmount: minAmountOut.toExact(), // TODO: check
      srcChunkAmount,
      deadline,
      fillDelay,
      srcAmount: swapAmount.quotient.toString(),
      srcTokenAddress: token0?.wrapped.address,
      destTokenAddress: token1?.wrapped.address,
    })
  }, [trade, swapAmount, token0, token1, chainId])
}

export {
  DerivedStateTwapProvider,
  useDerivedStateTwap,
  useTwapTrade,
  usePrepareTwapOrderArgs,
}
