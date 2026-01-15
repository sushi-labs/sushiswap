import { type L2BookEvent, l2Book } from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { hlWebSocketTransport } from './transports'
import { toFixedTrim } from './utils'

export type OrderbookRow = {
  price: string
  sizeBase: string
  sizeQuote: string // px * sz
  totalBase: string // cumulative base
  totalQuote: string // cumulative quote
  n: number
}

const formatOrders = (ev: L2BookEvent) => {
  const time = ev.time
  const coin = ev.coin

  const bidsLevels = ev.levels?.[0] ?? []
  const asksLevels = ev.levels?.[1] ?? []

  // feed ordering is already correct; do not sort by totals
  // bids: best -> worse, asks: best -> worse

  // Build bids with cumulative totals from best bid downward
  let runningBidBase = 0
  let runningBidQuote = 0
  const bids: OrderbookRow[] = bidsLevels.map((l) => {
    const px = Number(l.px)
    const sz = Number(l.sz)
    const quote = px * sz

    runningBidBase += sz
    runningBidQuote += quote

    return {
      price: l.px,
      sizeBase: l.sz,
      sizeQuote: toFixedTrim(quote, 0),
      totalBase: toFixedTrim(runningBidBase, 10),
      totalQuote: toFixedTrim(runningBidQuote, 0),
      n: l.n,
    }
  })

  // Build asks cumulative totals from best ask upward
  let runningAskBase = 0
  let runningAskQuote = 0
  const asksBestToWorse: OrderbookRow[] = asksLevels.map((l) => {
    const px = Number(l.px)
    const sz = Number(l.sz)
    const quote = px * sz

    runningAskBase += sz
    runningAskQuote += quote

    return {
      price: l.px,
      sizeBase: l.sz,
      sizeQuote: toFixedTrim(quote, 0),
      totalBase: toFixedTrim(runningAskBase, 10),
      totalQuote: toFixedTrim(runningAskQuote, 0),
      n: l.n,
    }
  })

  // UI: show asks with best nearest the spread row (bottom of asks section)
  const asks = asksBestToWorse.slice().reverse()

  const bestBid = bidsLevels[0]?.px ?? null
  const bestAsk = asksLevels[0]?.px ?? null

  let spreadAbs: string | null = null
  let spreadPct: string | null = null

  if (bestBid && bestAsk) {
    const bb = Number(bestBid)
    const ba = Number(bestAsk)
    const abs = ba - bb
    const mid = (ba + bb) / 2
    spreadAbs = toFixedTrim(abs, 10)
    spreadPct = mid !== 0 ? toFixedTrim(abs / mid, 5) : null
  }

  return { time, coin, bids, asks, bestBid, bestAsk, spreadAbs, spreadPct }
}

type FormattedL2Orders = ReturnType<typeof formatOrders>

const KEY = (assetString: string) =>
  ['l2-orderbook-book-events', assetString] as const

export const useL2OrderBook = ({ assetString }: { assetString: string }) => {
  const queryClient = useQueryClient()

  const query = useQuery<FormattedL2Orders>({
    queryKey: KEY(assetString),
    staleTime: Number.POSITIVE_INFINITY,
  })

  useEffect(() => {
    if (!assetString) return

    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await l2Book(
        { transport: hlWebSocketTransport },
        { coin: assetString },
        (ev) => {
          queryClient.setQueryData(
            KEY(assetString),
            (prev: FormattedL2Orders | undefined) => {
              // ignore out-of-order / stale events
              if (prev && prev.time >= ev.time) return prev
              return formatOrders(ev)
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

  // convenience: max totals for depth bars (optional but commonly needed)
  const depth = useMemo(() => {
    const bidsMax = query.data?.bids?.[0]
      ? Math.max(...query.data.bids.map((r) => Number(r.totalQuote)))
      : 0
    const asksMax = query.data?.asks?.[0]
      ? Math.max(...query.data.asks.map((r) => Number(r.totalQuote)))
      : 0
    return { bidsMaxTotalQuote: bidsMax, asksMaxTotalQuote: asksMax }
  }, [query.data])

  return {
    ...query,
    ...depth,
    isLoading: query.isLoading || !isReady,
  }
}
