'use client'
import type { SymbolConverter } from '@nktkas/hyperliquid/utils'
import { type FC, createContext, useContext, useMemo } from 'react'
import {
  type PerpOrSpotAsset,
  useAssetList,
  useSymbolConverter,
} from 'src/lib/perps'

type SpotBasisAsset = PerpOrSpotAsset & { marketType: 'spot' }
type PerpBasisAsset = PerpOrSpotAsset & { marketType: 'perp' }

export type BasisTradeAsset = {
  spotAsset: SpotBasisAsset
  perpAsset: PerpBasisAsset
}

function getBasisAssetKey(
  symbol: string,
  separator: '/' | '-',
): string | undefined {
  const separatorIndex = symbol.lastIndexOf(separator)

  if (separatorIndex === -1) return undefined

  const base = symbol.slice(0, separatorIndex)

  if (!base) return undefined

  return base.toLowerCase()
}

function isSpotBasisAsset(asset: PerpOrSpotAsset): asset is SpotBasisAsset {
  return asset.marketType === 'spot'
}

function isPerpBasisAsset(asset: PerpOrSpotAsset): asset is PerpBasisAsset {
  return asset.marketType === 'perp'
}

interface State {
  state: {
    assetListQuery: ReturnType<typeof useAssetList>
    uniqueDexes: string[]
    spotCollateralTokens: string[]
    basisTradeAssets: BasisTradeAsset[]
    symbolConverter: SymbolConverter | undefined
    dexQuoteMap: Map<string, string>
  }
}

const AssetListContext = createContext<State>({} as State)

interface AssetListProviderProps {
  children: React.ReactNode
}

const AssetListProvider: FC<AssetListProviderProps> = ({ children }) => {
  const assetListQuery = useAssetList()
  const { data: symbolConverter } = useSymbolConverter()

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

  const dexQuoteMap = useMemo(() => {
    const map = new Map<string, string>()
    assetListQuery.data?.forEach((asset) => {
      if (asset.marketType === 'perp' && asset.tokens) {
        const quoteToken = asset?.tokens?.[0]?.name
        map.set(asset.dex, quoteToken)
      }
    })
    return map
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

  const basisTradeAssets = useMemo(() => {
    if (!assetListQuery.data) return []

    const perpsByAsset = new Map<string, PerpBasisAsset[]>()

    assetListQuery.data.forEach((asset) => {
      if (!isPerpBasisAsset(asset)) return

      const assetKey = getBasisAssetKey(asset.symbol, '-')
      if (!assetKey) return

      const perpAssets = perpsByAsset.get(assetKey)
      if (perpAssets) {
        perpAssets.push(asset)
      } else {
        perpsByAsset.set(assetKey, [asset])
      }
    })

    const pairs: BasisTradeAsset[] = []

    assetListQuery.data.forEach((asset) => {
      if (!isSpotBasisAsset(asset)) return

      const assetKey = getBasisAssetKey(asset.symbol, '/')
      if (!assetKey) return

      const perpAssets = perpsByAsset.get(assetKey)
      if (!perpAssets) return

      perpAssets.forEach((perpAsset) => {
        pairs.push({ spotAsset: asset, perpAsset })
      })
    })

    return pairs
  }, [assetListQuery.data])

  return (
    <AssetListContext.Provider
      value={useMemo(() => {
        return {
          state: {
            assetListQuery,
            uniqueDexes,
            spotCollateralTokens,
            basisTradeAssets,
            symbolConverter,
            dexQuoteMap,
          },
        }
      }, [
        assetListQuery,
        uniqueDexes,
        spotCollateralTokens,
        basisTradeAssets,
        symbolConverter,
        dexQuoteMap,
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
