import { delegatorSummary } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useDelegatorSummary = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useDelegatorSummary', address],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return delegatorSummary(
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
