'use client'

import { ChainId } from '@sushiswap/chain'
import {
  Amount,
  currencyFromShortCurrencyName,
  isShortCurrencyName,
  Native,
  SUSHI,
  tryParseAmount,
  Type,
} from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui/types'
import React, { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'
import { useAccount } from 'wagmi'
import { z } from 'zod'
import { useRouter } from 'next/router'
import { useCustomTokens, useToken, useTokens } from '@sushiswap/react-query'
import { getAddress, isAddress } from 'ethers/lib/utils'
import { Signature } from '@ethersproject/bytes'
import { nanoid } from 'nanoid'

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
  tradeId: string
  review: boolean
  recipient: string | undefined
  value: string
  bentoboxSignature: Signature | undefined
}

interface SwapState {
  token0: Type | undefined
  token1: Type | undefined
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
  setNetworks(chainId: ChainId): void
  setNetwork0(chainId: ChainId): void
  setNetwork1(chainId: ChainId): void
  setToken0(currency: Type): void
  setToken1(currency: Type): void
  setValue(value: string): void
  switchTokens(): void
  setTokens(currency0: Type, currency1: Type): void
  setAppType(appType: AppType): void
  setSearch(currency: Type): void
  setBentoboxSignature(signature: Signature | undefined): void
  setTradeId(id: string): void
}

export const SwapStateContext = createContext<State>({} as State)
export const SwapActionsContext = createContext<SwapApi>({} as SwapApi)

type Actions =
  | { type: 'setTradeId'; value: string }
  | { type: 'setValue'; value: string }
  | { type: 'setRecipient'; recipient: string }
  | { type: 'setReview'; value: boolean }
  | { type: 'setBentoboxSignature'; value: Signature }

const reducer = (state: InternalSwapState, action: Actions): InternalSwapState => {
  switch (action.type) {
    case 'setTradeId':
      return { ...state, tradeId: action.value }
    case 'setReview':
      return { ...state, review: action.value }
    case 'setRecipient':
      return { ...state, recipient: action.recipient }
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
  }
}

interface SwapProviderProps {
  children: ReactNode
}

export const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const { address, isConnected } = useAccount()
  const { query, push } = useRouter()
  const { fromChainId, toChainId, fromCurrencyId, toCurrencyId, amount: _amount } = queryParamsSchema.parse(query)
  const { data: customTokens, isLoading: customTokensLoading } = useCustomTokens()
  const { data: tokenMapFrom } = useTokens({ chainId: fromChainId })
  const { data: tokenMapTo } = useTokens({ chainId: toChainId })
  const { data: tokenFrom } = useToken({
    chainId: fromChainId,
    address: fromCurrencyId,
  })

  const { data: tokenTo } = useToken({
    chainId: toChainId,
    address: toCurrencyId,
  })

  // console.log(isAddress(fromCurrencyId), !tokenFrom, isTokenFromFetchedAfterMount)
  const [internalState, dispatch] = useReducer(reducer, {
    tradeId: nanoid(),
    review: false,
    // TODO: no recipient
    recipient: address ? address : undefined,
    value: _amount ? _amount.toString() : '',
    bentoboxSignature: undefined,
  })

  const state = useMemo(() => {
    let token0: Type | undefined = undefined
    let isTokenFromLoading = true
    if (isShortCurrencyName(fromChainId, fromCurrencyId)) {
      token0 = currencyFromShortCurrencyName(fromChainId, fromCurrencyId)
      isTokenFromLoading = false
    } else if (isAddress(fromCurrencyId)) {
      if (tokenMapFrom && tokenMapFrom[getAddress(fromCurrencyId)]) {
        token0 = tokenMapFrom[getAddress(fromCurrencyId)]
        isTokenFromLoading = false
      } else if (customTokens && customTokens[`${fromChainId}:${getAddress(fromCurrencyId)}`]) {
        token0 = customTokens[`${fromChainId}:${getAddress(fromCurrencyId)}`]
        isTokenFromLoading = false
      } else if (tokenFrom) {
        token0 = tokenFrom
        isTokenFromLoading = false
      }
    } else {
      token0 = Native.onChain(fromChainId ? fromChainId : ChainId.ETHEREUM)
      isTokenFromLoading = false
    }

    let token1: Type | undefined = undefined
    let isTokenToLoading = true
    if (isShortCurrencyName(toChainId, toCurrencyId)) {
      token1 = currencyFromShortCurrencyName(toChainId, toCurrencyId)
      isTokenToLoading = false
    } else if (isAddress(toCurrencyId)) {
      if (tokenMapTo && tokenMapTo[getAddress(toCurrencyId)]) {
        token1 = tokenMapTo[getAddress(toCurrencyId)]
        isTokenToLoading = false
      } else if (customTokens && customTokens[`${toChainId}:${getAddress(toCurrencyId)}`]) {
        token1 = customTokens[`${toChainId}:${getAddress(toCurrencyId)}`]
        isTokenToLoading = false
      } else if (tokenTo) {
        token1 = tokenTo
        isTokenToLoading = false
      }
    } else {
      token1 = Native.onChain(toChainId ? toChainId : ChainId.ETHEREUM)
      isTokenToLoading = false
    }

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
          tokenMapFrom &&
          !tokenMapFrom[getAddress(fromCurrencyId)] &&
          customTokens &&
          !customTokens[`${fromChainId}:${getAddress(fromCurrencyId)}`]) ||
        false,
      token1NotInList:
        (isAddress(toCurrencyId) &&
          !tokenTo &&
          !isTokenToLoading &&
          tokenMapTo &&
          !tokenMapTo[getAddress(toCurrencyId)] &&
          customTokens &&
          !customTokens[`${toChainId}:${getAddress(toCurrencyId)}`]) ||
        false,
      tokensLoading: customTokensLoading || isTokenFromLoading || isTokenToLoading,
    }
  }, [
    customTokens,
    customTokensLoading,
    fromChainId,
    fromCurrencyId,
    internalState,
    toChainId,
    toCurrencyId,
    tokenFrom,
    tokenMapFrom,
    tokenMapTo,
    tokenTo,
  ])

  const api = useMemo(() => {
    const setNetworks = (chainId: ChainId) => {
      const token0 = state.token0?.chainId === chainId ? state.token0 : Native.onChain(chainId)
      const token1 =
        state.token1?.chainId === chainId
          ? state.token1.isNative
            ? state.token1.symbol
            : state.token1.wrapped.address
          : 'SUSHI'

      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromCurrencyId: token0.isNative ? token0.symbol : token0.wrapped.address,
            toCurrencyId: token1,
            fromChainId: chainId,
            toChainId: chainId,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setNetwork0 = (chainId: ChainId) => {
      const token0 =
        state.token0?.chainId === chainId
          ? state.token0.isNative
            ? state.token0.symbol
            : state.token0.wrapped.address
          : Native.onChain(chainId).symbol

      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromCurrencyId: token0,
            fromChainId: chainId,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setNetwork1 = (chainId: ChainId) => {
      const token1 =
        state.token1?.chainId === chainId
          ? state.token1.isNative
            ? state.token1.symbol
            : state.token1.wrapped.address
          : 'SUSHI'

      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            toCurrencyId: token1,
            toChainId: chainId,
          },
        },
        undefined,
        { shallow: true }
      )
    }
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
      const _fromCurrencyId = currency.isNative ? currency.symbol : currency.wrapped.address
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromChainId: currency.chainId,
            fromCurrencyId: _fromCurrencyId,
            toCurrencyId: _fromCurrencyId === query.toCurrencyId ? query.fromCurrencyId : query.toCurrencyId,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken1 = (currency: Type) => {
      const _toCurrencyId = currency.isNative ? currency.symbol : currency.wrapped.address

      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            toChainId: currency.chainId,
            fromCurrencyId: query.fromCurrencyId === _toCurrencyId ? query.toCurrencyId : query.fromCurrencyId,
            toCurrencyId: _toCurrencyId,
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
          ? state.network0
          : state.network1 === state.network0
          ? state.network1 === ChainId.ARBITRUM
            ? ChainId.ETHEREUM
            : ChainId.ARBITRUM
          : state.network1
      const token1 =
        state.token1?.chainId === network1
          ? state.token1.isNative
            ? state.token1.symbol
            : state.token1.wrapped.address
          : state.token0?.symbol === 'SUSHI'
          ? Native.onChain(network1).symbol
          : 'SUSHI'

      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            toChainId: network1,
            toCurrencyId: token1,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setSearch = (currency: Type) => {
      const _toCurrencyId = currency.isNative ? currency.symbol : currency.wrapped.address
      void push(
        {
          pathname: '/[fromChainId]/[toChainId]/[fromCurrencyId]/[toCurrencyId]',
          query: {
            ...query,
            fromChainId: currency.chainId,
            toChainId: currency.chainId,
            fromCurrencyId: Native.onChain(currency.chainId).symbol,
            toCurrencyId: _toCurrencyId,
          },
        },
        undefined,
        { shallow: true }
      )
    }

    const setValue = (value: string) => dispatch({ type: 'setValue', value })
    const setRecipient = (recipient: string) => dispatch({ type: 'setRecipient', recipient })
    const setReview = (value: boolean) => dispatch({ type: 'setReview', value })
    const setBentoboxSignature = (value: Signature) => dispatch({ type: 'setBentoboxSignature', value })
    const setTradeId = (value: string) => dispatch({ type: 'setTradeId', value })

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
    }
  }, [
    push,
    query,
    state.network0,
    state.network1,
    state.token0,
    state.token1?.chainId,
    state.token1?.isNative,
    state.token1?.symbol,
    state.token1?.wrapped.address,
  ])

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
