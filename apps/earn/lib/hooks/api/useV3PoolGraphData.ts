import { useQuery } from '@tanstack/react-query'
import { ChainId, chainShortName } from '@sushiswap/chain'
import { getBuiltGraphSDK } from '@sushiswap/graph-client'

interface UseV3PoolGraphDataParams {
  poolId: string
  chainId: ChainId
}

const sdk = getBuiltGraphSDK()

export const useV3PoolGraphData = ({ poolId, chainId }: UseV3PoolGraphDataParams) => {
  return useQuery({
    queryKey: ['useV3PoolGraphData', { poolId, chainId }],
    queryFn: async () => {
      const { pair } = await sdk.PairById({
        id: `${chainShortName[chainId]}:${poolId}`,
      })

      return {
        liquidityNative: pair ? Number(pair?.liquidityNative) : null,
        liquidityUSD: pair ? Number(pair?.liquidityUSD) : null,
        liquidity1dChange: pair ? Number(pair?.liquidity1dChange ?? 0) : null,
        fees1d: pair ? Number(pair?.fees1d ?? 0) : null,
        fees1dChange: pair ? Number(pair?.fees1dChange ?? 0) : null,
        volume1d: pair ? Number(pair?.volume1d ?? 0) : null,
        volume1dChange: pair ? Number(pair?.volume1dChange ?? 0) : null,
        txCount1d: pair ? Number(pair?.txCount1d ?? 0) : null,
        txCount1dChange: pair ? Number(pair?.txCount1dChange ?? 0) : null,
        hourSnapshots: pair?.hourSnapshots ?? null,
        daySnapshots: pair?.daySnapshots ?? null,
      }
    },
    keepPreviousData: true,
    staleTime: 0,
    cacheTime: 86400000, // 24hs
  })
}
