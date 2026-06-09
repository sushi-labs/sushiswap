import { spotClearinghouseState } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export const useSpotClearinghouseState = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useSpotClearinghouseState', address],
    queryFn: () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      return spotClearinghouseState(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
          dex: 'ALL_DEXES',
        },
      )
    },
    enabled: !!address,
    refetchInterval: ms('30s'),
  })
}
