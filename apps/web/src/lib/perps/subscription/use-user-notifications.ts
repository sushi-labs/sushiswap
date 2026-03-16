'use client'
import { notification } from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useUserNotifications = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const skipFirst = useRef(true)

  const query = useQuery<string>({
    queryKey: ['useUserNotifications', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return

    skipFirst.current = true
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await notification(
        { transport: hlWebSocketTransport },
        { user: address },
        (userNotification) => {
          if (skipFirst.current) {
            skipFirst.current = false
            return
          }

          queryClient.setQueryData(
            ['useUserNotifications', address],
            userNotification?.notification,
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
