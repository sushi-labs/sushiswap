import { getPerpsSushiReferredUsers } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiReferralQueryKeys } from '../sushi-referral'

export function useSushiReferredUsers({
  address,
}: {
  address: EvmAddress | undefined
}) {
  return useQuery({
    queryKey: sushiReferralQueryKeys.referees(address),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsSushiReferredUsers({
        address,
      })
    },
    enabled: Boolean(address),
  })
}
