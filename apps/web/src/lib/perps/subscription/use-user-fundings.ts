'use client'
import {
  type UserFundingsEvent,
  userFundings,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { EvmAddress } from 'sushi/evm'
import { hlWebSocketTransport } from '../transports'

export const useUserFundings = ({ address }: { address?: EvmAddress }) => {
  const queryClient = useQueryClient()
  const query = useQuery<UserFundingsEvent>({
    queryKey: ['useUserFundings', address],
    staleTime: Number.POSITIVE_INFINITY,
    enabled: false,
  })

  useEffect(() => {
    if (!address) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await userFundings(
        { transport: hlWebSocketTransport },
        { user: address },
        (userFundingsEvent) => {
          queryClient.setQueryData(
            ['useUserFundings', address],
            (prevUserFundingsEvent: UserFundingsEvent | undefined) => {
              const fundings = userFundingsEvent.fundings
              const prevFundings = prevUserFundingsEvent?.fundings ?? []
              const combinedFundings = Array.from(
                new Map(
                  [...fundings, ...prevFundings].map((funding) => [
                    funding.time,
                    funding,
                  ]),
                ).values(),
              )
              return {
                user: userFundingsEvent.user,
                fundings: combinedFundings,
                isSnapshot: userFundingsEvent.isSnapshot,
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
