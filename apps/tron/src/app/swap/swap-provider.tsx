'use client'

import { FC, createContext, useContext, useMemo, useReducer } from 'react'

type Action = { type: 'bar' }
type Dispatch = (action: Action) => void
type State = { foo: string }
type SwapProviderProps = { children: React.ReactNode }

const SwapContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function swapReducer(_state: State, action: Action) {
  switch (action.type) {
    case 'bar': {
      return { foo: 'bar' }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const SwapProvider: FC<SwapProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(swapReducer, { foo: 'foo' })
  return (
    <SwapContext.Provider
      value={useMemo(() => {
        return { state, dispatch }
      }, [state])}
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
