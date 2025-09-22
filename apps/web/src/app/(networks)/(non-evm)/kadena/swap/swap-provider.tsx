'use client'

import { type FC, createContext, useContext, useMemo, useReducer } from 'react'
import type { Amount } from 'sushi'
import type { KvmToken } from 'sushi/kvm'
import { KADENA, STABLE_TOKENS } from '~kadena/_common/constants/token-list'

type Status = 'pending' | 'success' | 'error'

type Action =
  | { type: 'swapTokens' }
  | { type: 'setToken0'; value: KvmToken }
  | { type: 'setToken1'; value: KvmToken }
  | { type: 'setIsTxnPending'; value: boolean }
  | { type: 'setAmountInString'; value: string }
  | { type: 'setAmountIn'; value: Amount<KvmToken> | undefined }
  | { type: 'setAmountOut'; value: Amount<KvmToken> | undefined }
  | { type: 'setAmountOutString'; value: string }
  | { type: 'setMinAmountOut'; value: Amount<KvmToken> | undefined }
  | { type: 'setRoute'; value: string[] }
  | { type: 'setPriceImpactPercentage'; value: number }
  | { type: 'setGas'; value: number }
  | { type: 'setStatus'; value: Status }
  | { type: 'setTxHash'; value: string }

type Dispatch = {
  swapTokens(): void
  setToken0(token: KvmToken): void
  setToken1(token: KvmToken): void
  setIsTxnPending(isPending: boolean): void
  setAmountInString(amount: string): void
  setAmountIn(amount: Amount<KvmToken> | undefined): void
  setAmountOut(amount: Amount<KvmToken> | undefined): void
  setAmountOutString(amount: string): void
  setMinAmountOut(amount: Amount<KvmToken> | undefined): void
  setPriceImpactPercentage(priceImpactPercentage: number): void
  setRoute(route: string[]): void
  setGas(gas: number): void
  setStatus(status: Status): void
  setTxHash(txHash: string): void
}

type State = {
  token0: KvmToken
  token1: KvmToken
  isTxnPending: boolean
  amountInString: string
  amountIn: Amount<KvmToken> | undefined
  amountOut: Amount<KvmToken> | undefined
  amountOutString: string
  minAmountOut: Amount<KvmToken> | undefined
  priceImpactPercentage: number
  route: string[]
  gas: number
  status: Status
  txHash: string | undefined
}

type SwapProviderProps = { children: React.ReactNode }

const SwapContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function swapReducer(_state: State, action: Action) {
  switch (action.type) {
    case 'setToken0': {
      if (_state.token1?.isSame(action.value)) {
        //if token1 is the same as the new token0, swap them
        return {
          ..._state,
          token1: _state.token0,
          token0: action.value,
          amountInString: '',
          amountIn: undefined,
          amountOut: undefined,
          amountOutString: '',
          minAmountOut: undefined,
          gas: 0,
          priceImpactPercentage: 0,
        }
      }
      return {
        ..._state,
        token0: action.value,
        amountInString: '',
        amountIn: undefined,
        amountOut: undefined,
        amountOutString: '',
        minAmountOut: undefined,
        gas: 0,
        priceImpactPercentage: 0,
      }
    }
    case 'setToken1': {
      if (_state.token0?.isSame(action.value)) {
        //if token0 is the same as the new token1, swap them
        return {
          ..._state,
          token0: _state.token1,
          token1: action.value,
          amountInString: '',
          amountIn: undefined,
          amountOut: undefined,
          amountOutString: '',
          minAmountOut: undefined,
          gas: 0,
          priceImpactPercentage: 0,
        }
      }
      return { ..._state, token1: action.value }
    }
    case 'swapTokens': {
      return {
        ..._state,
        token0: _state.token1,
        token1: _state.token0,
        amountInString: '',
        amountIn: undefined,
        amountOut: undefined,
        amountOutString: '',
        minAmountOut: undefined,
        gas: 0,
        priceImpactPercentage: 0,
      }
    }
    case 'setIsTxnPending': {
      return { ..._state, isTxnPending: action.value }
    }
    case 'setAmountInString': {
      return { ..._state, amountInString: action.value }
    }
    case 'setAmountIn': {
      return { ..._state, amountIn: action.value }
    }
    case 'setAmountOut': {
      return { ..._state, amountOut: action.value }
    }
    case 'setAmountOutString': {
      return { ..._state, amountOutString: action.value }
    }
    case 'setPriceImpactPercentage': {
      return { ..._state, priceImpactPercentage: action.value }
    }
    case 'setRoute': {
      return { ..._state, route: action.value }
    }
    case 'setMinAmountOut': {
      return { ..._state, minAmountOut: action.value }
    }
    case 'setGas': {
      return { ..._state, gas: action.value }
    }
    case 'setTxHash': {
      return { ..._state, txHash: action.value }
    }
    case 'setStatus': {
      return { ..._state, status: action.value }
    }
  }
}

const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(swapReducer, {
    token0: KADENA,
    token1: STABLE_TOKENS[0],
    isTxnPending: false,
    amountInString: '',
    amountIn: undefined,
    amountOut: undefined,
    amountOutString: '',
    priceImpactPercentage: 0,
    route: [],
    minAmountOut: undefined,
    gas: 0,
    status: 'pending',
    txHash: undefined,
  })

  const dispatchWithAction = useMemo(
    () => ({
      setToken0: (value: KvmToken) => dispatch({ type: 'setToken0', value }),
      setToken1: (value: KvmToken) => dispatch({ type: 'setToken1', value }),
      swapTokens: () => dispatch({ type: 'swapTokens' }),
      setIsTxnPending: (value: boolean) =>
        dispatch({ type: 'setIsTxnPending', value }),
      setAmountInString: (value: string) =>
        dispatch({ type: 'setAmountInString', value }),
      setAmountIn: (value: Amount<KvmToken>) =>
        dispatch({ type: 'setAmountIn', value }),
      setAmountOut: (value: Amount<KvmToken>) =>
        dispatch({ type: 'setAmountOut', value }),
      setAmountOutString: (value: string) =>
        dispatch({ type: 'setAmountOutString', value }),
      setPriceImpactPercentage: (value: number) =>
        dispatch({ type: 'setPriceImpactPercentage', value }),
      setRoute: (value: string[]) => dispatch({ type: 'setRoute', value }),
      setMinAmountOut: (value: Amount<KvmToken>) =>
        dispatch({ type: 'setMinAmountOut', value }),
      setGas: (value: number) => dispatch({ type: 'setGas', value }),
      setTxHash: (value: string) => dispatch({ type: 'setTxHash', value }),
      setStatus: (value: Status) => dispatch({ type: 'setStatus', value }),
    }),
    [],
  )

  return (
    <SwapContext.Provider
      value={useMemo(() => {
        return { state, dispatch: dispatchWithAction }
      }, [state, dispatchWithAction])}
    >
      {children}
    </SwapContext.Provider>
  )
}

const useSwapContext = () => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error('Hook can only be used inside Swap Provider')
  }

  return context
}

const useSwapState = () => {
  const context = useSwapContext()
  return context.state
}

const useSwapDispatch = () => {
  const context = useSwapContext()
  return context.dispatch
}

export { SwapProvider, useSwapState, useSwapDispatch }
