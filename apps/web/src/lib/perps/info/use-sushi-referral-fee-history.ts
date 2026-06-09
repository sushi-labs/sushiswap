import { getPerpsSushiReferralFeeHistory } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiReferralQueryKeys } from '../sushi-referral'

export function useSushiReferralFeeHistory({
  address,
  from,
  to,
}: {
  address: EvmAddress | undefined
  from?: string
  to?: string
}) {
  return useQuery({
    queryKey: sushiReferralQueryKeys.history(address, from, to),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsSushiReferralFeeHistory({ address, from, to })
    },
    enabled: Boolean(address),
  })
}
