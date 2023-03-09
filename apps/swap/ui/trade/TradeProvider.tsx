'use client'

import { ChainId } from '@sushiswap/chain'
import {
  Amount,
  currencyFromShortCurrencyName,
  isShortCurrencyName,
  Native,
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
import { isUniswapV2FactoryChainId } from '@sushiswap/sushiswap'
import { isConstantProductPoolFactoryChainId, isStablePoolFactoryChainId } from '@sushiswap/trident'
import { SwapChainId } from 'types'

export const queryParamsSchema = z.object({
  fromChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .transform((chainId) => chainId as SwapChainId)
    .refine(
      (chainId) =>
        isUniswapV2FactoryChainId(chainId) ||
        isConstantProductPoolFactoryChainId(chainId) ||
        isStablePoolFactoryChainId(chainId),
      {
        message: 'ChainId not supported.',
      }
    ),
  fromCurrency: z.string().default('NATIVE'),
  toChainId: z.coerce
    .number()
    .int()
    .gte(0)
    .lte(2 ** 256)
    .default(ChainId.ETHEREUM)
    .transform((chainId) => chainId as SwapChainId)
    .refine(
      (chainId) =>
        isUniswapV2FactoryChainId(chainId) ||
        isConstantProductPoolFactoryChainId(chainId) ||
        isStablePoolFactoryChainId(chainId),
      {
        message: 'ChainId not supported.',
      }
    ),
  toCurrency: z.string().default('SUSHI'),
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
  network0: SwapChainId
  network1: SwapChainId
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
  setNetworks(chainId: SwapChainId): void
  setNetwork0(chainId: SwapChainId): void
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
  const { address } = useAccount()
  const { query, push } = useRouter()
  const { fromChainId, fromCurrency, toChainId, toCurrency, amount: _amount } = queryParamsSchema.parse(query)
  const { data: customTokens, isLoading: customTokensLoading } = useCustomTokens()
  const { data: tokenMapFrom } = useTokens({ chainId: fromChainId })
  const { data: tokenMapTo } = useTokens({ chainId: toChainId })
  const { data: tokenFrom } = useToken({
    chainId: fromChainId,
    address: fromCurrency,
  })

  const { data: tokenTo } = useToken({
    chainId: toChainId,
    address: toCurrency,
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
    if (isShortCurrencyName(fromChainId, fromCurrency)) {
      token0 = currencyFromShortCurrencyName(fromChainId, fromCurrency)
      isTokenFromLoading = false
    } else if (isAddress(fromCurrency)) {
      if (tokenMapFrom && tokenMapFrom[getAddress(fromCurrency)]) {
        token0 = tokenMapFrom[getAddress(fromCurrency)]
        isTokenFromLoading = false
      } else if (customTokens && customTokens[`${fromChainId}:${getAddress(fromCurrency)}`]) {
        token0 = customTokens[`${fromChainId}:${getAddress(fromCurrency)}`]
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
    if (isShortCurrencyName(toChainId, toCurrency)) {
      token1 = currencyFromShortCurrencyName(toChainId, toCurrency)
      isTokenToLoading = false
    } else if (isAddress(toCurrency)) {
      if (tokenMapTo && tokenMapTo[getAddress(toCurrency)]) {
        token1 = tokenMapTo[getAddress(toCurrency)]
        isTokenToLoading = false
      } else if (customTokens && customTokens[`${toChainId}:${getAddress(toCurrency)}`]) {
        token1 = customTokens[`${toChainId}:${getAddress(toCurrency)}`]
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
        (isAddress(fromCurrency) &&
          !tokenFrom &&
          !isTokenFromLoading &&
          tokenMapFrom &&
          !tokenMapFrom[getAddress(fromCurrency)] &&
          customTokens &&
          !customTokens[`${fromChainId}:${getAddress(fromCurrency)}`]) ||
        false,
      token1NotInList:
        (isAddress(toCurrency) &&
          !tokenTo &&
          !isTokenToLoading &&
          tokenMapTo &&
          !tokenMapTo[getAddress(toCurrency)] &&
          customTokens &&
          !customTokens[`${toChainId}:${getAddress(toCurrency)}`]) ||
        false,
      tokensLoading: customTokensLoading || isTokenFromLoading || isTokenToLoading,
    }
  }, [
    customTokens,
    customTokensLoading,
    fromChainId,
    fromCurrency,
    internalState,
    toChainId,
    toCurrency,
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
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
          query: {
            ...query,
            fromChainId: chainId,
            fromCurrency: token0.isNative ? token0.symbol : token0.wrapped.address,
            toChainId: chainId,
            toCurrency: token1,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setNetwork0 = (chainId: ChainId) => {
      const fromCurrency =
        state.token0?.chainId === chainId
          ? state.token0.isNative
            ? state.token0.symbol
            : state.token0.wrapped.address
          : Native.onChain(chainId).symbol

      void push(
        {
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
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
    const setNetwork1 = (chainId: ChainId) => {
      const toCurrency =
        state.token1?.chainId === chainId
          ? state.token1.isNative
            ? state.token1.symbol
            : state.token1.wrapped.address
          : 'SUSHI'

      void push(
        {
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
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
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
          query: {
            ...query,
            fromChainId: currency0.chainId,
            fromCurrency: currency0.isNative ? currency0.symbol : currency0.wrapped.address,
            toChainId: currency1.chainId,
            toCurrency: currency1.isNative ? currency1.symbol : currency1.wrapped.address,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken0 = (currency: Type) => {
      const fromCurrency = currency.isNative ? currency.symbol : currency.wrapped.address
      void push(
        {
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
          query: {
            ...query,
            fromChainId: currency.chainId,
            fromCurrency,
            toChainId: query.toCurrency === fromCurrency ? query.fromChainId : query.toChainId,
            toCurrency: query.toCurrency === fromCurrency ? query.fromCurrency : query.toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const setToken1 = (currency: Type) => {
      const toCurrency = currency.isNative ? currency.symbol : currency.wrapped.address
      void push(
        {
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
          query: {
            ...query,
            fromChainId: query.fromCurrency === toCurrency ? query.toChainId : query.fromChainId,
            fromCurrency: query.fromCurrency === toCurrency ? query.toCurrency : query.fromCurrency,
            toChainId: currency.chainId,
            toCurrency,
          },
        },
        undefined,
        { shallow: true }
      )
    }
    const switchTokens = () =>
      void push(
        {
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
          query: {
            ...query,
            fromChainId: query.toChainId,
            fromCurrency: query.toCurrency,
            toChainId: query.fromChainId,
            toCurrency: query.fromCurrency,
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

      // let network1 = state.network0

      // if (appType === AppType.xSwap) {
      //   network1 = state.network0 !== ChainId.ARBITRUM ? ChainId.ARBITRUM : ChainId.ETHEREUM

      //   // if (state.network0 !== state.network1) {
      //   //   //
      //   // }

      //   // if (state.network1 === state.network0) {
      //   //   if (state.network1 === ChainId.ARBITRUM) {
      //   //     network1 = ChainId.ETHEREUM
      //   //   } else {
      //   //     network1 = ChainId.ARBITRUM
      //   //   }
      //   // } else {
      //   //   network1 = state.network1
      //   // }
      // }
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
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
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
          pathname: '/[fromChainId]/[fromCurrency]/[toChainId]/[toCurrency]',
          query: {
            ...query,
            fromChainId: currency.chainId,
            fromCurrency: Native.onChain(currency.chainId).symbol,
            toChainId: currency.chainId,
            toCurrency: currency.isNative ? currency.symbol : currency.wrapped.address,
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    push,
    query,
    state.network0,
    state.network1,
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
