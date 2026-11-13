'use client'

import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import {
  STELLAR_USDT0,
  STELLAR_XLM,
  StellarChainId,
  type StellarToken,
} from 'sushi/stellar'

interface SimpleSwapProvider {
  children: ReactNode
  form?: Pick<State, 'token0' | 'token1' | 'amount'> &
    Pick<SwapApi, 'setToken0' | 'setToken1' | 'setAmount' | 'swapTokens'>
}

type State = {
  token0: StellarToken
  token1: StellarToken
  amount: string | null
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

type Actions =
  | { type: 'setToken0'; value: StellarToken }
  | { type: 'setToken1'; value: StellarToken }
  | { type: 'swapTokens' }
  | { type: 'setAmount'; value: string }
  | { type: 'setSlippageAmount'; value: number }
  | { type: 'setOutputAmount'; value: bigint }
  | { type: 'setPriceImpact'; value: number | null }
  | { type: 'setError'; value: string }
  | { type: 'setLoadingPrice'; value: boolean }
  | { type: 'setPriceFetching'; value: boolean }
  | { type: 'setIsTransactionPending'; value: boolean }
  | { type: 'setFormTokens'; token0: StellarToken; token1: StellarToken }

export const SimpleSwapProvider: FC<SimpleSwapProvider> = ({
  children,
  form,
}) => {
  const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
      case 'setFormTokens':
        return {
          ...state,
          token0: action.token0,
          token1: action.token1,
          outputAmount: 0n,
          slippageAmount: 0,
          priceImpact: null,
          error: '',
        }
      case 'setToken0':
        return { ...state, token0: action.value, amount: '' }
      case 'setToken1':
        return { ...state, token1: action.value }
      case 'swapTokens':
        return {
          ...state,
          token0: state.token1,
          token1: state.token0,
          amount: '',
        }
      case 'setAmount':
        return { ...state, amount: action.value }
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
    token0: form?.token0 ?? STELLAR_XLM[StellarChainId.STELLAR],
    token1: form?.token1 ?? STELLAR_USDT0[StellarChainId.STELLAR],
    amount: '',
    slippageAmount: 0,
    outputAmount: 0n,
    priceImpact: null,
    error: '',
    isLoadingPrice: false,
    isPriceFetching: false,
    isTransactionPending: false,
  })

  if (
    form &&
    (form.token0.address !== internalState.token0.address ||
      form.token1.address !== internalState.token1.address)
  ) {
    // Discard the previous quote before rendering the new pair, while keeping
    // the execution widget and its pending transaction state mounted.
    dispatch({
      type: 'setFormTokens',
      token0: form.token0,
      token1: form.token1,
    })
  }

  const state = useMemo(() => {
    return form
      ? {
          ...internalState,
          token0: form.token0,
          token1: form.token1,
          amount: form.amount,
        }
      : internalState
  }, [internalState, form])

  const setToken0 = useCallback(
    (token0: StellarToken) => {
      if (state.token1.address === token0.address) {
        dispatch({ type: 'swapTokens' })
      } else {
        dispatch({ type: 'setToken0', value: token0 })
      }
    },
    [state.token1],
  )

  const setToken1 = useCallback(
    (token1: StellarToken) => {
      if (state.token0.address === token1.address) {
        dispatch({ type: 'swapTokens' })
      } else {
        dispatch({ type: 'setToken1', value: token1 })
      }
    },
    [state.token0],
  )

  const api = useMemo(() => {
    const swapTokens =
      form?.swapTokens ?? (() => dispatch({ type: 'swapTokens' }))
    const setAmount =
      form?.setAmount ??
      ((value: string) => dispatch({ type: 'setAmount', value }))
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
      setToken0: form?.setToken0 ?? setToken0,
      setToken1: form?.setToken1 ?? setToken1,
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
  }, [setToken0, setToken1, form])

  return (
    <SimpleSwapActionsContext.Provider value={api}>
      <SimpleSwapStateContext.Provider
        value={useMemo(() => ({ ...state }), [state])}
      >
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
