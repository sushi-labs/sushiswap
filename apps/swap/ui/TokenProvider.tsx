'use client'

import { ChainId } from '@sushiswap/chain'
import { currencyFromShortCurrencyName, isShortCurrencyName, Native, Token, Type } from '@sushiswap/currency'
import React, { createContext, FC, ReactNode, useContext, useMemo } from 'react'
import { useRouter } from 'next/router'
import { useToken } from '@sushiswap/react-query'
import { isAddress } from 'ethers/lib/utils'
import { queryParamsSchema } from '../lib/queryParamsSchema'

type State = {
  token0: Type | undefined
  token1: Type | undefined
  tokensLoading: boolean
}

export const TokenStateContext = createContext<State>({} as State)

interface TokenProvider {
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

export const TokenProvider: FC<TokenProvider> = ({ children }) => {
  const { query } = useRouter()
  const { fromChainId, fromCurrency, toChainId, toCurrency } = queryParamsSchema.parse(query)
  const { data: tokenFrom, isInitialLoading: isTokenFromLoading } = useToken({
    chainId: fromChainId,
    address: fromCurrency,
  })

  const { data: tokenTo, isInitialLoading: isTokenToLoading } = useToken({ chainId: toChainId, address: toCurrency })

  const state = useMemo(() => {
    const token0 = getTokenFromUrl(fromChainId, fromCurrency, tokenFrom, isTokenFromLoading)
    const token1 = getTokenFromUrl(toChainId, toCurrency, tokenTo, isTokenToLoading)

    return {
      token0,
      token1,
      tokensLoading: isTokenFromLoading || isTokenToLoading,
    }
  }, [fromChainId, fromCurrency, isTokenFromLoading, isTokenToLoading, toChainId, toCurrency, tokenFrom, tokenTo])

  return <TokenStateContext.Provider value={state}>{children}</TokenStateContext.Provider>
}

export const useTokenState = () => {
  const context = useContext(TokenStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside Token State Context')
  }

  return context
}
