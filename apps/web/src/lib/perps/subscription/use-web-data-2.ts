'use client'
import { webData2 } from '@nktkas/hyperliquid/api/info'
import {
  type WebData2Event,
  webData2 as subscribeWebData2,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlHttpTransport, hlWebSocketTransport } from '../transports'
import { type TokenBalance, isTokenBalance } from '../utils'

type WebData2EventWithTokenBalances = Omit<WebData2Event, 'spotState'> & {
  spotState?: Omit<NonNullable<WebData2Event['spotState']>, 'balances'> & {
    balances: TokenBalance[]
  }
}

function filterTokenBalances(
  event: WebData2Event,
): WebData2EventWithTokenBalances {
  const { spotState, ...rest } = event

  return {
    ...rest,
    ...(spotState
      ? {
          spotState: {
            ...spotState,
            balances: spotState.balances.filter(isTokenBalance),
          },
        }
      : {}),
  }
}

export const useWebData2 = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<WebData2EventWithTokenBalances>({
    queryKey: ['useWebData2', address],
    queryFn: async () => {
      if (!address) throw new Error('Address is required')

      const event = await webData2(
        { transport: hlHttpTransport },
        { user: address },
      )

      return filterTokenBalances(event)
    },
    staleTime: Number.POSITIVE_INFINITY,
    enabled: Boolean(address),
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await subscribeWebData2(
        { transport: hlWebSocketTransport },
        { user: address },
        (webData2Event) => {
          queryClient.setQueryData<WebData2EventWithTokenBalances>(
            ['useWebData2', address],
            (_prevWebData2Event) => filterTokenBalances(webData2Event),
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
