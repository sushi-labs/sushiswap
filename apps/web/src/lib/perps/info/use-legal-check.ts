import { legalCheck } from '@nktkas/hyperliquid/api/info'
import { useQuery } from '@tanstack/react-query'
import ms from 'ms'
import type { EvmAddress } from 'sushi/evm'
import { zeroAddress } from 'viem'
import { hlHttpTransport } from '../transports'

type LegalCheckResponse = Awaited<ReturnType<typeof legalCheck>>
type LegalCheckResponseWithRestrictions = Omit<
  LegalCheckResponse,
  'ipAllowed'
> & {
  restrictions: 'n' | 'a' | 'o'
}

export const useLegalCheck = ({
  address,
}: {
  address: EvmAddress | undefined
}) => {
  return useQuery({
    queryKey: ['useLegalCheck', address],
    queryFn: async () => {
      const response = (await legalCheck(
        {
          transport: hlHttpTransport,
        },
        {
          user: !address ? zeroAddress : address,
        },
      )) as LegalCheckResponse | LegalCheckResponseWithRestrictions

      if ('ipAllowed' in response) {
        return response
      }

      return {
        ...response,
        ipAllowed:
          response.restrictions === 'n' || response.restrictions === 'o',
      }
    },
    refetchInterval: ms('10000'),
  })
}
