import { useMemo } from 'react'
import type { PerpOrSpotAsset } from './subscription/use-asset-list'

export const useSymbolSplit = ({
  asset,
}: {
  asset: PerpOrSpotAsset | undefined
}) => {
  const { baseSymbol, quoteSymbol } = useMemo(() => {
    const symbols =
      asset?.marketType === 'spot'
        ? asset?.symbol?.split('/')
        : asset?.symbol?.split('-')
    return {
      baseSymbol: symbols?.[0] ?? 'BASE',
      quoteSymbol: symbols?.[1] ?? 'QUOTE',
    }
  }, [asset?.symbol, asset?.marketType])

  return { baseSymbol, quoteSymbol }
}
