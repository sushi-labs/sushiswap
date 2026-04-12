import { getPerpsSushiReferralOverview } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiReferralQueryKeys } from '../sushi-referral'

export function useSushiReferralOverview({
  address,
}: {
  address: EvmAddress | undefined
}) {
  return useQuery({
    queryKey: sushiReferralQueryKeys.overview(address),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsSushiReferralOverview({ address })
    },
    enabled: Boolean(address),
  })
}
