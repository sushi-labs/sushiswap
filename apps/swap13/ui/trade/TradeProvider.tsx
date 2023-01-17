'use client'

import { ChainId } from '@sushiswap/chain'
import {
  Amount,
  Native,
  SUSHI,
  tryParseAmount,
  Type,
  isShortCurrencyName,
  currencyFromShortCurrencyName,
} from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui13/types'
import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useReducer } from 'react'
import { useAccount } from 'wagmi'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { useCustomTokens, useToken } from '@sushiswap/react-query'
import { getAddress, isAddress } from 'ethers/lib/utils'
// import { watchNetwork } from '@wagmi/core'

export const queryParamsSchema = z.object({
  fromChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM),
  toChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM),
  fromCurrencyId: z.string().default('NATIVE'),
  toCurrencyId: z.string().default('SUSHI'),
  amount: z.optional(z.coerce.bigint()),
  recipient: z.optional(z.string()),
})

interface InternalSwapState {
  review: boolean
  recipient: string | undefined
  value: string
}

interface SwapState {
  token0: Type
  token1: Type
  network0: ChainId
  network1: ChainId
  amount: Amount<Type> | undefined
  appType: AppType
  token0NotInList: boolean
  token1NotInList: boolean
  tokensLoading: boolean
}

type State = InternalSwapState & SwapState

type SwapApi = {
  setReview(value: boolean): void
  setRecipient(recipient: string): void
  setNetwork0(chainId: ChainId): void
  setNetwork1(chainId: ChainId): void
  setAppType(appType: AppType): void
  setToken0(currency: Type): void
  setToken1(currency: Type): void
  setValue(value: string): void
  switchTokens(): void
  setTokens(currency0: Type, currency1: Type): void
}

export const SwapStateContext = createContext<State>({} as State)
export const SwapActionsContext = createContext<SwapApi>({} as SwapApi)

type Actions =
  | { type: 'setValue'; value: string }
  | { type: 'setRecipient'; recipient: string }
  | { type: 'setReview'; value: boolean }

const reducer = (state: InternalSwapState, action: Actions): InternalSwapState => {
  switch (action.type) {
    case 'setReview':
      return { ...state, review: action.value }
    case 'setRecipient':
      return { ...state, recipient: action.recipient }
    case 'setValue':
      return {
        ...state,
        value: action.value,
      }
  }
}

interface SwapProviderProps {
  children: ReactNode
}

export const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const { address } = useAccount()
  const { query, push } = useRouter()
  const { fromChainId, toChainId, fromCurrencyId, toCurrencyId, amount: _amount } = queryParamsSchema.parse(query)
  const { data: customTokens, isLoading: customTokensLoading } = useCustomTokens()
  const { data: tokenFrom, isLoading: isTokenFromLoading } = useToken({
    chainId: fromChainId,
    address: fromCurrencyId,
  })

  const { data: tokenTo, isLoading: isTokenToLoading } = useToken({
    chainId: toChainId,
    address: toCurrencyId,
  })

  // console.log(isAddress(fromCurrencyId), !tokenFrom, isTokenFromFetchedAfterMount)
  const [internalState, dispatch] = useReducer(reducer, {
    review: false,
    // TODO: no recipient
    recipient: address ? address : undefined,
    value: _amount ? _amount.toString() : '',
  })

  const state = useMemo(() => {
    const token0 = isShortCurrencyName(fromChainId, fromCurrencyId)
      ? currencyFromShortCurrencyName(fromChainId, fromCurrencyId)
      : customTokens && isAddress(fromCurrencyId) && customTokens[`${toChainId}:${getAddress(fromCurrencyId)}`]
      ? customTokens[`${toChainId}:${getAddress(fromCurrencyId)}`]
      : tokenFrom
      ? tokenFrom
      : Native.onChain(fromChainId ? fromChainId : ChainId.ETHEREUM)
    const token1 = isShortCurrencyName(toChainId, toCurrencyId)
      ? currencyFromShortCurrencyName(toChainId, toCurrencyId)
      : customTokens && isAddress(toCurrencyId) && customTokens[`${toChainId}:${getAddress(toCurrencyId)}`]
      ? customTokens[`${toChainId}:${getAddress(toCurrencyId)}`]
      : tokenTo
      ? tokenTo
      : SUSHI[toChainId && toChainId in SUSHI ? (toChainId as keyof typeof SUSHI) : ChainId.ETHEREUM]

    return {
      ...internalState,
      appType: fromChainId === toChainId ? AppType.Swap : AppType.xSwap,
      token0,
      token1,
      network0: fromChainId,
      network1: toChainId,
      amount: tryParseAmount(internalState.value ? internalState.value.toString() : undefined, token0),
      token0NotInList:
        (isAddress(fromCurrencyId) &&
          !tokenFrom &&
          !isTokenFromLoading &&
          customTokens &&
          !customTokens[`${fromChainId}:${getAddress(fromCurrencyId)}`]) ||
        false,
      token1NotInList:
        (isAddress(toCurrencyId) &&
          !tokenTo &&
          !isTokenToLoading &&
          customTokens &&
          !customTokens[`${toChainId}:${getAddress(toCurrencyId)}`]) ||
        false,
      tokensLoading:
        customTokensLoading ||
        (isAddress(fromCurrencyId) && isTokenFromLoading) ||
        (isAddress(toCurrencyId) && isTokenToLoading),
    }
  }, [
    customTokens,
    customTokensLoading,
    fromChainId,
    fromCurrencyId,
    internalState,
    isTokenFromLoading,
    isTokenToLoading,
    toChainId,
    toCurrencyId,
    tokenFrom,
    tokenTo,
  ])

  const api = useMemo(() => {
    const setNetwork0 = (chainId: ChainId) =>
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromCurrencyId: Native.onChain(chainId).symbol,
            toCurrencyId: 'SUSHI',
            fromChainId: chainId,
          },
        },
        undefined,
        { shallow: true }
      )
    const setNetwork1 = (chainId: ChainId) =>
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromCurrencyId: Native.onChain(chainId).symbol,
            toCurrencyId: 'SUSHI',
            toChainId: chainId,
          },
        },
        undefined,
        { shallow: true }
      )
    const setTokens = (currency0: Type, currency1: Type) => {
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromCurrencyId: currency0.isNative ? currency0.symbol : currency0.wrapped.address,
            toCurrencyId: currency1.isNative ? currency1.symbol : currency1.wrapped.address,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken0 = (currency: Type) => {
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromCurrencyId: currency.isNative ? currency.symbol : currency.wrapped.address,
            toCurrencyId: query.fromCurrencyId === query.toCurrencyId ? query.fromCurrencyId : query.toCurrencyId,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken1 = (currency: Type) => {
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromCurrencyId: query.fromCurrencyId === query.toCurrencyId ? query.toCurrencyId : query.fromCurrencyId,
            toCurrencyId: currency.isNative ? currency.symbol : currency.wrapped.address,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const switchTokens = () =>
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromChainId: query.toChainId,
            toChainId: query.fromChainId,
            fromCurrencyId: query.toCurrencyId,
            toCurrencyId: query.fromCurrencyId,
          },
        },
        undefined,
        { shallow: true }
      )

    const setAppType = (appType: AppType) => {
      const network1 =
        appType === AppType.Swap
          ? query.fromChainId
          : query.fromChainId === query.toChainId
          ? ChainId.ARBITRUM
          : query.toChainId

      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            toChainId: network1,
            toCurrencyId: 'SUSHI',
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setValue = (value: string) => dispatch({ type: 'setValue', value })
    const setRecipient = (recipient: string) => dispatch({ type: 'setRecipient', recipient })
    const setReview = (value: boolean) => dispatch({ type: 'setReview', value })

    return {
      setNetwork0,
      setNetwork1,
      setToken0,
      setToken1,
      setAppType,
      setValue,
      switchTokens,
      setRecipient,
      setReview,
      setTokens,
    }
  }, [push, query])

  // useEffect(() => {
  //   const unwatch = watchNetwork(({ chain }) => (chain ? api.setNetwork0(chain.id) : undefined))
  //   return () => unwatch()
  // }, [api])

  return (
    <SwapActionsContext.Provider value={api}>
      <SwapStateContext.Provider
        value={useMemo(() => ({ ...state, recipient: state.recipient ?? address }), [address, state])}
      >
        {children}
      </SwapStateContext.Provider>
    </SwapActionsContext.Provider>
  )
}

export const useSwapState = () => {
  const context = useContext(SwapStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside State Context')
  }

  return context
}

export const useSwapActions = () => {
  const context = useContext(SwapActionsContext)
  if (!context) {
    throw new Error('Hook can only be used inside State Actions Context')
  }

  return context
}
