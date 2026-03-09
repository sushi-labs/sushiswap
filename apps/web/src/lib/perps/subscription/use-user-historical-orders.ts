'use client'
import {
  type UserHistoricalOrdersEvent,
  userHistoricalOrders,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useUserHistoricalOrders = ({
  address,
}: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<UserHistoricalOrdersEvent>({
    queryKey: ['useUserHistoricalOrders', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await userHistoricalOrders(
        { transport: hlWebSocketTransport },
        { user: address },
        (userHistoricalOrdersEvent) => {
          queryClient.setQueryData(
            ['useUserHistoricalOrders', address],
            (
              prevUserHistoricalOrdersEvent:
                | UserHistoricalOrdersEvent
                | undefined,
            ) => {
              const orderHistory = userHistoricalOrdersEvent.orderHistory
              const prevOrderHistory =
                prevUserHistoricalOrdersEvent?.orderHistory ?? []
              const combinedOrderHistory = Array.from(
                new Map(
                  [...orderHistory, ...prevOrderHistory].map((order) => [
                    `${order.order.oid}-${order.status}`,
                    order,
                  ]),
                ).values(),
              )
              return {
                user: userHistoricalOrdersEvent.user,
                orderHistory: combinedOrderHistory,
                isSnapshot: userHistoricalOrdersEvent.isSnapshot,
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
