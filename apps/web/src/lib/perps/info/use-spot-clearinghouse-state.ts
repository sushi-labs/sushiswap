import { spotClearinghouseState } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'
import { isTokenBalance } from '../utils'

export const useSpotClearinghouseState = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useSpotClearinghouseState', address],
    queryFn: async () => {
      if (!address) {
        throw new Error('address is undefined')
      }
      const res = await spotClearinghouseState(
        {
          transport: hlHttpTransport,
        },
        {
          user: address,
        },
      )
      return {
        ...res,
        balances: res.balances.filter(isTokenBalance),
      }
    },
    enabled: !!address,
    refetchInterval: ms('30s'),
  })
}
