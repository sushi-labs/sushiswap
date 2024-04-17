'use client'

import { FC, createContext, useContext, useMemo } from 'react'

interface State {
  mutate: {}
  state: {}
  isLoading: boolean
}

const SwapContext = createContext<State>({} as State)

interface SwapProviderProps {
  children: React.ReactNode
}

const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  return (
    <SwapContext.Provider
      value={useMemo(() => {
        return {
          mutate: {},
          state: {},
          isLoading: false,
        }
      }, [])}
    >
      {children}
    </SwapContext.Provider>
  )
}

const useSwapContext = () => {
  const context = useContext(SwapContext)
  if (!context) {
    throw new Error(
      'Hook can only be used inside Simple Swap Derived State Context',
    )
  }

  return context
}

const useSwapState = () => {
  const context = useSwapContext()
  return context.state
}

const useSwapActions = () => {
  const context = useSwapContext()
  return context.mutate
}

export { SwapProvider, useSwapState, useSwapActions }
