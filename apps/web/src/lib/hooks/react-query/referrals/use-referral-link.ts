import { Fuul, UserIdentifierType } from '@fuul/sdk'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export const useReferralLink = ({
  address,
  enabled = true,
}: { address?: EvmAddress; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['useReferralLink', { address, enabled }],
    queryFn: async () => {
      if (!address) return null
      return await Fuul.generateTrackingLink(
        `${window?.location?.origin}/ethereum/swap`,
        address,
        UserIdentifierType.EvmAddress,
      )
    },
    enabled: Boolean(enabled && address),
  })
}
