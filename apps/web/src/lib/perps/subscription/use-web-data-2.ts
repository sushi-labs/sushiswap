import {
  type WebData2Event,
  webData2,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useWebData2 = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<WebData2Event>({
    queryKey: ['useWebData2', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: Boolean(address),
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await webData2(
        { transport: hlWebSocketTransport },
        { user: address },
        (webData2Event) => {
          queryClient.setQueryData(
            ['useWebData2', address],
            (_prevWebData2Event: WebData2Event | undefined) => {
              return webData2Event
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
