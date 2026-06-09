'use client'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAllMids } from './use-all-mids'

//used for semi static mid price where super fresh price not needed
export const useMidPrice = ({
  assetString,
  refreshIntervalMs = 10_000,
}: {
  assetString: string | undefined
  refreshIntervalMs?: number
}) => {
  const { data: allMidsData } = useAllMids()
  // console.log('allMidsData', allMidsData)
  const [midPrice, setMidPrice] = useState<string | null>(null)

  const liveMidPrice = useMemo(
    () => allMidsData?.mids?.[assetString ?? ''],
    [allMidsData?.mids, assetString],
  )

  // Keep latest liveMidPrice in a ref so interval always sees the newest value
  const liveMidRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    liveMidRef.current = liveMidPrice
  }, [liveMidPrice])

  // Initialize midPrice once when first available
  useEffect(() => {
    if (midPrice === null && liveMidPrice !== undefined)
      setMidPrice(liveMidPrice)
  }, [liveMidPrice, midPrice])

  const refreshMidPrice = useCallback(() => {
    const next = liveMidRef.current
    if (next !== undefined) {
      setMidPrice(next)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(refreshMidPrice, refreshIntervalMs)
    return () => clearInterval(id)
  }, [refreshIntervalMs, refreshMidPrice])

  return { midPrice, refreshMidPrice }
}
