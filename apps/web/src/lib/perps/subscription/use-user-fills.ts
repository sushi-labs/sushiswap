'use client'
import {
  type UserFillsEvent,
  userFills,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useUserFills = ({
  address,
  aggregateByTime,
  uniqueOrderIds = true,
}: {
  address?: EvmAddress
  aggregateByTime?: boolean
  uniqueOrderIds?: boolean
}) => {
  const queryClient = useQueryClient()
  const query = useQuery<UserFillsEvent>({
    queryKey: ['useUserFills', address, aggregateByTime],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await userFills(
        { transport: hlWebSocketTransport },
        { user: address, aggregateByTime: aggregateByTime },
        (userFillsEvent) => {
          queryClient.setQueryData(
            ['useUserFills', address, aggregateByTime],
            (prevUserFillsEvent: UserFillsEvent | undefined) => {
              const fills = userFillsEvent.fills
              const prevFills = prevUserFillsEvent?.fills ?? []
              const combinedFills = uniqueOrderIds
                ? Array.from(
                    new Map(
                      [...fills, ...prevFills].map((fill) => [fill.oid, fill]),
                    ).values(),
                  )
                : [...fills, ...prevFills]
              return {
                user: userFillsEvent.user,
                fills: combinedFills,
                isSnapshot: userFillsEvent.isSnapshot,
              }
            },
          )
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [queryClient, address, aggregateByTime, uniqueOrderIds])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
