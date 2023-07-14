import { FC, ReactNode, createContext, useContext, useMemo, useReducer } from 'react'
import { Token } from 'utils/tokenType'
import TOKENS from './../../../config/tokenList.json'

interface PoolProviderProps {
  children: ReactNode
}

type State = {
  token0: Token
  token1: Token
  amount0: string | null
  amount1: string | null
  isLoadingPrice: boolean
  buttonError: string
  balance0: number
  balance1: number
  isTransactionPending: boolean
  isPriceFetching: boolean
  error: string
}

type PoolApi = {
  setToken0(token: Token): void
  setToken1(token: Token): void
  setAmount0(amount1: string): void
  setAmount1(amount2: string): void
  setLoadingPrice(isLoadingPrice: boolean): void
  setButtonError(buttonError: string): void
  setBalance0(value: number): void
  setBalance1(value: number): void
  setisTransactionPending(value: boolean): void
  setPriceFetching(value: boolean): void
  setError(value: string): void
}

export const PoolStateContext = createContext<State>({} as State)
export const PoolActionsContext = createContext<PoolApi>({} as PoolApi)

type Actions =
  | { type: 'setToken0'; value: Token }
  | { type: 'setToken1'; value: Token }
  | { type: 'setAmount0'; value: string }
  | { type: 'setAmount1'; value: string }
  | { type: 'setLoadingPrice'; value: boolean }
  | { type: 'setButtonError'; value: string }
  | { type: 'setBalance0'; value: number }
  | { type: 'setBalance1'; value: number }
  | { type: 'setisTransactionPending'; value: boolean }
  | { type: 'setPriceFetching'; value: boolean }
  | { type: 'setError'; value: string }

export const PoolProvider: FC<PoolProviderProps> = ({ children }) => {
  const reducer = (state: State, action: Actions) => {
    switch (action.type) {
      case 'setToken0':
        return { ...state, token0: action.value }
      case 'setToken1':
        return { ...state, token1: action.value }
      case 'setAmount0':
        return { ...state, amount0: action.value }
      case 'setAmount1':
        return { ...state, amount1: action.value }
      case 'setLoadingPrice':
        return { ...state, isLoadingPrice: action.value }
      case 'setButtonError':
        return { ...state, buttonError: action.value }
      case 'setBalance0':
        return { ...state, balance0: action.value }
      case 'setBalance1':
        return { ...state, balance1: action.value }
      case 'setisTransactionPending':
        return { ...state, isTransactionPending: action.value }
      case 'setPriceFetching':
        return { ...state, isPriceFetching: action.value }
      case 'setError':
        return { ...state, error: action.value }
    }
  }
  const [internalState, dispatch] = useReducer(reducer, {
    token0: TOKENS.tokens[0],
    token1: TOKENS.tokens[1],
    amount0: '',
    amount1: '',
    isLoadingPrice: false,
    buttonError: '',
    balance0: 0,
    balance1: 0,
    isTransactionPending: false,
    isPriceFetching: false,
    error: '',
  })
  const state = useMemo(() => {
    return { ...internalState }
  }, [internalState])
  const api = useMemo(() => {
    const setToken0 = (value: Token) => dispatch({ type: 'setToken0', value })
    const setToken1 = (value: Token) => dispatch({ type: 'setToken1', value })
    const setAmount0 = (value: string) => dispatch({ type: 'setAmount0', value })
    const setAmount1 = (value: string) => dispatch({ type: 'setAmount1', value })
    const setLoadingPrice = (value: boolean) => dispatch({ type: 'setLoadingPrice', value })
    const setButtonError = (value: string) => dispatch({ type: 'setButtonError', value })
    const setBalance0 = (value: number) => dispatch({ type: 'setBalance0', value })
    const setBalance1 = (value: number) => dispatch({ type: 'setBalance1', value })
    const setisTransactionPending = (value: boolean) => dispatch({ type: 'setisTransactionPending', value })
    const setPriceFetching = (value: boolean) => dispatch({ type: 'setPriceFetching', value })
    const setError = (value: string) => dispatch({ type: 'setError', value })
    return {
      setToken0,
      setToken1,
      setAmount0,
      setAmount1,
      setLoadingPrice,
      setButtonError,
      setBalance0,
      setBalance1,
      setisTransactionPending,
      setPriceFetching,
      setError,
    }
  }, [internalState])
  return (
    <PoolActionsContext.Provider value={api}>
      <PoolStateContext.Provider value={useMemo(() => ({ ...state }), [state])}>{children}</PoolStateContext.Provider>
    </PoolActionsContext.Provider>
  )
}

export const usePoolState = () => {
  const context = useContext(PoolStateContext)
  if (!context) {
    throw new Error('Hooks can only be used inside State Context')
  }
  return context
}

export const usePoolActions = () => {
  const context = useContext(PoolActionsContext)
  if (!context) {
    throw new Error('Hooks can only be used inside State Actions Context')
  }
  return context
}
