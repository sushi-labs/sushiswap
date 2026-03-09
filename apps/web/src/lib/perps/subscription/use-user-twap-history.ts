'use client'
import {
  type UserTwapHistoryEvent,
  userTwapHistory,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useUserTwapHistory = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<UserTwapHistoryEvent>({
    queryKey: ['useUserTwapHistory', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await userTwapHistory(
        { transport: hlWebSocketTransport },
        { user: address },
        (userTwapHistoryEvent) => {
          queryClient.setQueryData(
            ['useUserTwapHistory', address],
            (prevUserTwapHistoryEvent: UserTwapHistoryEvent | undefined) => {
              const twapHistory = userTwapHistoryEvent.history
              const prevTwapHistory = prevUserTwapHistoryEvent?.history ?? []
              const combinedTwapHistory = Array.from(
                new Map(
                  [...twapHistory, ...prevTwapHistory].map((twap) => [
                    twap.time,
                    twap,
                  ]),
                ).values(),
              )
              return {
                user: userTwapHistoryEvent.user,
                history: combinedTwapHistory,
                isSnapshot: userTwapHistoryEvent.isSnapshot,
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
  }, [queryClient, address])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
