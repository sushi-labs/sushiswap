import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react'

type Action =
  | { type: 'setAccount'; value: string }
  | { type: 'setConnected'; value: boolean }
  | { type: 'setConnecting'; value: boolean }

type Dispatch = {
  setAccount(account: string): void
  setConnected(connected: boolean): void
  setConnecting(connecting: boolean): void
  connect(account: string): void
  disconnect(): void
}

type State = {
  account: string
  connected: boolean
  connecting: boolean
}

type WalletProviderProps = {
  children: ReactNode
}

const WalletContext = createContext<
  | {
      state: State
      dispatch: Dispatch
    }
  | undefined
>(undefined)

function walletReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'setAccount':
      return { ...state, account: action.value }
    case 'setConnected':
      return { ...state, connected: action.value }
    case 'setConnecting':
      return { ...state, connecting: action.value }
    default:
      return state
  }
}

function WalletProvider({ children }: WalletProviderProps) {
  const [state, dispatch] = useReducer(walletReducer, {
    account: '',
    connected: false,
    connecting: false,
  })

  const dispatchWithAction = useMemo<Dispatch>(
    () => ({
      setAccount: (account: string) =>
        dispatch({ type: 'setAccount', value: account }),
      setConnected: (connected: boolean) =>
        dispatch({ type: 'setConnected', value: connected }),
      setConnecting: (connecting: boolean) =>
        dispatch({ type: 'setConnecting', value: connecting }),
      connect: (account: string) => {
        dispatch({ type: 'setAccount', value: account })
        dispatch({ type: 'setConnected', value: true })
      },
      disconnect: () => {
        dispatch({ type: 'setAccount', value: '' })
        dispatch({ type: 'setConnected', value: false })
      },
    }),
    [],
  )

  return (
    <WalletContext.Provider value={{ state, dispatch: dispatchWithAction }}>
      {children}
    </WalletContext.Provider>
  )
}

export const useWalletContext = () => {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider')
  }
  return context
}

const useWalletState = () => {
  const { state } = useWalletContext()
  return state
}

const useWalletDispatch = () => {
  const { dispatch } = useWalletContext()
  return dispatch
}

export { WalletProvider, useWalletState, useWalletDispatch }
