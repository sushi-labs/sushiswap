import {
  getAnalyticsDayBuckets,
  isPoolChainId,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { ChainId } from 'sushi'

export const useAnalyticsDayBuckets = ({
  chainId,
  enabled,
}: { chainId: ChainId; enabled: boolean }) => {
  return useQuery({
    queryKey: ['useAnalyticsDayBuckets', { chainId }],
    queryFn: async () => {
      if (!chainId) {
        throw new Error('chainId is required')
      }
      if (!isPoolChainId(chainId)) {
        throw new Error('Invalid pool chainId')
      }

      const dayBuckets = await getAnalyticsDayBuckets({ chainId })

      return dayBuckets
    },
    refetchInterval: ms('15m'),
    enabled: Boolean(enabled && isPoolChainId(chainId)),
  })
}
