'use client'

import { type FC, createContext, useContext, useMemo, useReducer } from 'react'
import {
  BABENA,
  KADENA,
  STABLE_TOKENS,
} from '~kadena/_common/constants/token-list'
import type { KadenaToken } from '~kadena/_common/types/token-type'

// @TODO: Connected and Connecting will be replaced by wallet hook
type Action =
  | { type: 'swapTokens' }
  | { type: 'setToken0'; value: KadenaToken }
  | { type: 'setToken1'; value: KadenaToken }
  | { type: 'setIsTxnPending'; value: boolean }
  | { type: 'setAmountIn'; value: string }
  | { type: 'setAmountOut'; value: string }
  | { type: 'setMinAmountOut'; value: string }
  | { type: 'setRoute'; value: string[] }
  | { type: 'setPriceImpactPercentage'; value: number }
  | { type: 'setGas'; value: number }

type Dispatch = {
  swapTokens(): void
  setToken0(token: KadenaToken): void
  setToken1(token: KadenaToken): void
  setIsTxnPending(isPending: boolean): void
  setAmountIn(amount: string): void
  setAmountOut(amount: string): void
  setMinAmountOut(amount: string): void
  setPriceImpactPercentage(priceImpactPercentage: number): void
  setRoute(route: string[]): void
  setGas(gas: number): void
}

type State = {
  token0: KadenaToken
  token1: KadenaToken
  isTxnPending: boolean
  amountIn: string
  amountOut: string
  minAmountOut: string
  priceImpactPercentage: number
  route: string[]
  gas: number
}

type SwapProviderProps = { children: React.ReactNode }

const SwapContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function swapReducer(_state: State, action: Action) {
  switch (action.type) {
    case 'setToken0': {
      if (_state.token1?.tokenAddress === action.value.tokenAddress) {
        //if token1 is the same as the new token0, swap them
        return {
          ..._state,
          token1: _state.token0,
          token0: action.value,
          amountIn: '',
          amountOut: '',
          minAmountOut: '',
          gas: 0,
          priceImpactPercentage: 0,
        }
      }
      return {
        ..._state,
        token0: action.value,
        amountIn: '',
        amountOut: '',
        minAmountOut: '',
        gas: 0,
        priceImpactPercentage: 0,
      }
    }
    case 'setToken1': {
      if (_state.token0?.tokenAddress === action.value.tokenAddress) {
        //if token0 is the same as the new token1, swap them
        return {
          ..._state,
          token0: _state.token1,
          token1: action.value,
          amountIn: '',
          amountOut: '',
          minAmountOut: '',
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
        amountIn: '',
        amountOut: '',
        minAmountOut: '',
        gas: 0,
        priceImpactPercentage: 0,
      }
    }
    case 'setIsTxnPending': {
      return { ..._state, isTxnPending: action.value }
    }
    case 'setAmountIn': {
      return { ..._state, amountIn: action.value }
    }
    case 'setAmountOut': {
      return { ..._state, amountOut: action.value }
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
    // default: {
    // 	throw new Error(`Unhandled action type: ${action.type}`);
    // }
  }
}

const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(swapReducer, {
    token0: KADENA,
    token1: BABENA,
    isTxnPending: false,
    amountIn: '',
    amountOut: '',
    priceImpactPercentage: 0,
    route: [],
    minAmountOut: '',
    gas: 0,
  })

  const dispatchWithAction = useMemo(
    () => ({
      setToken0: (value: KadenaToken) => dispatch({ type: 'setToken0', value }),
      setToken1: (value: KadenaToken) => dispatch({ type: 'setToken1', value }),
      swapTokens: () => dispatch({ type: 'swapTokens' }),
      setIsTxnPending: (value: boolean) =>
        dispatch({ type: 'setIsTxnPending', value }),
      setAmountIn: (value: string) => dispatch({ type: 'setAmountIn', value }),
      setAmountOut: (value: string) =>
        dispatch({ type: 'setAmountOut', value }),
      setPriceImpactPercentage: (value: number) =>
        dispatch({ type: 'setPriceImpactPercentage', value }),
      setRoute: (value: string[]) => dispatch({ type: 'setRoute', value }),
      setMinAmountOut: (value: string) =>
        dispatch({ type: 'setMinAmountOut', value }),
      setGas: (value: number) => dispatch({ type: 'setGas', value }),
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
