'use client'
import {
  type AllDexsClearinghouseStateEvent,
  allDexsClearinghouseState,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useAllDexClearinghouseState = ({
  address,
}: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<AllDexsClearinghouseStateEvent>({
    queryKey: ['useAllDexClearinghouseState', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await allDexsClearinghouseState(
        { transport: hlWebSocketTransport },
        { user: address },
        (allDexsClearinghouseStateEvent) => {
          queryClient.setQueryData(
            ['useAllDexClearinghouseState', address],
            (
              _prevAllDexsClearinghouseStateEvent:
                | AllDexsClearinghouseStateEvent
                | undefined,
            ) => {
              return allDexsClearinghouseStateEvent
            },
          )
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [queryClient, address])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
