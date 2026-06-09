'use client'
import {
  type AllMidsEvent,
  allMids,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { hlWebSocketTransport } from '../transports'

export const useAllMids = () => {
  const queryClient = useQueryClient()
  const query = useQuery<AllMidsEvent>({
    queryKey: ['useAllMids'],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await allMids(
        { transport: hlWebSocketTransport },
        { dex: 'ALL_DEXS' },
        (allMidsEvent) => {
          queryClient.setQueryData(
            ['useAllMids'],
            (_prevAllMidsEvent: AllMidsEvent | undefined) => {
              return allMidsEvent
            },
          )
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [queryClient])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
