'use client'

import {
  type FC,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import {
  COMMON_KADENA_TOKENS,
  KADENA,
  STABLE_TOKENS,
} from '~kadena/_common/constants/token-list'
import { usePoolFromTokens } from '~kadena/_common/lib/hooks/pools/use-pool-from-tokens'
import type { KadenaToken } from '~kadena/_common/types/token-type'
import { PoolChartPeriod } from '~kadena/_common/ui/Pools/PoolsV2/PoolChartPeriods'

type InputFieldType = 'token0' | 'token1'

export type PoolByIdChartTimeFrame =
  | PoolChartPeriod.Day
  | PoolChartPeriod.Week
  | PoolChartPeriod.Month
  | PoolChartPeriod.Year
  | PoolChartPeriod.All

type Action =
  | { type: 'setToken0'; value: KadenaToken }
  | { type: 'setToken1'; value: KadenaToken }
  | { type: 'setIsTxnPending'; value: boolean }
  | { type: 'setAmountInToken0'; value: string }
  | { type: 'setAmountInToken1'; value: string }
  | { type: 'setPoolId'; value: string | undefined }
  | { type: 'setReserve0'; value: number }
  | { type: 'setReserve1'; value: number }
  | { type: 'setInputField'; value: InputFieldType }
  | { type: 'setPoolByIdChartTimeFrame'; value: PoolByIdChartTimeFrame }
  | { type: 'setMutexLocked'; value: boolean }
  | { type: 'setRateOfToken0ToToken1'; value: number | undefined }
  | { type: 'setRateOfToken1ToToken0'; value: number | undefined }
  | { type: 'setIsLoadingPool'; value: boolean }
  | { type: 'setTotalSupplyLP'; value: number }

type Dispatch = {
  setToken0(token: KadenaToken): void
  setToken1(token: KadenaToken): void
  setIsTxnPending(isPending: boolean): void
  setAmountInToken0(amount: string): void
  setAmountInToken1(amount: string): void
  setPoolId(poolId: string | undefined): void
  setReserve0(reserve0: number): void
  setReserve1(reserve1: number): void
  setInputField(inputField: InputFieldType): void
  setPoolByIdChartTimeFrame(
    poolByIdChartTimeFrame: PoolByIdChartTimeFrame,
  ): void
  setMutexLocked(mutexLocked: boolean): void
  setRateOfToken0ToToken1(rate: number | undefined): void
  setRateOfToken1ToToken0(rate: number | undefined): void
  setIsLoadingPool(isLoading: boolean): void
  setTotalSupplyLP(totalSupplyLP: number): void
}

type State = {
  token0: KadenaToken | undefined
  token1: KadenaToken | undefined
  isTxnPending: boolean
  amountInToken0: string
  amountInToken1: string
  poolId: string | undefined
  reserve0: number | undefined
  reserve1: number | undefined
  inputField: 'token0' | 'token1'
  poolByIdChartTimeFrame: PoolByIdChartTimeFrame
  mutexLocked: boolean
  rateOfToken0ToToken1?: number
  rateOfToken1ToToken0?: number
  isLoadingPool: boolean
  totalSupplyLP: number
}

type PoolProviderProps = { children: React.ReactNode }

const PoolContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function poolReducer(_state: State, action: Action) {
  switch (action.type) {
    case 'setToken0': {
      if (_state?.token1?.tokenAddress === action.value.tokenAddress) {
        //if token1 is the same as the new token0, swap them
        return { ..._state, token1: _state.token0, token0: action.value }
      }
      //if token1 is KDA and the new token is WRTX or vice versa, go back to default pair
      if (
        (_state?.token1?.tokenSymbol === 'KDA' &&
          action.value.tokenSymbol === 'WKDA') ||
        (_state?.token1?.tokenSymbol === 'WKDA' &&
          action.value.tokenSymbol === 'KDA')
      ) {
        return {
          ..._state,
          token0: COMMON_KADENA_TOKENS[0],
          token1: COMMON_KADENA_TOKENS[2],
        }
      }
      return { ..._state, token0: action.value }
    }
    case 'setToken1': {
      if (_state?.token0?.tokenAddress === action.value.tokenAddress) {
        //if token0 is the same as the new token1, swap them
        return { ..._state, token0: _state.token1, token1: action.value }
      }
      if (
        (_state?.token0?.tokenSymbol === 'KDA' &&
          action.value.tokenSymbol === 'WKDA') ||
        (_state?.token0?.tokenSymbol === 'WKDA' &&
          action.value.tokenSymbol === 'KDA')
      ) {
        return {
          ..._state,
          token0: COMMON_KADENA_TOKENS[0],
          token1: COMMON_KADENA_TOKENS[2],
        }
      }
      return { ..._state, token1: action.value }
    }
    case 'setIsTxnPending': {
      return { ..._state, isTxnPending: action.value }
    }
    case 'setAmountInToken0': {
      return { ..._state, amountInToken0: action.value }
    }
    case 'setAmountInToken1': {
      return { ..._state, amountInToken1: action.value }
    }
    case 'setPoolId': {
      return { ..._state, poolId: action.value }
    }
    case 'setReserve0': {
      return { ..._state, reserve0: action.value }
    }
    case 'setReserve1': {
      return { ..._state, reserve1: action.value }
    }
    case 'setInputField': {
      return { ..._state, inputField: action.value }
    }
    case 'setPoolByIdChartTimeFrame': {
      return { ..._state, poolByIdChartTimeFrame: action.value }
    }
    case 'setMutexLocked': {
      return { ..._state, mutexLocked: action.value }
    }
    case 'setRateOfToken0ToToken1': {
      return { ..._state, rateOfToken0ToToken1: action.value }
    }
    case 'setRateOfToken1ToToken0': {
      return { ..._state, rateOfToken1ToToken0: action.value }
    }
    case 'setIsLoadingPool': {
      return { ..._state, isLoadingPool: action.value }
    }
    case 'setTotalSupplyLP': {
      return { ..._state, totalSupplyLP: action.value }
    }
  }
}

const PoolProvider: FC<PoolProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(poolReducer, {
    token0: KADENA,
    token1: STABLE_TOKENS[0],
    isTxnPending: false,
    amountInToken0: '',
    amountInToken1: '',
    poolId: undefined,
    reserve0: undefined,
    reserve1: undefined,
    inputField: 'token0',
    poolByIdChartTimeFrame: PoolChartPeriod.Day,
    mutexLocked: false,
    rateOfToken0ToToken1: undefined,
    rateOfToken1ToToken0: undefined,
    isLoadingPool: false,
    totalSupplyLP: 0,
  })
  const { data, isLoading } = usePoolFromTokens({
    token0: state?.token0?.tokenAddress,
    token1: state?.token1?.tokenAddress,
  })

  const dispatchWithAction = useMemo(
    () => ({
      setToken0: (value: KadenaToken) => dispatch({ type: 'setToken0', value }),
      setToken1: (value: KadenaToken) => dispatch({ type: 'setToken1', value }),
      setIsTxnPending: (value: boolean) =>
        dispatch({ type: 'setIsTxnPending', value }),
      setAmountInToken0: (value: string) =>
        dispatch({ type: 'setAmountInToken0', value }),
      setAmountInToken1: (value: string) =>
        dispatch({ type: 'setAmountInToken1', value }),
      setPoolId: (value: string | undefined) =>
        dispatch({ type: 'setPoolId', value }),
      setReserve0: (value: number) => dispatch({ type: 'setReserve0', value }),
      setReserve1: (value: number) => dispatch({ type: 'setReserve1', value }),
      setInputField: (value: InputFieldType) =>
        dispatch({ type: 'setInputField', value }),
      setPoolByIdChartTimeFrame: (value: PoolByIdChartTimeFrame) =>
        dispatch({ type: 'setPoolByIdChartTimeFrame', value }),
      setMutexLocked: (value: boolean) =>
        dispatch({ type: 'setMutexLocked', value }),
      setRateOfToken0ToToken1: (value: number | undefined) =>
        dispatch({ type: 'setRateOfToken0ToToken1', value }),
      setRateOfToken1ToToken0: (value: number | undefined) =>
        dispatch({ type: 'setRateOfToken1ToToken0', value }),
      setIsLoadingPool: (value: boolean) =>
        dispatch({ type: 'setIsLoadingPool', value }),
      setTotalSupplyLP: (value: number) =>
        dispatch({ type: 'setTotalSupplyLP', value }),
    }),
    [],
  )

  useEffect(() => {
    dispatchWithAction.setIsLoadingPool(isLoading)
  }, [isLoading, dispatchWithAction])

  useEffect(() => {
    if (data) {
      dispatchWithAction.setPoolId(data?.poolData?.poolAddress ?? undefined)
      dispatchWithAction.setReserve0(data?.poolData?.reserve0 ?? 0)
      dispatchWithAction.setReserve1(data?.poolData?.reserve1 ?? 0)
      dispatchWithAction.setMutexLocked(data?.poolData?.mutexLocked ?? false)
      dispatchWithAction.setRateOfToken0ToToken1(
        data?.poolData?.rateOfToken0ToToken1,
      )
      dispatchWithAction.setRateOfToken1ToToken0(
        data?.poolData?.rateOfToken1ToToken0,
      )
      dispatchWithAction.setTotalSupplyLP(data?.poolData?.totalSupplyLp ?? 0)
    }
  }, [data, dispatchWithAction])

  return (
    <PoolContext.Provider
      value={useMemo(() => {
        return { state, dispatch: dispatchWithAction }
      }, [state, dispatchWithAction])}
    >
      {children}
    </PoolContext.Provider>
  )
}

const usePoolContext = () => {
  const context = useContext(PoolContext)
  if (!context) {
    throw new Error('Hook can only be used inside Pool Provider')
  }

  return context
}

const usePoolState = () => {
  const context = usePoolContext()
  return context.state
}

const usePoolDispatch = () => {
  const context = usePoolContext()
  return context.dispatch
}

export { PoolProvider, usePoolState, usePoolDispatch }
