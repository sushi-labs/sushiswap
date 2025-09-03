import {
  type TopNonEvmPools,
  getTopNonEvmPools,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import { TvmChainId } from 'sushi/tvm'

interface UseTopPools {
  enabled?: boolean
}

export type TopPool = TopNonEvmPools[number]

export function useTopPools(
  { enabled = true }: UseTopPools = { enabled: true },
) {
  return useQuery({
    queryKey: ['pools', { chainId: TvmChainId.TRON }],
    queryFn: async () => await getTopNonEvmPools({ chainId: TvmChainId.TRON }),
    enabled: Boolean(enabled),
  })
}
