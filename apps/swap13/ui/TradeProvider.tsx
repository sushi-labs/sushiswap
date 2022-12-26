'use client'

import { ChainId } from '@sushiswap/chain'
import { Native, SUSHI, Type } from '@sushiswap/currency'
import { AppType } from '@sushiswap/ui13/types'
import React, { createContext, FC, ReactNode, useContext, useMemo, useReducer } from 'react'

interface SwapState {
  token0: Type
  token1: Type
  network0: ChainId
  network1: ChainId
  value: string
  otherValue: string
  appType: AppType
}

type SwapApi = {
  setNetwork0(chainId: ChainId): void
  setNetwork1(chainId: ChainId): void
  setAppType(appType: AppType): void
  setToken0(currency: Type): void
  setToken1(currency: Type): void
  setValue(value: string): void
  switchTokens(): void
}

const DataContext = createContext<SwapState>({} as SwapState)
const APIContext = createContext<SwapApi>({} as SwapApi)

type Actions =
  | { type: 'setNetwork0'; chainId: ChainId }
  | { type: 'setNetwork1'; chainId: ChainId }
  | { type: 'setToken0'; currency: Type }
  | { type: 'setToken1'; currency: Type }
  | { type: 'setAppType'; appType: AppType }
  | { type: 'setValue'; value: string }
  | { type: 'switchTokens' }

const reducer = (state: SwapState, action: Actions): SwapState => {
  switch (action.type) {
    case 'setNetwork0':
      return { ...state, network0: action.chainId, token0: Native.onChain(action.chainId) }
    case 'setNetwork1':
      return { ...state, network1: action.chainId, token1: Native.onChain(action.chainId) }
    case 'setToken0':
      return { ...state, token0: action.currency }
    case 'setToken1':
      return { ...state, token1: action.currency }
    case 'setAppType': {
      const network1 =
        action.appType === AppType.Swap
          ? state.network0
          : state.network0 === state.network1
          ? ChainId.ARBITRUM
          : state.network1

      return {
        ...state,
        appType: action.appType,
        network1,
        token0: Native.onChain(state.network0),
        token1: SUSHI[network1],
      }
    }
    case 'setValue':
      return { ...state, value: action.value }
    case 'switchTokens':
      return {
        ...state,
        token0: state.token1,
        token1: state.token0,
        network0: state.network1,
        network1: state.network0,
      }
  }
}

interface SwapProviderProps {
  children: ReactNode
}

export const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    appType: AppType.Swap,
    token0: Native.onChain(ChainId.ETHEREUM),
    token1: SUSHI[ChainId.ETHEREUM],
    network0: ChainId.ETHEREUM,
    network1: ChainId.ETHEREUM,
    value: '',
    otherValue: '',
  })

  const api = useMemo(() => {
    const setNetwork0 = (chainId: ChainId) => dispatch({ type: 'setNetwork0', chainId })
    const setNetwork1 = (chainId: ChainId) => dispatch({ type: 'setNetwork1', chainId })
    const setToken0 = (currency: Type) => dispatch({ type: 'setToken0', currency })
    const setToken1 = (currency: Type) => dispatch({ type: 'setToken1', currency })
    const setAppType = (appType: AppType) => dispatch({ type: 'setAppType', appType })
    const setValue = (value: string) => dispatch({ type: 'setValue', value })
    const switchTokens = () => dispatch({ type: 'switchTokens' })

    return {
      setNetwork0,
      setNetwork1,
      setToken0,
      setToken1,
      setAppType,
      setValue,
      switchTokens,
    }
  }, [])

  return (
    <APIContext.Provider value={api}>
      <DataContext.Provider value={state}>{children}</DataContext.Provider>
    </APIContext.Provider>
  )
}

export const useSwapState = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('Hook can only be used inside State Context')
  }

  return context
}

export const useSwapActions = () => {
  const context = useContext(APIContext)
  if (!context) {
    throw new Error('Hook can only be used inside State Actions Context')
  }

  return context
}
