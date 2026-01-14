import { useEffect, useRef, useState } from 'react'
import type { ActiveAsset } from './use-active-asset'

export const useInitialDecimals = (asset: ActiveAsset | undefined) => {
  const assetRef = useRef(asset?.name)
  const [initialDecimals, setInitialDecimals] = useState<number | undefined>(
    undefined,
  )
  useEffect(() => {
    if (
      (initialDecimals !== undefined && asset?.name === assetRef.current) ||
      !asset
    ) {
      return
    }
    assetRef.current = asset?.name
    const value =
      asset?.marketType === 'perp' ? asset?.markPrice : asset?.lastPrice
    if (value) {
      const parts = value.toString().split('.')
      if (parts.length === 2) {
        setInitialDecimals(parts[1].length)
      } else {
        setInitialDecimals(0)
      }
    }
  }, [initialDecimals, asset])
  return initialDecimals
}
