import {
  type UserTwapSliceFillsEvent,
  userTwapSliceFills,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useUserTwapFillHistory = ({
  address,
}: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<UserTwapSliceFillsEvent>({
    queryKey: ['useUserTwapFillHistory', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await userTwapSliceFills(
        { transport: hlWebSocketTransport },
        { user: address },
        (userTwapSliceFillsEvent) => {
          queryClient.setQueryData(
            ['useUserTwapFillHistory', address],
            (
              _prevUserTwapSliceFillsEvent: UserTwapSliceFillsEvent | undefined,
            ) => {
              return userTwapSliceFillsEvent
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
