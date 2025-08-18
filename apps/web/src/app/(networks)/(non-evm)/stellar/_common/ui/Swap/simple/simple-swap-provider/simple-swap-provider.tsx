'use client'

import { useSlippageTolerance } from '@sushiswap/hooks'
import {
  type FC,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { DEFAULT_SLIPPAGE } from 'sushi/config'
import { getBaseTokens } from '~stellar/_common/lib/hooks/use-base-tokens'
import type { Token } from '~stellar/_common/lib/types/token.type'

interface SimpleSwapProvider {
  children: ReactNode
}

type State = {
  token0: Token
  token1: Token
  amount: string | null
  slippageAmount: number
  outputAmount: string
}

type SwapApi = {
  setToken0(token: Token): void
  setToken1(token: Token): void
  swapTokens(): void
  setAmount(amount: string): void
  setSlippageAmount(amount: number): void
  setOutputAmount(amount: string): void
}

export const SimpleSwapStateContext = createContext<State>({} as State)
export const SimpleSwapActionsContext = createContext<SwapApi>({} as SwapApi)

type Actions =
  | { type: 'setToken0'; value: Token }
  | { type: 'setToken1'; value: Token }
  | { type: 'swapTokens' }
  | { type: 'setAmount'; value: string }
  | { type: 'setSlippageAmount'; value: number }
  | { type: 'setOutputAmount'; value: string }

export const SimpleSwapProvider: FC<SimpleSwapProvider> = ({ children }) => {
  const [slippageTolerance] = useSlippageTolerance()
  const baseTokens = getBaseTokens()

  const reducer = (state: State, action: Actions): State => {
    switch (action.type) {
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
          slippageAmount:
            action.value -
            (action.value *
              Number.parseFloat(
                slippageTolerance
                  ? slippageTolerance === 'AUTO'
                    ? DEFAULT_SLIPPAGE
                    : slippageTolerance
                  : DEFAULT_SLIPPAGE,
              )) /
              100,
        }
      case 'setOutputAmount':
        return { ...state, outputAmount: action.value }
      default:
        return state
    }
  }

  const [internalState, dispatch] = useReducer(reducer, {
    token0: baseTokens[0],
    token1: baseTokens[1],
    amount: '',
    slippageAmount: 0,
    outputAmount: '',
  })

  const state = useMemo(() => {
    return { ...internalState }
  }, [internalState])

  const setToken0 = useCallback(
    (token0: Token) => {
      if (state.token1.contract === token0.contract) {
        dispatch({ type: 'swapTokens' })
      } else {
        dispatch({ type: 'setToken0', value: token0 as Token })
      }
    },
    [state.token1],
  )

  const setToken1 = useCallback(
    (token1: Token) => {
      if (state.token0.contract === token1.contract) {
        dispatch({ type: 'swapTokens' })
      } else {
        dispatch({ type: 'setToken1', value: token1 as Token })
      }
    },
    [state.token0],
  )

  const api = useMemo(() => {
    const swapTokens = () => dispatch({ type: 'swapTokens' })
    const setAmount = (value: string) => dispatch({ type: 'setAmount', value })
    const setSlippageAmount = (value: number) =>
      dispatch({ type: 'setSlippageAmount', value })
    const setOutputAmount = (value: string) =>
      dispatch({ type: 'setOutputAmount', value })

    return {
      setToken0,
      setToken1,
      swapTokens,
      setAmount,
      setSlippageAmount,
      setOutputAmount,
    }
  }, [setToken0, setToken1])

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
