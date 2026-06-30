import { legalCheck } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmAddress } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { IS_PERPS_TESTNET } from '../config'
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
    refetchInterval: IS_PERPS_TESTNET ? false : ms('10000'),
  })
}
