'use client'
import {
  type WebData2Event,
  webData2,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'
import { type TokenBalance, isTokenBalance } from '../utils'

type WebData2EventWithTokenBalances = Omit<WebData2Event, 'spotState'> & {
  spotState?: Omit<NonNullable<WebData2Event['spotState']>, 'balances'> & {
    balances: TokenBalance[]
  }
}

export const useWebData2 = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<WebData2EventWithTokenBalances>({
    queryKey: ['useWebData2', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await webData2(
        { transport: hlWebSocketTransport },
        { user: address },
        (webData2Event) => {
          queryClient.setQueryData<WebData2EventWithTokenBalances>(
            ['useWebData2', address],
            (_prevWebData2Event) => {
              const { spotState, ...event } = webData2Event

              return {
                ...event,
                ...(spotState
                  ? {
                      spotState: {
                        ...spotState,
                        balances: spotState.balances.filter(isTokenBalance),
                      },
                    }
                  : {}),
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
