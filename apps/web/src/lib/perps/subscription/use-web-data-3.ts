import {
  type WebData3Event,
  webData3,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useWebData3 = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<WebData3Event>({
    queryKey: ['useWebData3', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: Boolean(address),
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await webData3(
        { transport: hlWebSocketTransport },
        { user: address },
        (webData3Event) => {
          queryClient.setQueryData(
            ['useWebData3', address],
            (_prevWebData3Event: WebData3Event | undefined) => {
              return webData3Event
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
