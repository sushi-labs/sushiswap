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

const AssetStateContext = createContext<State>({} as State)

interface AssetStateProviderProps {
  children: React.ReactNode
}

const AssetStateProvider: FC<AssetStateProviderProps> = ({ children }) => {
  const [activeAsset, setActiveAsset] = useLocalStorage<string>(
    'sushi.perps.active-asset',
    'BTC',
  )

  return (
    <AssetStateContext.Provider
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
    </AssetStateContext.Provider>
  )
}

const useAssetState = () => {
  const context = useContext(AssetStateContext)
  if (!context) {
    throw new Error('Hook can only be used inside AssetState State Context')
  }

  return context
}

export { AssetStateProvider, useAssetState }
