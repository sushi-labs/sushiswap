import { ChainId } from '@sushiswap/chain'
import { currencyFromShortCurrencyName, isShortCurrencyName, Native, Token, Type } from '@sushiswap/currency'
import React, { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react'
import { isAddress } from 'ethers/lib/utils'
import { useTokenWithCache } from '@sushiswap/wagmi/future/hooks'
import { SwapChainId } from '../../types'
import { useRouter } from 'next/router'
import { useNetwork } from '@sushiswap/wagmi'
import { queryParamsSchema } from '../../lib/swap/queryParamsSchema'
import z from 'zod'
interface State extends Pick<z.TypeOf<typeof queryParamsSchema>, 'amount' | 'review' | 'recipient'> {
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

export const useTokenQueryParams = () => {
  const { query } = useRouter()
  const { chain } = useNetwork()
  const [chainId] = useState(chain?.id)
  return useMemo(
    () =>
      queryParamsSchema.parse({
        ...query,
        fromChainId: query?.fromChainId ?? chainId,
        toChainId: query?.toChainId ?? chainId,
      }),
    [chainId, query]
  )
}

export const TokenProvider: FC<TokenProvider> = ({ children }) => {
  const { fromChainId, fromCurrency, toChainId, toCurrency, amount, recipient, review } = useTokenQueryParams()
  const { data: tokenFrom, isInitialLoading: isTokenFromLoading } = useTokenWithCache({
    chainId: fromChainId,
    address: fromCurrency,
  })

  const { data: tokenTo, isInitialLoading: isTokenToLoading } = useTokenWithCache({
    chainId: toChainId,
    address: toCurrency,
  })

  const state = useMemo(() => {
    const token0 = getTokenFromUrl(fromChainId, fromCurrency, tokenFrom, isTokenFromLoading)
    const token1 = getTokenFromUrl(toChainId, toCurrency, tokenTo, isTokenToLoading)

    return {
      token0,
      token1,
      tokensLoading: isTokenFromLoading || isTokenToLoading,
      fromChainId,
      toChainId,
      amount,
      recipient,
      review,
    }
  }, [
    amount,
    fromChainId,
    fromCurrency,
    isTokenFromLoading,
    isTokenToLoading,
    recipient,
    review,
    toChainId,
    toCurrency,
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
