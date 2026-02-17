'use client'
import { useLocalStorage } from '@sushiswap/hooks'
import { type FC, createContext, useContext, useMemo } from 'react'
import { useActiveAssetData } from 'src/lib/perps/subscription/use-active-asset-data'
import { useAccount } from 'src/lib/wallet'
interface State {
  mutate: {
    setActiveAsset: (asset: string) => void
  }
  state: {
    activeAsset: string
    activeAssetDataQuery: ReturnType<typeof useActiveAssetData>
  }
}

const AssetStateContext = createContext<State>({} as State)

interface AssetStateProviderProps {
  children: React.ReactNode
}

const AssetStateProvider: FC<AssetStateProviderProps> = ({ children }) => {
  const address = useAccount('evm')
  const [activeAsset, setActiveAsset] = useLocalStorage<string>(
    'sushi.perps.active-asset',
    'BTC',
  )
  const activeAssetDataQuery = useActiveAssetData({
    address,
    assetString: activeAsset,
  })

  return (
    <AssetStateContext.Provider
      value={useMemo(() => {
        return {
          mutate: {
            setActiveAsset,
          },
          state: {
            activeAsset,
            activeAssetDataQuery,
          },
        }
      }, [activeAsset, setActiveAsset, activeAssetDataQuery])}
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
