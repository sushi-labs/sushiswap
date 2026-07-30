import {
  type LaunchpadChainId,
  getLaunchpadStats,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'

export function useLaunchpadStats({ chainId }: { chainId: LaunchpadChainId }) {
  return useQuery({
    queryKey: ['launchpad', 'stats', chainId],
    queryFn: () => {
      return getLaunchpadStats({ chainId })
    },
    staleTime: 60_000,
    refetchInterval: 60_000,
  })
}
