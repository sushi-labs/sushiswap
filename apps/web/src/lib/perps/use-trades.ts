import { type TradesEvent, trades } from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { hlWebSocketTransport } from './transports'

export const useTrades = ({ assetString }: { assetString: string }) => {
  const queryClient = useQueryClient()
  const query = useQuery<TradesEvent>({
    queryKey: ['trade-events', assetString],
    staleTime: Number.POSITIVE_INFINITY,
  })

  useEffect(() => {
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await trades(
        { transport: hlWebSocketTransport },
        { coin: assetString },
        (tradesEvent) => {
          queryClient.setQueryData(
            ['trade-events', assetString],
            (prevTrades: TradesEvent | undefined) => {
              const next: TradesEvent = []
              const seen = new Set<number | string>()

              // Newest trades first
              const pushUnique = (t: TradesEvent[number]) => {
                const id = t.tid
                if (seen.has(id)) return
                seen.add(id)
                next.push(t)
              }

              for (const t of tradesEvent ?? []) {
                pushUnique(t)
                if (next.length === 50) return next
              }

              for (const t of prevTrades ?? []) {
                pushUnique(t)
                if (next.length === 50) return next
              }

              return next
            },
          )
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [queryClient, assetString])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
