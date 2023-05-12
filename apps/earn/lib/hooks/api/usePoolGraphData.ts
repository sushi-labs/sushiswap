import { useQuery } from '@tanstack/react-query'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'

interface UsePoolGraphDataParams {
  poolId: string
  chainId: ChainId
  enabled?: boolean
}

const sdk = getBuiltGraphSDK()

export const usePoolGraphData = ({ poolId, chainId, enabled = true }: UsePoolGraphDataParams) => {
  return useQuery({
    queryKey: ['usePoolGraphData', { poolId, chainId }],
    queryFn: async () => {
      const { pair } = await sdk.PairById({
        id: `${chainShortName[chainId]}:${poolId}`,
      })

      if (pair) {
        return {
          liquidityNative: Number(pair.liquidityNative),
          liquidityUSD: Number(pair.liquidityUSD),
          liquidity1dChange: Number(pair.liquidity1dChange ?? 0),
          fees1d: Number(pair.fees1d ?? 0),
          fees1dChange: Number(pair.fees1dChange ?? 0),
          volume1d: Number(pair.volume1d ?? 0),
          volume1dChange: Number(pair.volume1dChange ?? 0),
          txCount1d: Number(pair.txCount1d ?? 0),
          txCount1dChange: Number(pair.txCount1dChange ?? 0),
          hourSnapshots: pair.hourSnapshots,
          daySnapshots: pair.daySnapshots,
        }
      }

      return null
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 86400000, // 24hs
    enabled: Boolean(poolId && chainId && enabled),
  })
}
