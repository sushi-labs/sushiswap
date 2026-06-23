import { leadingVaults } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export function getLeadingVaultsQueryKey(
  address: EvmAddress | undefined,
): readonly ['useLeadingVaults', EvmAddress | undefined] {
  return ['useLeadingVaults', address]
}

export const useLeadingVaults = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: getLeadingVaultsQueryKey(address),
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
