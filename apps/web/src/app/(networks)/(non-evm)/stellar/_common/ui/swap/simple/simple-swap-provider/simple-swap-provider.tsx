'use client'

import { StrKey } from '@stellar/stellar-sdk'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { Amount } from 'sushi'
import {
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
  type StellarToken,
  isStellarContractAddress,
} from 'sushi/stellar'
import { getTokenByContract } from '~stellar/_common/lib/soroban/token-helpers'
import SimpleSwapLoading from '~stellar/swap/loading'

interface SimpleSwapProvider {
  children: ReactNode
}

type State = {
  token0: StellarToken
  token1: StellarToken
  amount: string | null
  amountIn: bigint
  slippageAmount: number
  outputAmount: bigint
  priceImpact: number | null
  error: string
  isLoadingPrice: boolean
  isPriceFetching: boolean
  isTransactionPending: boolean
}

type SwapApi = {
  setToken0(token: StellarToken): void
  setToken1(token: StellarToken): void
  swapTokens(): void
  setAmount(amount: string): void
  setSlippageAmount(amount: number): void
  setOutputAmount(amount: bigint): void
  setPriceImpact(value: number | null): void
  setError(value: string): void
  setLoadingPrice(value: boolean): void
  setPriceFetching(value: boolean): void
  setIsTransactionPending(value: boolean): void
}

export const SimpleSwapStateContext = createContext<State>({} as State)
export const SimpleSwapActionsContext = createContext<SwapApi>({} as SwapApi)

type InternalState = Omit<State, 'token0' | 'token1' | 'amount' | 'amountIn'>

type Actions =
  | { type: 'setSlippageAmount'; value: number }
  | { type: 'setOutputAmount'; value: bigint }
  | { type: 'setPriceImpact'; value: number | null }
  | { type: 'setError'; value: string }
  | { type: 'setLoadingPrice'; value: boolean }
  | { type: 'setPriceFetching'; value: boolean }
  | { type: 'setIsTransactionPending'; value: boolean }

function useUrlToken(
  address: string,
  fallback: StellarToken,
): StellarToken | undefined {
  const validAddress =
    isStellarContractAddress(address) && StrKey.isValidContract(address)
  const query = useQuery({
    queryKey: ['stellar', 'token', address],
    queryFn: async () => {
      if (!isStellarContractAddress(address)) {
        throw new Error('Invalid Stellar token address')
      }
      return getTokenByContract(address, { strict: true })
    },
    initialData: [
      STELLAR_XLM[StellarChainId.STELLAR],
      STELLAR_USDT0[StellarChainId.STELLAR],
    ].find((token) => token.address === address),
    enabled: validAddress,
    staleTime: 900000,
    refetchOnWindowFocus: false,
    retry: false,
  })

  if (!validAddress) return fallback
  return query.data ?? (query.isError ? fallback : undefined)
}

export const SimpleSwapProvider: FC<SimpleSwapProvider> = ({ children }) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const defaultedParams = useMemo(() => {
    const params = new URLSearchParams(searchParams)
    if (!params.has('token0')) {
      params.set('token0', STELLAR_XLM[StellarChainId.STELLAR].address)
    }
    if (!params.has('token1')) {
      params.set('token1', STELLAR_USDT0[StellarChainId.STELLAR].address)
    }
    return params
  }, [searchParams])
  const token0Param = (defaultedParams.get('token0') || '').toUpperCase()
  const token1Param = (defaultedParams.get('token1') || '').toUpperCase()
  let token0 = useUrlToken(token0Param, STELLAR_XLM[StellarChainId.STELLAR])
  let token1 = useUrlToken(token1Param, STELLAR_USDT0[StellarChainId.STELLAR])
  if (token0 && token1 && token0.address === token1.address) {
    const alternate =
      token0.address === STELLAR_USDT0[StellarChainId.STELLAR].address
        ? STELLAR_XLM[StellarChainId.STELLAR]
        : STELLAR_USDT0[StellarChainId.STELLAR]
    if (searchParams.has('token0') && token0.address === token0Param) {
      token1 = alternate
    } else {
      token0 = alternate
    }
  }
  const token0Address = token0?.address ?? token0Param
  const token1Address = token1?.address ?? token1Param

  const updateSearchParams = useCallback(
    (values: { name: string; value: string | null }[]) => {
      const params = new URLSearchParams(defaultedParams)
      params.set('token0', token0Address)
      params.set('token1', token1Address)
      for (const { name, value } of values) {
        if (value === null) {
          params.delete(name)
        } else {
          params.set(name, value)
        }
      }
      history.pushState(null, '', `${pathname}?${params.toString()}`)
    },
    [defaultedParams, pathname, token0Address, token1Address],
  )

  const reducer = (state: InternalState, action: Actions): InternalState => {
    switch (action.type) {
      case 'setSlippageAmount':
        return {
          ...state,
          slippageAmount: action.value, // Just store the raw amount, slippage is calculated in execute button
        }
      case 'setOutputAmount':
        return { ...state, outputAmount: action.value }
      case 'setPriceImpact':
        return { ...state, priceImpact: action.value }
      case 'setError':
        return { ...state, error: action.value }
      case 'setLoadingPrice':
        return { ...state, isLoadingPrice: action.value }
      case 'setPriceFetching':
        return { ...state, isPriceFetching: action.value }
      case 'setIsTransactionPending':
        return { ...state, isTransactionPending: action.value }
      default:
        return state
    }
  }

  const [internalState, dispatch] = useReducer(reducer, {
    slippageAmount: 0,
    outputAmount: 0n,
    priceImpact: null,
    error: '',
    isLoadingPrice: false,
    isPriceFetching: false,
    isTransactionPending: false,
  })

  const state = useMemo(() => {
    if (!token0 || !token1) return undefined

    const amount = defaultedParams.get('swapAmount') || ''
    const parsedAmount = Amount.tryFromHuman(token0, amount)?.amount ?? 0n

    return {
      ...internalState,
      token0,
      token1,
      amount,
      amountIn: parsedAmount > 0n ? parsedAmount : 0n,
    }
  }, [internalState, token0, token1, defaultedParams])

  const swapTokens = useCallback(() => {
    updateSearchParams([
      { name: 'token0', value: token1Address },
      { name: 'token1', value: token0Address },
      { name: 'swapAmount', value: null },
    ])
  }, [token0Address, token1Address, updateSearchParams])

  const setToken0 = useCallback(
    (token: StellarToken) => {
      queryClient.setQueryData(['stellar', 'token', token.address], token)
      if (token1Address === token.address) {
        swapTokens()
      } else {
        updateSearchParams([{ name: 'token0', value: token.address }])
      }
    },
    [queryClient, token1Address, swapTokens, updateSearchParams],
  )

  const setToken1 = useCallback(
    (token: StellarToken) => {
      queryClient.setQueryData(['stellar', 'token', token.address], token)
      if (token0Address === token.address) {
        swapTokens()
      } else {
        updateSearchParams([{ name: 'token1', value: token.address }])
      }
    },
    [queryClient, token0Address, swapTokens, updateSearchParams],
  )

  const setAmount = useCallback(
    (value: string) => {
      updateSearchParams([{ name: 'swapAmount', value: value || null }])
    },
    [updateSearchParams],
  )

  const api = useMemo(() => {
    const setSlippageAmount = (value: number) =>
      dispatch({ type: 'setSlippageAmount', value })
    const setOutputAmount = (value: bigint) =>
      dispatch({ type: 'setOutputAmount', value })
    const setPriceImpact = (value: number | null) =>
      dispatch({ type: 'setPriceImpact', value })
    const setError = (value: string) => dispatch({ type: 'setError', value })
    const setLoadingPrice = (value: boolean) =>
      dispatch({ type: 'setLoadingPrice', value })
    const setPriceFetching = (value: boolean) =>
      dispatch({ type: 'setPriceFetching', value })
    const setIsTransactionPending = (value: boolean) =>
      dispatch({ type: 'setIsTransactionPending', value })

    return {
      setToken0,
      setToken1,
      swapTokens,
      setAmount,
      setSlippageAmount,
      setOutputAmount,
      setPriceImpact,
      setError,
      setLoadingPrice,
      setPriceFetching,
      setIsTransactionPending,
    }
  }, [setToken0, setToken1, swapTokens, setAmount])

  if (!state) {
    return <SimpleSwapLoading />
  }

  return (
    <SimpleSwapActionsContext.Provider value={api}>
      <SimpleSwapStateContext.Provider value={state}>
        {children}
      </SimpleSwapStateContext.Provider>
    </SimpleSwapActionsContext.Provider>
  )
}

export const useSimpleSwapState = () => {
  const context = useContext(SimpleSwapStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside SimpleSwapStateContext')
  }
  return context
}

export const useSimpleSwapActions = () => {
  const context = useContext(SimpleSwapActionsContext)
  if (!context) {
    throw new Error('Hook can only be used inside SimpleSwapActionsContext')
  }
  return context
}
