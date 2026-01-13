'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useContext, useMemo } from 'react'
interface State {
  mutate: {
    setActiveAsset: (asset: string) => void
  }
  state: {
    activeAsset: string
  }
}

const PerpStateContext = createContext<State>({} as State)

interface PerpStateProviderProps {
  children: React.ReactNode
}

const PerpStateProvider: FC<PerpStateProviderProps> = ({ children }) => {
  const [activeAsset, setActiveAsset] = useLocalStorage<string>(
    'sushi.perps.active-asset',
    'BTC',
  )

  return (
    <PerpStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setActiveAsset,
          },
          state: {
            activeAsset,
          },
        }
      }, [activeAsset, setActiveAsset])}
    >
      {children}
    </PerpStateContext.Provider>
  )
}

const usePerpState = () => {
  const context = useContext(PerpStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside PerpState State Context')
  }

  return context
}

export { PerpStateProvider, usePerpState }
