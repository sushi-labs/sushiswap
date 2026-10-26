import { subAccounts2 } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useSubAccounts = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useSubAccounts', address],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return subAccounts2(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
        },
      )
    },
    enabled: !!address,
    refetchInterval: 30_000,
  })
}
