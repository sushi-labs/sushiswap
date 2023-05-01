import { Pair } from '@sushiswap/graph-client'
import { useMemo } from 'react'
import useSWR from 'swr'

export const usePoolGraphData = (poolId: string) => {
  const swrResponse = useSWR<Pair>(`/earn/api/graphPool/${poolId}`, async (url) =>
    fetch(url).then((data) => data.json())
  )
  return useMemo(() => {
    return {
      ...swrResponse,
      data: {
        liquidityNative: swrResponse.data ? Number(swrResponse.data?.liquidityNative) : null,
        liquidityUSD: swrResponse.data ? Number(swrResponse.data?.liquidityUSD) : null,
        liquidity1dChange: swrResponse.data ? Number(swrResponse.data?.liquidity1dChange ?? 0) : null,
        fees1d: swrResponse.data ? Number(swrResponse.data?.fees1d ?? 0) : null,
        fees1dChange: swrResponse.data ? Number(swrResponse.data?.fees1dChange ?? 0) : null,
        volume1d: swrResponse.data ? Number(swrResponse.data?.volume1d ?? 0) : null,
        volume1dChange: swrResponse.data ? Number(swrResponse.data?.volume1dChange ?? 0) : null,
        txCount1d: swrResponse.data ? Number(swrResponse.data?.txCount1d ?? 0) : null,
        txCount1dChange: swrResponse.data ? Number(swrResponse.data?.txCount1dChange ?? 0) : null,
        hourSnapshots: swrResponse.data?.hourSnapshots ?? null,
        daySnapshots: swrResponse.data?.daySnapshots ?? null,
      },
    }
  }, [swrResponse])
}
