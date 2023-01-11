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
import React, { FC, ReactNode, useMemo, useReducer } from 'react'
import { useAccount } from 'wagmi'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { createContext, useContext } from 'use-context-selector'

const schema = z.object({
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

interface SwapState {
  review: boolean
  recipient: string | undefined
  token0: Type
  token1: Type
  network0: ChainId
  network1: ChainId
  value: string
  amount: Amount<Type> | undefined
  appType: AppType
}

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
}

export const SwapStateContext = createContext<SwapState>({} as SwapState)
export const SwapActionsContext = createContext<SwapApi>({} as SwapApi)

type Actions =
  | { type: 'setNetwork0'; chainId: ChainId }
  | { type: 'setNetwork1'; chainId: ChainId }
  | { type: 'setToken0'; currency: Type }
  | { type: 'setToken1'; currency: Type }
  | { type: 'setAppType'; appType: AppType }
  | { type: 'setValue'; value: string }
  | { type: 'switchTokens' }
  | { type: 'setRecipient'; recipient: string }
  | { type: 'setReview'; value: boolean }

const reducer = (state: SwapState, action: Actions): SwapState => {
  switch (action.type) {
    case 'setReview':
      return { ...state, review: action.value }
    case 'setRecipient':
      return { ...state, recipient: action.recipient }
    case 'setNetwork0':
      return {
        ...state,
        network0: action.chainId,
        token0: Native.onChain(action.chainId),
      }
    case 'setNetwork1':
      return {
        ...state,
        network1: action.chainId,
        token1: Native.onChain(action.chainId),
      }
    case 'setToken0':
      return {
        ...state,
        token0: action.currency,
        // if token1 is set to whatever token token0 is about to be set too, set token1 to token0
        token1: state.token1.wrapped.address === action.currency.wrapped.address ? state.token0 : state.token1,
      }
    case 'setToken1':
      return {
        ...state,
        // if token0 is set to whatever token token1 is about to be set too, set token0 to token1
        token0: state.token0.wrapped.address === action.currency.wrapped.address ? state.token1 : state.token0,
        token1: action.currency,
      }
    case 'setAppType': {
      const network1 =
        action.appType === AppType.Swap
          ? state.network0
          : state.network0 === state.network1
          ? ChainId.ARBITRUM
          : state.network1

      return {
        ...state,
        appType: action.appType,
        network1,
        token0: Native.onChain(state.network0),
        token1: SUSHI[network1 as keyof typeof SUSHI],
      }
    }
    case 'setValue':
      return {
        ...state,
        value: action.value,
        amount: tryParseAmount(action.value, state.token0),
      }
    case 'switchTokens':
      return {
        ...state,
        token0: state.token1,
        token1: state.token0,
        network0: state.network1,
        network1: state.network0,
        amount: tryParseAmount(state.value, state.token1),
      }
  }
}

interface SwapProviderProps {
  children: ReactNode
}

export const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const { address } = useAccount()
  const { query } = useRouter()
  const { fromChainId, toChainId, fromCurrencyId, toCurrencyId, amount, recipient } = schema.parse(query)

  const [state, dispatch] = useReducer(reducer, {
    review: false,
    recipient: recipient ? recipient : address ? address : undefined,
    appType: fromChainId === toChainId ? AppType.Swap : AppType.xSwap,
    token0: isShortCurrencyName(fromChainId, fromCurrencyId)
      ? currencyFromShortCurrencyName(fromChainId, fromCurrencyId)
      : Native.onChain(fromChainId ? fromChainId : ChainId.ETHEREUM),
    token1: isShortCurrencyName(toChainId, toCurrencyId)
      ? currencyFromShortCurrencyName(toChainId, toCurrencyId)
      : SUSHI[toChainId && toChainId in SUSHI ? (toChainId as keyof typeof SUSHI) : ChainId.ETHEREUM],
    network0: fromChainId,
    network1: toChainId,
    value: amount ? amount.toString() : '',
    amount: tryParseAmount(
      amount ? amount.toString() : undefined,
      isShortCurrencyName(fromChainId, fromCurrencyId)
        ? currencyFromShortCurrencyName(fromChainId, fromCurrencyId)
        : Native.onChain(fromChainId ? fromChainId : ChainId.ETHEREUM)
    ),
  })

  const api = useMemo(() => {
    const setNetwork0 = (chainId: ChainId) => dispatch({ type: 'setNetwork0', chainId })
    const setNetwork1 = (chainId: ChainId) => dispatch({ type: 'setNetwork1', chainId })
    const setToken0 = (currency: Type) => dispatch({ type: 'setToken0', currency })
    const setToken1 = (currency: Type) => dispatch({ type: 'setToken1', currency })
    const setAppType = (appType: AppType) => dispatch({ type: 'setAppType', appType })
    const setValue = (value: string) => dispatch({ type: 'setValue', value })
    const switchTokens = () => dispatch({ type: 'switchTokens' })
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
    }
  }, [])

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
