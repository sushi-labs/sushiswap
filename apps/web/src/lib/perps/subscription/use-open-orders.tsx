import {
  type OpenOrdersEvent,
  openOrders,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useOpenOrders = ({
  address,
  dexName,
}: { address?: EvmAddress; dexName?: string }) => {
  const queryClient = useQueryClient()
  const query = useQuery<OpenOrdersEvent>({
    queryKey: ['useOpenOrders', address, dexName],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await openOrders(
        { transport: hlWebSocketTransport },
        { user: address },
        (openOrdersEvent) => {
          queryClient.setQueryData(
            ['useOpenOrders', address, dexName],
            (_prevOpenOrdersEvent: OpenOrdersEvent | undefined) => {
              return openOrdersEvent
            },
          )
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [queryClient, address, dexName])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
