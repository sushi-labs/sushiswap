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
}: { address?: EvmAddress; aggregateByTime?: boolean }) => {
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
        { user: address, aggregateByTime: aggregateByTime ?? false },
        (userFillsEvent) => {
          queryClient.setQueryData(
            ['useUserFills', address, aggregateByTime],
            (_prevUserFillsEvent: UserFillsEvent | undefined) => {
              return userFillsEvent
            },
          )
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [queryClient, address, aggregateByTime])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
