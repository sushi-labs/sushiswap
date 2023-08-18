'use client'

import { ChainId } from '@sushiswap/chain'
import {
  currencyFromShortCurrencyName,
  defaultQuoteCurrency,
  isShortCurrencyName,
  Native,
  Token,
  Type,
} from '@sushiswap/currency'
import { isTridentChainId } from '@sushiswap/trident-sdk'
import { isSushiSwapV2ChainId } from '@sushiswap/v2-sdk'
import { isSushiSwapV3ChainId } from '@sushiswap/v3-sdk'
import { useNetwork } from '@sushiswap/wagmi'
import { useTokenWithCache } from '@sushiswap/wagmi/future/hooks'
import { useSearchParams } from 'next/navigation'
import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react'
import { isAddress } from 'viem'

import { queryParamsSchema } from '../../../lib/swap/queryParamsSchema'
import { SwapChainId } from '../../../types'

type State = {
  token0: Type | undefined
  token1: Type | undefined
  tokensLoading: boolean
  fromChainId: SwapChainId
  toChainId: SwapChainId
}

export const TokenStateContext = createContext<State>({} as State)

interface TokenProvider {
  children: ReactNode
}

const getTokenFromUrl = (chainId: ChainId, currencyId: string | null, token: Token | undefined, isLoading: boolean) => {
  if (isLoading) {
    return undefined
  } else if (!currencyId) {
    return defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency]
  } else if (isShortCurrencyName(chainId, currencyId)) {
    return currencyFromShortCurrencyName(chainId, currencyId)
  } else if (isAddress(currencyId) && token) {
    return token
  } else {
    return Native.onChain(chainId ? chainId : ChainId.ETHEREUM)
  }
}

const getChainIdFromUrl = (urlChainId: ChainId | undefined, connectedChainId: ChainId | undefined): SwapChainId => {
  let chainId: SwapChainId = ChainId.ETHEREUM
  if (urlChainId) {
    if (isSushiSwapV3ChainId(urlChainId) || isSushiSwapV2ChainId(urlChainId) || isTridentChainId(urlChainId)) {
      chainId = urlChainId
    }
  } else if (connectedChainId) {
    if (
      isSushiSwapV3ChainId(connectedChainId) ||
      isSushiSwapV2ChainId(connectedChainId) ||
      isTridentChainId(connectedChainId)
    ) {
      chainId = connectedChainId
    }
  }
  return chainId
}

export const TokenProvider: FC<TokenProvider> = ({ children }) => {
  // const { query } = useRouter()

  const searchParams = useSearchParams()

  const fromChainId = searchParams?.get('fromChainId')
  const fromCurrency = searchParams?.get('fromCurrency')
  const toChainId = searchParams?.get('toChainId')
  const toCurrency = searchParams?.get('toCurrency')
  const amount = searchParams?.get('amount')

  const {
    fromChainId: _fromChainId,
    fromCurrency: _fromCurrency,
    toChainId: _toChainId,
    toCurrency: _toCurrency,
  } = queryParamsSchema.parse({
    fromChainId,
    fromCurrency,
    toChainId,
    toCurrency,
    amount,
  })
  const { chain } = useNetwork()
  const [chainId] = useState(chain?.id)

  const { data: tokenFrom, isInitialLoading: isTokenFromLoading } = useTokenWithCache({
    chainId: _fromChainId,
    address: _fromCurrency,
  })

  const { data: tokenTo, isInitialLoading: isTokenToLoading } = useTokenWithCache({
    chainId: _toChainId,
    address: _toCurrency,
  })

  const state = useMemo(() => {
    const fromChainId = getChainIdFromUrl(_fromChainId, chainId as ChainId)
    const toChainId = getChainIdFromUrl(_toChainId, chainId as ChainId)
    const token0 = _fromCurrency
      ? getTokenFromUrl(fromChainId, _fromCurrency, tokenFrom, isTokenFromLoading)
      : Native.onChain(fromChainId)
    const token1 = _toCurrency
      ? getTokenFromUrl(toChainId, _toCurrency, tokenTo, isTokenToLoading)
      : defaultQuoteCurrency[toChainId as keyof typeof defaultQuoteCurrency]

    return {
      token0,
      token1,
      tokensLoading: isTokenFromLoading || isTokenToLoading,
      fromChainId,
      toChainId,
    }
  }, [
    _fromChainId,
    _toChainId,
    chainId,
    _fromCurrency,
    isTokenFromLoading,
    isTokenToLoading,
    _toCurrency,
    tokenFrom,
    tokenTo,
  ])

  return <TokenStateContext.Provider value={state}>{children}</TokenStateContext.Provider>
}

export const useTokenState = () => {
  const context = useContext(TokenStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside Token State Context')
  }

  return context
}
