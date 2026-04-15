import { getPerpsSushiReferredUsers } from '@sushiswap/graph-client/data-api'
import { useInfiniteQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiReferralQueryKeys } from '../sushi-referral'

const DEFAULT_PAGE_SIZE = 50

export function useSushiReferredUsers({
  address,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  address: EvmAddress | undefined
  pageSize?: number
}) {
  return useInfiniteQuery({
    queryKey: sushiReferralQueryKeys.referees(address, pageSize),
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsSushiReferredUsers({
        address,
        limit: pageSize,
        offset: pageParam,
      })
    },
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < pageSize) {
        return undefined
      }

      return allPages.length * pageSize
    },
    enabled: Boolean(address),
  })
}
