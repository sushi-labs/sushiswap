import { userVaultEquities } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useUserVaultEquities = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useUserVaultEquities', address],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return userVaultEquities(
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
