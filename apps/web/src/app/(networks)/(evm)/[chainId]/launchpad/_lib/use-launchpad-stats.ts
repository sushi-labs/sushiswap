import {
  type LaunchpadProvider,
  getLaunchpadStats,
} from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { LaunchpadChainId } from '../constants'

export function useLaunchpadStats({
  chainId,
  providers,
}: {
  chainId: LaunchpadChainId
  providers: LaunchpadProvider[]
}) {
  return useQuery({
    queryKey: ['launchpad', 'stats', { chainId, providers }],
    queryFn: () => {
      return getLaunchpadStats({ chainId, providers })
    },
    staleTime: ms('1m'),
    refetchInterval: ms('1m'),
  })
}
