'use client'
import {
  type SpotStateEvent,
  spotState,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'
import { type TokenBalance, isTokenBalance } from '../utils'

type SpotStateEventWithTokenBalances = Omit<SpotStateEvent, 'spotState'> & {
  spotState?: Omit<NonNullable<SpotStateEvent['spotState']>, 'balances'> & {
    balances: TokenBalance[]
  }
}

export const useSpotState = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<SpotStateEventWithTokenBalances>({
    queryKey: ['useSpotState', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await spotState(
        { transport: hlWebSocketTransport },
        { user: address },
        (spotStateEvent) => {
          queryClient.setQueryData(
            ['useSpotState', address],
            (_prevSpotStateEvent: SpotStateEvent | undefined) => {
              return {
                user: spotStateEvent.user,
                spotState: {
                  ...spotStateEvent.spotState,
                  balances:
                    spotStateEvent?.spotState?.balances?.filter(isTokenBalance),
                },
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
