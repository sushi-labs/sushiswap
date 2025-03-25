import { createContext, useContext, useMemo, useReducer } from 'react'

type Action =
  | { type: 'setConnected'; value: boolean }
  | { type: 'setConnecting'; value: boolean }

type Dispatch = {
  setConnected(connected: boolean): void
  setConnecting(connecting: boolean): void
}

type State = {
  connected: boolean
  connecting: boolean
}

type WalletProviderProps = { children: React.ReactNode }

const WalletContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

function walletReducer(state: State, action: Action) {
  switch (action.type) {
    case 'setConnected': {
      return { ...state, connected: action.value }
    }
    case 'setConnecting': {
      return { ...state, connecting: action.value }
    }
  }
}

function WalletProvider({ children }: WalletProviderProps) {
  const [state, dispatch] = useReducer(walletReducer, {
    connected: false,
    connecting: false,
  })

  const dispatchWithAction = useMemo(
    () => ({
      setConnected: (connected: boolean) =>
        dispatch({ type: 'setConnected', value: connected }),
      setConnecting: (connecting: boolean) =>
        dispatch({ type: 'setConnecting', value: connecting }),
    }),
    [],
  )

  return (
    <WalletContext.Provider value={{ state, dispatch: dispatchWithAction }}>
      {children}
    </WalletContext.Provider>
  )
}

const useSwapContext = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useSwapContext must be used within a SwapProvider')
  }
  return context
}

const useWalletState = () => {
  const { state } = useSwapContext()
  return state
}

const useWalletDispatch = () => {
  const { dispatch } = useSwapContext()
  return dispatch
}

export { WalletProvider, useWalletState, useWalletDispatch }
