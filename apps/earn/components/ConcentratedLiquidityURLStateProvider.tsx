'use client'

import { ChainId } from '@sushiswap/chain'
import { currencyFromShortCurrencyName, isShortCurrencyName, Native, Token, Type } from '@sushiswap/currency'
import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import { isAddress } from 'ethers/lib/utils'
import { z } from 'zod'
import { FeeAmount, isSushiSwapV3ChainId, SushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useTokenWithCache } from '@sushiswap/wagmi/future/hooks'
import { useNetwork } from '@sushiswap/wagmi'

export const queryParamsSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .optional()
    .transform((chainId) => chainId as SushiSwapV3ChainId | undefined),
  fromCurrency: z.string().default('NATIVE'),
  toCurrency: z.string().optional(),
  feeAmount: z.coerce
    .number()
    .int()
    .default(FeeAmount.MEDIUM)
    .transform((fee) => fee as FeeAmount),
  tokenId: z.coerce
    .number()
    .int()
    .transform((val) => val.toString())
    .optional(),
})

type State = {
  tokenId: string | undefined
  chainId: SushiSwapV3ChainId
  token0: Type | undefined
  token1: Type | undefined
  tokensLoading: boolean
  feeAmount: FeeAmount
  setNetwork(chainId: SushiSwapV3ChainId): void
  setToken0(currency: Type): void
  setToken1(currency: Type): void
  setFeeAmount(feeAmount: FeeAmount): void
  switchTokens(): void
}

export const ConcentratedLiquidityUrlStateContext = createContext<State>({} as State)

interface ConcentratedLiquidityURLStateProvider {
  children: ReactNode | ((state: State) => ReactNode)
}

const getTokenFromUrl = (
  chainId: ChainId,
  currencyId: string | undefined,
  token: Token | undefined,
  isLoading: boolean
) => {
  if (isLoading) {
    return undefined
  } else if (currencyId && isShortCurrencyName(chainId, currencyId)) {
    return currencyFromShortCurrencyName(chainId, currencyId)
  } else if (currencyId && isAddress(currencyId) && token) {
    return token
  } else if (!currencyId) {
    return undefined
  } else {
    return Native.onChain(chainId ? chainId : ChainId.ETHEREUM)
  }
}

const getChainIdFromUrl = (urlChainId: ChainId | undefined, connectedChainId: ChainId | undefined): SushiSwapV3ChainId => {
  let chainId: SushiSwapV3ChainId = ChainId.ETHEREUM
  if (urlChainId && isSushiSwapV3ChainId(urlChainId)) {
    chainId = urlChainId
  } else if (connectedChainId && isSushiSwapV3ChainId(connectedChainId)) {
    chainId = connectedChainId
  }
  return chainId
}

export const ConcentratedLiquidityURLStateProvider: FC<ConcentratedLiquidityURLStateProvider> = ({ children }) => {
  const { query, push, pathname } = useRouter()
  const { chainId: chainIdFromUrl, fromCurrency, toCurrency, feeAmount, tokenId } = queryParamsSchema.parse(query)
  const { chain } = useNetwork()
  const [chainId] = useState(chain?.id)

  const _chainId = getChainIdFromUrl(chainIdFromUrl, chainId as ChainId)

  const { data: tokenFrom, isInitialLoading: isTokenFromLoading } = useTokenWithCache({
    chainId: _chainId,
    address: fromCurrency,
  })

  const { data: tokenTo, isInitialLoading: isTokenToLoading } = useTokenWithCache({
    chainId: _chainId,
    address: toCurrency,
  })

  const state = useMemo(() => {
    const token0 = getTokenFromUrl(_chainId, fromCurrency, tokenFrom, isTokenFromLoading)
    let token1 = getTokenFromUrl(_chainId, toCurrency, tokenTo, isTokenToLoading)

    // Cant have two of the same tokens
    if (
      token1?.wrapped.address === token0?.wrapped.address ||
      (token0 && token1 && token0.chainId !== token1.chainId)
    ) {
      token1 = undefined
    }

    const setNetwork = (chainId: SushiSwapV3ChainId) => {
      const fromCurrency =
        state.token0?.chainId === chainId ? (state.token0.isNative ? 'NATIVE' : state.token0.wrapped.address) : 'NATIVE'
      const toCurrency =
        state.token1?.chainId === chainId
          ? state.token1.isNative
            ? 'NATIVE'
            : state.token1.wrapped.address
          : undefined

      void push(
        {
          pathname,
          query: {
            chainId: chainId,
            fromCurrency,
            ...(toCurrency && { toCurrency }),
          },
        },
        undefined,
        { shallow: true }
      )
    }

    const setToken0 = (currency: Type) => {
      const same = currency.wrapped.address === token1?.wrapped.address
      const _fromCurrency = currency.isNative ? 'NATIVE' : currency.wrapped.address

      void push(
        {
          pathname,
          query: {
            ...query,
            chainId: currency.chainId,
            fromCurrency: _fromCurrency,
            toCurrency: toCurrency === _fromCurrency || same ? fromCurrency : toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken1 = (currency: Type) => {
      const same = currency.wrapped.address === token0?.wrapped.address
      const _toCurrency = currency.isNative ? 'NATIVE' : currency.wrapped.address

      void push(
        {
          pathname,
          query: {
            ...query,
            chainId: currency.chainId,
            fromCurrency: fromCurrency === _toCurrency || same ? toCurrency : fromCurrency,
            toCurrency: _toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setFeeAmount = (feeAmount: FeeAmount) => {
      void push(
        {
          pathname,
          query: {
            ...query,
            feeAmount,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const switchTokens = () => {
      void push(
        {
          pathname,
          query: {
            ...query,
            fromCurrency: token1?.isNative ? 'NATIVE' : token1?.wrapped.address,
            toCurrency: token0?.isNative ? 'NATIVE' : token0?.wrapped.address,
          },
        },
        undefined,
        { shallow: true }
      )
    }

    return {
      tokenId,
      feeAmount,
      token0,
      token1,
      chainId: _chainId,
      tokensLoading: isTokenFromLoading || isTokenToLoading,
      setToken0,
      setToken1,
      setNetwork,
      setFeeAmount,
      switchTokens,
    }
  }, [
    _chainId,
    fromCurrency,
    tokenFrom,
    isTokenFromLoading,
    toCurrency,
    tokenTo,
    isTokenToLoading,
    tokenId,
    feeAmount,
    push,
    pathname,
    query,
  ])

  return (
    <ConcentratedLiquidityUrlStateContext.Provider value={state}>
      {typeof children === 'function' ? children(state) : children}
    </ConcentratedLiquidityUrlStateContext.Provider>
  )
}

export const useConcentratedLiquidityURLState = () => {
  const context = useContext(ConcentratedLiquidityUrlStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside Token State Context')
  }

  return context
}
