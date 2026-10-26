import {
  type ClearinghouseStateResponse,
  clearinghouseState,
} from '@nktkas/hyperliquid/api/info'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport } from '../transports'

export function useClearinghouseState({
  address,
  dex = '',
}: { address?: EvmAddress; dex?: string }): UseQueryResult<
  ClearinghouseStateResponse,
  Error
> {
  return useQuery({
    queryKey: ['useClearinghouseState', address, dex],
    queryFn: ({ signal }) => {
      if (!address) throw new Error('Account address is required.')
      return clearinghouseState(
        { transport: hlHttpTransport },
        { user: address, dex },
        signal,
      )
    },
    enabled: !!address,
    refetchInterval: 30_000,
  })
}
