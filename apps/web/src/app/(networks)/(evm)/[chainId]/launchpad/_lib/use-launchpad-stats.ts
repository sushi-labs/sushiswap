import { getLaunchpadStats } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { LaunchpadChainId } from '../constants'

export function useLaunchpadStats({ chainId }: { chainId: LaunchpadChainId }) {
  return useQuery({
    queryKey: ['launchpad', 'stats', chainId],
    queryFn: () => {
      return getLaunchpadStats({ chainId })
    },
    staleTime: ms('1m'),
    refetchInterval: ms('1m'),
  })
}
