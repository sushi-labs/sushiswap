import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAssetListState } from '~evm/perps/_ui/asset-list-provider'

//used for semi static mid price where super fresh price not needed
export const useMidPrice = ({
  assetString,
  refreshIntervalMs = 10000,
}: {
  assetString: string | undefined
  refreshIntervalMs?: number
}) => {
  const {
    state: {
      allMidsQuery: { data: allMidsData },
    },
  } = useAssetListState()
  const [midPrice, setMidPrice] = useState<string | null>(null)

  const liveMidPrice = useMemo(
    () => allMidsData?.mids?.[assetString ?? ''],
    [allMidsData?.mids, assetString],
  )

  useEffect(() => {
    if (liveMidPrice && !midPrice) {
      setMidPrice(liveMidPrice)
    }
  }, [liveMidPrice, midPrice])

  const refreshMidPrice = useCallback(() => {
    if (liveMidPrice) {
      setMidPrice(liveMidPrice)
    }
  }, [liveMidPrice])

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMidPrice()
    }, refreshIntervalMs ?? 10_000)
    return () => clearInterval(interval)
  }, [refreshMidPrice, refreshIntervalMs])

  return {
    midPrice,
    refreshMidPrice,
  }
}
