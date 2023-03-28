'use client'

import { ChainId } from '@sushiswap/chain'
import { currencyFromShortCurrencyName, isShortCurrencyName, Native, Token, Type } from '@sushiswap/currency'
import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useToken } from '@sushiswap/react-query'
import { isAddress } from 'ethers/lib/utils'
import { z } from 'zod'
import { ConstantProductPoolFactoryChainId, isConstantProductPoolFactoryChainId } from '@sushiswap/trident'
import { Fee } from '@sushiswap/amm'
import { FeeAmount } from '@sushiswap/v3-sdk'

export const queryParamsSchema = z.object({
  chainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ARBITRUM)
    .transform((chainId) => chainId as ConstantProductPoolFactoryChainId)
    .refine((chainId) => isConstantProductPoolFactoryChainId(chainId), {
      message: 'ChainId not supported.',
    }),
  fromCurrency: z.string().default('NATIVE'),
  toCurrency: z.string().default('SUSHI'),
  feeAmount: z.coerce
    .number()
    .int()
    .optional()
    .default(FeeAmount.MEDIUM)
    .transform((fee) => fee as FeeAmount | undefined),
})

type State = {
  chainId: ConstantProductPoolFactoryChainId
  token0: Type | undefined
  token1: Type | undefined
  tokensLoading: boolean
  feeAmount: FeeAmount | undefined
  setNetwork(chainId: ChainId): void
  setToken0(currency: Type): void
  setToken1(currency: Type): void
  setFeeAmount(feeAmount: FeeAmount): void
}

export const TokenStateContext = createContext<State>({} as State)

interface ConcentratedLiquidityURLStateProvider {
  children: ReactNode
}

const getTokenFromUrl = (chainId: ChainId, currencyId: string, token: Token | undefined, isLoading: boolean) => {
  if (isLoading) {
    return undefined
  } else if (isShortCurrencyName(chainId, currencyId)) {
    return currencyFromShortCurrencyName(chainId, currencyId)
  } else if (isAddress(currencyId) && token) {
    return token
  } else {
    return Native.onChain(chainId ? chainId : ChainId.ETHEREUM)
  }
}

export const ConcentratedLiquidityURLStateProvider: FC<ConcentratedLiquidityURLStateProvider> = ({ children }) => {
  const { query, push, pathname } = useRouter()
  const { chainId, fromCurrency, toCurrency, feeAmount: _feeAmount } = queryParamsSchema.parse(query)
  const { data: tokenFrom, isInitialLoading: isTokenFromLoading } = useToken({
    chainId,
    address: fromCurrency,
  })

  const { data: tokenTo, isInitialLoading: isTokenToLoading } = useToken({ chainId, address: toCurrency })

  const state = useMemo(() => {
    const token0 = getTokenFromUrl(chainId, fromCurrency, tokenFrom, isTokenFromLoading)
    const token1 = getTokenFromUrl(chainId, toCurrency, tokenTo, isTokenToLoading)
    const feeAmount = _feeAmount && Object.values(FeeAmount).includes(_feeAmount) ? _feeAmount : undefined

    const setNetwork = (chainId: ChainId) => {
      const fromCurrency =
        state.token0?.chainId === chainId ? (state.token0.isNative ? 'NATIVE' : state.token0.wrapped.address) : 'NATIVE'

      void push(
        {
          pathname,
          query: {
            ...query,
            chainId: chainId,
            fromCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }

    const setToken0 = (currency: Type) => {
      const _fromCurrency = currency.isNative ? 'NATIVE' : currency.wrapped.address
      void push(
        {
          pathname,
          query: {
            ...query,
            fromCurrency: _fromCurrency,
            toCurrency: toCurrency === _fromCurrency ? fromCurrency : toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken1 = (currency: Type) => {
      const _toCurrency = currency.isNative ? 'NATIVE' : currency.wrapped.address

      void push(
        {
          pathname,
          query: {
            ...query,
            fromCurrency: fromCurrency === _toCurrency ? toCurrency : fromCurrency,
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

    return {
      feeAmount,
      token0,
      token1,
      chainId,
      tokensLoading: isTokenFromLoading || isTokenToLoading,
      setToken0,
      setToken1,
      setNetwork,
      setFeeAmount,
    }
  }, [
    _feeAmount,
    chainId,
    fromCurrency,
    isTokenFromLoading,
    isTokenToLoading,
    pathname,
    push,
    query,
    toCurrency,
    tokenFrom,
    tokenTo,
  ])

  return <TokenStateContext.Provider value={state}>{children}</TokenStateContext.Provider>
}

export const useConcentratedLiquidityURLState = () => {
  const context = useContext(TokenStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside Token State Context')
  }

  return context
}
