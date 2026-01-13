'use client'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import { useAssetList } from 'src/lib/perps/use-asset-list'
interface State {
  state: {
    assetListQuery: ReturnType<typeof useAssetList>
    uniqueDexes: string[]
    spotCollateralTokens: string[]
  }
}

const AssetListContext = createContext<State>({} as State)

interface AssetListProviderProps {
  children: React.ReactNode
}

const AssetListProvider: FC<AssetListProviderProps> = ({ children }) => {
  const assetListQuery = useAssetList()

  const uniqueDexes = useMemo(() => {
    if (!assetListQuery.data) return []
    const dexSet = new Set<string>()
    assetListQuery.data.forEach((asset) => {
      if (asset.marketType === 'perp' && asset.dex) {
        dexSet.add(asset.dex)
      }
    })
    return Array.from(dexSet)
  }, [assetListQuery.data])

  const spotCollateralTokens = useMemo(() => {
    if (!assetListQuery.data) return []
    const tokensSet = new Set<string>()
    assetListQuery.data.forEach((asset) => {
      if (asset.marketType === 'spot' && asset.tokens) {
        const token = asset.tokens?.[1].name
        tokensSet.add(token)
      }
    })
    return Array.from(tokensSet)
  }, [assetListQuery.data])

  return (
    <AssetListContext.Provider
      value={useMemo(() => {
        return {
          state: {
            assetListQuery,

            uniqueDexes,
            spotCollateralTokens,
          },
        }
      }, [assetListQuery, uniqueDexes, spotCollateralTokens])}
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
