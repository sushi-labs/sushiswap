import {
  type TwapStatesEvent,
  twapStates,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useUserActiveTwap = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<TwapStatesEvent>({
    queryKey: ['useUserActiveTwap', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await twapStates(
        { transport: hlWebSocketTransport },
        { user: address },
        (twapStateEvent) => {
          queryClient.setQueryData(
            ['useUserActiveTwap', address],
            (_prevTwapStatesEvent: TwapStatesEvent | undefined) => {
              return twapStateEvent
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
