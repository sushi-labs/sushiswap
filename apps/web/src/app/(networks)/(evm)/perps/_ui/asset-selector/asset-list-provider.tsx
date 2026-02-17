'use client'
import type { SymbolConverter } from '@nktkas/hyperliquid/utils'
import { type FC, createContext, useContext, useMemo, useState } from 'react'
import { useSymbolConverter } from 'src/lib/perps/info/use-symbol-converter'
import { useAllMids } from 'src/lib/perps/subscription/use-all-mids'
import { useAssetList } from 'src/lib/perps/subscription/use-asset-list'
interface State {
  state: {
    assetListQuery: ReturnType<typeof useAssetList>
    uniqueDexes: string[]
    spotCollateralTokens: string[]
    allMidsQuery: ReturnType<typeof useAllMids>
    allMidsDexName: string | undefined
    symbolConverter: SymbolConverter | undefined
  }
  mutate: {
    setAllMidsDexName: (dexName: string | undefined) => void
  }
}

const AssetListContext = createContext<State>({} as State)

interface AssetListProviderProps {
  children: React.ReactNode
}

const AssetListProvider: FC<AssetListProviderProps> = ({ children }) => {
  const [allMidsDexName, setAllMidsDexName] = useState<string | undefined>(
    undefined,
  )
  const assetListQuery = useAssetList()
  const { data: symbolConverter } = useSymbolConverter()
  const allMidsQuery = useAllMids({
    dexName: allMidsDexName,
  })

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
            allMidsQuery,
            allMidsDexName,
            symbolConverter,
          },
          mutate: {
            setAllMidsDexName,
          },
        }
      }, [
        assetListQuery,
        uniqueDexes,
        spotCollateralTokens,
        allMidsQuery,
        allMidsDexName,
        symbolConverter,
      ])}
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
