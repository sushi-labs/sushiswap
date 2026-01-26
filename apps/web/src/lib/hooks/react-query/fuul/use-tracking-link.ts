import { Fuul, UserIdentifierType } from '@fuul/sdk'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'

export const useTrackingLink = ({
  address,
  enabled = true,
}: { address?: EvmAddress; enabled?: boolean }) => {
  return useQuery({
    queryKey: ['useTrackingLink', { address, enabled }],
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
