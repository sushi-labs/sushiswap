import { useSlippageTolerance } from '@sushiswap/hooks'
import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { Token } from 'utils/tokenType'
import { useNetwork } from 'utils/useNetwork'
import { getTokensWithoutKey } from 'utils/useTokens'
import { TokenPairReserve } from 'utils/utilFunctions'

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
  isTransactionPending: boolean
  isPriceFetching: boolean
  error: string
  poolReserves: TokenPairReserve | null
  poolPairRatio: number
  slippageAmount0: number
  slippageAmount1: number
}

type PoolApi = {
  setToken0(token: Token): void
  setToken1(token: Token): void
  setAmount0(amount0: string): void
  setAmount1(amount1: string): void
  setLoadingPrice(isLoadingPrice: boolean): void
  setButtonError(buttonError: string): void
  setisTransactionPending(value: boolean): void
  setPriceFetching(value: boolean): void
  setError(value: string): void
  setPoolReserves(value: TokenPairReserve | null): void
  setPoolPairRatio(value: number): void
  setSlippageAmount0(amount0: number): void
  setSlippageAmount1(amount1: number): void
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
  | { type: 'setisTransactionPending'; value: boolean }
  | { type: 'setPriceFetching'; value: boolean }
  | { type: 'setError'; value: string }
  | { type: 'setPoolReserves'; value: TokenPairReserve | null }
  | { type: 'setPoolPairRatio'; value: number }
  | { type: 'setSlippageAmount0'; value: number }
  | { type: 'setSlippageAmount1'; value: number }

export const PoolProvider: FC<PoolProviderProps> = ({ children }) => {
  const [slippageTolerance] = useSlippageTolerance()

  const { network } = useNetwork()

  const baseTokens = getTokensWithoutKey({ network })

  const reducer = (state: State, action: Actions): State => {
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
      case 'setisTransactionPending':
        return { ...state, isTransactionPending: action.value }
      case 'setPriceFetching':
        return { ...state, isPriceFetching: action.value }
      case 'setError':
        return { ...state, error: action.value }
      case 'setPoolReserves':
        return { ...state, poolReserves: action.value }
      case 'setPoolPairRatio':
        return { ...state, poolPairRatio: action.value }
      case 'setSlippageAmount0':
        return {
          ...state,
          slippageAmount0:
            action.value -
            (action.value *
              parseFloat(
                slippageTolerance
                  ? slippageTolerance === 'AUTO'
                    ? '0.5'
                    : slippageTolerance
                  : '0.5',
              )) /
              100,
        }
      case 'setSlippageAmount1':
        return {
          ...state,
          slippageAmount1:
            action.value -
            (action.value *
              parseFloat(
                slippageTolerance
                  ? slippageTolerance === 'AUTO'
                    ? '0.5'
                    : slippageTolerance
                  : '0.5',
              )) /
              100,
        }
    }
  }

  const [internalState, dispatch] = useReducer(reducer, {
    token0: baseTokens[0],
    token1: baseTokens[1],
    amount0: '',
    amount1: '',
    isLoadingPrice: false,
    buttonError: '',
    isTransactionPending: false,
    isPriceFetching: false,
    error: '',
    poolReserves: null,
    poolPairRatio: 0,
    slippageAmount0: 0,
    slippageAmount1: 0,
  })

  const state = useMemo(() => {
    return { ...internalState }
  }, [internalState])

  const api = useMemo(() => {
    const setToken0 = (value: Token) => dispatch({ type: 'setToken0', value })
    const setToken1 = (value: Token) => dispatch({ type: 'setToken1', value })
    const setAmount0 = (value: string) =>
      dispatch({ type: 'setAmount0', value })
    const setAmount1 = (value: string) =>
      dispatch({ type: 'setAmount1', value })
    const setLoadingPrice = (value: boolean) =>
      dispatch({ type: 'setLoadingPrice', value })
    const setButtonError = (value: string) =>
      dispatch({ type: 'setButtonError', value })
    const setisTransactionPending = (value: boolean) =>
      dispatch({ type: 'setisTransactionPending', value })
    const setPriceFetching = (value: boolean) =>
      dispatch({ type: 'setPriceFetching', value })
    const setError = (value: string) => dispatch({ type: 'setError', value })
    const setPoolReserves = (value: TokenPairReserve | null) =>
      dispatch({ type: 'setPoolReserves', value })
    const setPoolPairRatio = (value: number) =>
      dispatch({ type: 'setPoolPairRatio', value })
    const setSlippageAmount0 = (value: number) =>
      dispatch({ type: 'setSlippageAmount0', value })
    const setSlippageAmount1 = (value: number) =>
      dispatch({ type: 'setSlippageAmount1', value })

    return {
      setToken0,
      setToken1,
      setAmount0,
      setAmount1,
      setLoadingPrice,
      setButtonError,
      setisTransactionPending,
      setPriceFetching,
      setError,
      setPoolReserves,
      setPoolPairRatio,
      setSlippageAmount0,
      setSlippageAmount1,
    }
  }, [])

  return (
    <PoolActionsContext.Provider value={api}>
      <PoolStateContext.Provider value={useMemo(() => ({ ...state }), [state])}>
        {children}
      </PoolStateContext.Provider>
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
