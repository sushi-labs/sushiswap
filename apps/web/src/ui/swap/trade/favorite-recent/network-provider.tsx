'use client'

import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

//TODO use chainId types instead of number when available
interface State {
  mutate: {
    setSelectedNetwork(value: number): void
  }
  state: {
    selectedNetwork: null | number
  }
}

const NetworkContext = createContext<State>({} as State)

interface NetworkProviderProps {
  children: React.ReactNode
}

const NetworkProvider: FC<NetworkProviderProps> = ({ children }) => {
  const [selectedNetwork, _setSelectedNetwork] = useState<null | number>(null)

  const setSelectedNetwork = useCallback((value: number | null) => {
    _setSelectedNetwork(value)
  }, [])

  return (
    <NetworkContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setSelectedNetwork,
          },
          state: {
            selectedNetwork,
          },
        }
      }, [selectedNetwork, setSelectedNetwork])}
    >
      {children}
    </NetworkContext.Provider>
  )
}

const useNetworkContext = () => {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error('Hook can only be used inside Network Context')
  }

  return context
}

export { NetworkProvider, useNetworkContext }
