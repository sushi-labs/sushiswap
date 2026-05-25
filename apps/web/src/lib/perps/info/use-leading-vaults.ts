import { leadingVaults } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useLeadingVaults = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useLeadingVaults', address],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return leadingVaults(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
        },
      )
    },
    enabled: !!address,
  })
}
