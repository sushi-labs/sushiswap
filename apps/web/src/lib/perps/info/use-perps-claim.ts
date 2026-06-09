import { getPerpsClaim } from '@sushiswap/graph-client/data-api'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { sushiReferralQueryKeys } from '../sushi-referral'

export function usePerpsClaim({
  address,
}: {
  address: EvmAddress | undefined
}) {
  return useQuery({
    queryKey: sushiReferralQueryKeys.claim(address),
    queryFn: async () => {
      if (!address) {
        throw new Error('address is required')
      }

      return getPerpsClaim({ address })
    },
    enabled: Boolean(address),
  })
}
