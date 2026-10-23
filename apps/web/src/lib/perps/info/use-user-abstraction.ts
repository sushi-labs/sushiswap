import {
  type UserAbstractionResponse,
  userAbstraction,
} from '@nktkas/hyperliquid/api/info'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export function useUserAbstraction({
  address,
}: { address?: EvmAddress }): UseQueryResult<UserAbstractionResponse, Error> {
  return useQuery({
    queryKey: ['useUserAbstraction', address],
    queryFn: ({ signal }) => {
      if (!address) throw new Error('Account address is required.')
      return userAbstraction(
        { transport: hlHttpTransport },
        { user: address },
        signal,
      )
    },
    enabled: !!address,
    staleTime: 30_000,
    refetchInterval: 30_000,
  })
}
