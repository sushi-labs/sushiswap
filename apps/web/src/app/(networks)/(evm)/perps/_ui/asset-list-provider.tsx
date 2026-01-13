'use client'
import { type FC, createContext, useContext, useMemo } from 'react'
import { useAssetList } from 'src/lib/perps/use-asset-list'
interface State {
  state: {
    assetListQuery: ReturnType<typeof useAssetList>
  }
}

const AssetListContext = createContext<State>({} as State)

interface AssetListProviderProps {
  children: React.ReactNode
}

const AssetListProvider: FC<AssetListProviderProps> = ({ children }) => {
  const assetListQuery = useAssetList()

  return (
    <AssetListContext.Provider
      value={useMemo(() => {
        return {
          state: {
            assetListQuery,
          },
        }
      }, [assetListQuery])}
    >
      {children}
    </AssetListContext.Provider>
  )
}

const useAssetListState = () => {
  const context = useContext(AssetListContext)
  if (!context) {
    throw new Error('Hook can only be used inside AssetList Context')
  }

  return context
}

export { AssetListProvider, useAssetListState }
