import { legalCheck } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmAddress } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { hlHttpTransport } from '../transports'

export const useLegalCheck = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useLegalCheck', address],
    queryFn: async () => {
      const response = await legalCheck(
        {
          transport: hlHttpTransport,
        },
        {
          user: !address ? zeroAddress : address,
        },
      )

      return {
        ...response,
        ipAllowed: response.restrictions === 'n',
      }
    },
    refetchInterval: ms('10000'),
  })
}
