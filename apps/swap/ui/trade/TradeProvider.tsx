'use client'

import { ChainId } from '@sushiswap/chain'
import { Amount, defaultQuoteCurrency, Native, tryParseAmount, Type } from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui/types'
import React, { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'
import { useAccount } from '@sushiswap/wagmi'
import { useRouter } from 'next/router'
import { Signature } from '@ethersproject/bytes'
import { nanoid } from 'nanoid'
import { SwapChainId } from 'types'
import { queryParamsSchema } from '../../lib/queryParamsSchema'
import { useTokenState } from '../TokenProvider'

interface InternalSwapState {
  isFallback: boolean
  tradeId: string
  review: boolean
  value: string
  bentoboxSignature: Signature | undefined
}

interface SwapState {
  token0: Type | undefined
  token1: Type | undefined
  network0: SwapChainId
  network1: SwapChainId
  amount: Amount<Type> | undefined
  appType: AppType
  tokensLoading: boolean
  recipient: string | undefined
}

type State = InternalSwapState & SwapState

type SwapApi = {
  setReview(value: boolean): void
  setRecipient(recipient: string): void
  setNetworks(chainId: SwapChainId): void
  setNetwork0(chainId: SwapChainId): void
  setNetwork1(chainId: SwapChainId): void
  setToken0(currency: Type): void
  setToken1(currency: Type): void
  setValue(value: string): void
  switchTokens(): void
  setTokens(currency0: Type, currency1: Type): void
  setAppType(appType: AppType): void
  setSearch(currency: Type): void
  setBentoboxSignature(signature: Signature | undefined): void
  setTradeId(id: string): void
  setFallback(val: boolean): void
}

export const SwapStateContext = createContext<State>({} as State)
export const SwapActionsContext = createContext<SwapApi>({} as SwapApi)

type Actions =
  | { type: 'setTradeId'; value: string }
  | { type: 'setValue'; value: string }
  | { type: 'setReview'; value: boolean }
  | { type: 'setBentoboxSignature'; value: Signature }
  | { type: 'setFallback'; value: boolean }

const reducer = (state: InternalSwapState, action: Actions): InternalSwapState => {
  switch (action.type) {
    case 'setTradeId':
      return { ...state, tradeId: action.value }
    case 'setReview':
      return { ...state, review: action.value }
    case 'setValue':
      return {
        ...state,
        value: action.value,
      }
    case 'setBentoboxSignature':
      return {
        ...state,
        bentoboxSignature: action.value,
      }
    case 'setFallback':
      return {
        ...state,
        isFallback: action.value,
      }
  }
}

interface SwapProviderProps {
  children: ReactNode
}

export const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const { address } = useAccount()
  const { query, push, pathname } = useRouter()
  const { fromCurrency, toCurrency, amount, recipient, review } = queryParamsSchema.parse(query)
  const { token0, token1, fromChainId, toChainId } = useTokenState()

  const [internalState, dispatch] = useReducer(reducer, {
    isFallback: true,
    tradeId: nanoid(),
    review: review ? review : false,
    value: !amount || amount === '0' ? '' : amount,
    bentoboxSignature: undefined,
  })

  // console.log({ token0, token1 })

  const state = useMemo(() => {
    return {
      ...internalState,
      appType: fromChainId === toChainId ? AppType.Swap : AppType.xSwap,
      token0,
      token1,
      network0: fromChainId,
      network1: toChainId,
      amount: tryParseAmount(internalState.value ? internalState.value.toString() : undefined, token0),
      tokensLoading: false,
    }
  }, [fromChainId, internalState, toChainId, token0, token1])

  const api = useMemo(() => {
    const setNetworks = (chainId: SwapChainId) => {
      const token0 = state.token0?.chainId === chainId ? state.token0 : Native.onChain(chainId)
      const token1 =
        state.token1?.chainId === chainId
          ? state.token1.isNative
            ? 'NATIVE'
            : state.token1.wrapped.address
          : defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency].address

      void push(
        {
          pathname,
          query: {
            ...query,
            fromChainId: chainId,
            fromCurrency: token0.isNative ? 'NATIVE' : token0.wrapped.address,
            toChainId: chainId,
            toCurrency: token1,
            amount: '',
          },
        },
        undefined
      )
    }

    const setNetwork0 = (chainId: SwapChainId) => {
      const fromCurrency =
        state.token0?.chainId === chainId ? (state.token0.isNative ? 'NATIVE' : state.token0.wrapped.address) : 'NATIVE'

      void push(
        {
          pathname,
          query: {
            ...query,
            fromChainId: chainId,
            fromCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setNetwork1 = (chainId: SwapChainId) => {
      const toCurrency =
        state.token1?.chainId === chainId
          ? state.token1.isNative
            ? 'NATIVE'
            : state.token1.wrapped.address
          : defaultQuoteCurrency[chainId as keyof typeof defaultQuoteCurrency].address

      void push(
        {
          pathname,
          query: {
            ...query,
            toChainId: chainId,
            toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setTokens = (currency0: Type, currency1: Type) => {
      void push(
        {
          pathname,
          query: {
            ...query,
            fromChainId: currency0.chainId,
            fromCurrency: currency0.isNative ? 'NATIVE' : currency0.wrapped.address,
            toChainId: currency1.chainId,
            toCurrency: currency1.isNative ? 'NATIVE' : currency1.wrapped.address,
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
            fromChainId: currency.chainId,
            fromCurrency: _fromCurrency,
            toChainId: toCurrency === _fromCurrency && toChainId === fromChainId ? fromChainId : toChainId,
            toCurrency: toCurrency === _fromCurrency && toChainId === fromChainId ? fromCurrency : toCurrency,
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
            fromChainId: fromCurrency === _toCurrency && toChainId === fromChainId ? toChainId : fromChainId,
            fromCurrency: fromCurrency === _toCurrency && toChainId === fromChainId ? toCurrency : fromCurrency,
            toChainId: currency.chainId,
            toCurrency: _toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const switchTokens = () =>
      void push(
        {
          pathname,
          query: {
            ...query,
            fromChainId: toChainId,
            fromCurrency: toCurrency,
            toChainId: fromChainId,
            toCurrency: fromCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    const setAppType = (appType: AppType) => {
      const network1 =
        appType === AppType.Swap
          ? state.network0
          : state.network1 === state.network0
          ? state.network1 === ChainId.ARBITRUM
            ? ChainId.ETHEREUM
            : ChainId.ARBITRUM
          : state.network1

      const token1 =
        state.token1?.chainId === network1
          ? state.token1.isNative
            ? 'NATIVE'
            : state.token1.wrapped.address
          : state.token0?.symbol === defaultQuoteCurrency[network1 as keyof typeof defaultQuoteCurrency].symbol
          ? 'NATIVE'
          : defaultQuoteCurrency[network1 as keyof typeof defaultQuoteCurrency].address

      void push(
        {
          pathname,
          query: {
            ...query,
            toChainId: network1,
            toCurrency: token1,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setSearch = (currency: Type) => {
      void push(
        {
          pathname,
          query: {
            ...query,
            fromChainId: currency.chainId,
            fromCurrency: 'NATIVE',
            toChainId: currency.chainId,
            toCurrency: currency.isNative ? 'NATIVE' : currency.wrapped.address,
          },
        },
        undefined,
        { shallow: true }
      )
    }

    const setValue = (value: string) => {
      if (value !== query.amount) {
        void push(
          {
            pathname,
            query: {
              ...query,
              fromChainId,
              fromCurrency,
              toChainId,
              toCurrency,
              amount: value,
            },
          },
          undefined,
          { shallow: true }
        )
      }
      dispatch({ type: 'setValue', value })
    }
    const setRecipient = (recipient: string) => {
      if (recipient !== query.recipient) {
        void push(
          {
            pathname,
            query: {
              ...query,
              recipient,
            },
          },
          undefined,
          { shallow: true }
        )
      }
    }
    const setReview = (value: boolean) => dispatch({ type: 'setReview', value })
    const setBentoboxSignature = (value: Signature) => dispatch({ type: 'setBentoboxSignature', value })
    const setTradeId = (value: string) => dispatch({ type: 'setTradeId', value })
    const setFallback = (value: boolean) => dispatch({ type: 'setFallback', value })

    return {
      setTradeId,
      setNetworks,
      setNetwork0,
      setNetwork1,
      setToken0,
      setToken1,
      setValue,
      switchTokens,
      setRecipient,
      setReview,
      setTokens,
      setAppType,
      setSearch,
      setBentoboxSignature,
      setFallback,
    }
  }, [
    fromChainId,
    fromCurrency,
    pathname,
    push,
    query,
    state.network0,
    state.network1,
    state.token0,
    state.token1,
    toChainId,
    toCurrency,
  ])

  return (
    <SwapActionsContext.Provider value={api}>
      <SwapStateContext.Provider
        value={useMemo(() => ({ ...state, recipient: recipient ?? address }), [address, recipient, state])}
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
