import { referral } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useReferral = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useReferral', address],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return referral(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
        },
      )
    },
    enabled: !!address,
    refetchInterval: ms('10000'),
  })
}
