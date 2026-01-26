import { Fuul, UserIdentifierType } from '@fuul/sdk'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export const useTrackingData = ({
  address,
  enabled = true,
}: { address?: EvmAddress; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['useTrackingData', { address, enabled }],
    queryFn: async () => {
      if (!address) return null

      return await Fuul.getReferralStatus({
        user_identifier: address,
        user_identifier_type: UserIdentifierType.EvmAddress,
      })
    },
    enabled: Boolean(enabled && address),
  })
}
