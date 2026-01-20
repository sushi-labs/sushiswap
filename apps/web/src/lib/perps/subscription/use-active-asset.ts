import {
  type ActiveAssetCtxEvent,
  type ActiveSpotAssetCtxEvent,
  activeAssetCtx,
  activeSpotAssetCtx,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { hlWebSocketTransport } from '../transports'

const formatPerpCtxs = (activeAssetCtxEvent: ActiveAssetCtxEvent) => {
  const ctx = activeAssetCtxEvent.ctx
  const markPrice = Number.parseFloat(ctx.markPx)
  const last = markPrice
  const prev = Number.parseFloat(ctx.prevDayPx)
  const changeAbs = last != null && prev != null ? last - prev : null
  const changePct =
    last != null && prev != null && prev !== 0 ? (last - prev) / prev : null
  const openInterestUsd =
    (Number.parseFloat(ctx.openInterest) || 0) *
    (Number.isFinite(last) ? last : 0)
  return {
    symbol: activeAssetCtxEvent.coin,
    name: activeAssetCtxEvent.coin,
    marketType: 'perp' as const,
    lastPrice: last.toString(),
    midPrice: ctx.midPx,
    markPrice: markPrice?.toString(),
    oraclePrice: ctx.oraclePx,
    change24hAbs: changeAbs?.toString(),
    change24hPct: changePct?.toString(),
    fundingPct: ctx.funding,
    funding8hPct: String(Number(ctx.funding) * 8),
    openInterestUsd: String(openInterestUsd),
    volume24hUsd: ctx.dayNtlVlm ?? ctx.dayBaseVlm,
    marketCap: undefined,
  }
}

const formatSpotCtxs = (activeSpotAssetCtxEvent: ActiveSpotAssetCtxEvent) => {
  const ctx = activeSpotAssetCtxEvent.ctx
  const markPrice = Number.parseFloat(ctx.markPx)
  const last = markPrice
  const prev = Number.parseFloat(ctx.prevDayPx)
  const changeAbs = last != null && prev != null ? last - prev : null
  const changePct =
    last != null && prev != null && prev !== 0 ? (last - prev) / prev : null
  const marketCap = markPrice * Number.parseFloat(ctx.circulatingSupply)

  return {
    symbol: activeSpotAssetCtxEvent.coin,
    name: activeSpotAssetCtxEvent.coin,
    marketType: 'spot' as const,
    lastPrice: last.toString(),
    midPrice: ctx.midPx,
    markPrice: markPrice?.toString(),
    oraclePrice: '',
    change24hAbs: changeAbs?.toString(),
    change24hPct: changePct?.toString(),
    marketCap: marketCap.toString(),
    volume24hUsd: ctx.dayNtlVlm ?? ctx.dayBaseVlm,
    openInterestUsd: undefined,
    funding8hPct: undefined,
    fundingPct: undefined,
  }
}

type ActivePerp = ReturnType<typeof formatPerpCtxs>
type ActiveSpot = ReturnType<typeof formatSpotCtxs>
export type ActiveAsset = ActivePerp | ActiveSpot

export const useActiveAsset = ({ assetString }: { assetString: string }) => {
  const queryClient = useQueryClient()
  const query = useQuery<ActiveAsset>({
    queryKey: ['active-asset', assetString],
    staleTime: Number.POSITIVE_INFINITY,
  })

  useEffect(() => {
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    if (assetString.includes('@')) {
      //ex: @1, @2
      //spot
      ;(async () => {
        const sub = await activeSpotAssetCtx(
          { transport: hlWebSocketTransport },
          { coin: assetString },
          (activeSpotAssetCtxEvent) => {
            queryClient.setQueryData(
              ['active-asset', assetString],
              (_prev: ActiveAsset | undefined) => ({
                ...formatSpotCtxs(activeSpotAssetCtxEvent),
              }),
            )
          },
        )
        unsubscribe = sub.unsubscribe
      })()
    } else {
      //ex: BTC xyz:GOLD
      //perp
      ;(async () => {
        const sub = await activeAssetCtx(
          { transport: hlWebSocketTransport },
          { coin: assetString },
          (activeAssetCtxEvent) => {
            queryClient.setQueryData(
              ['active-asset', assetString],
              (_prev: ActiveAsset | undefined) => ({
                ...formatPerpCtxs(activeAssetCtxEvent),
              }),
            )
          },
        )
        unsubscribe = sub.unsubscribe
      })()
    }
    return () => {
      void unsubscribe?.()
    }
  }, [queryClient, assetString])

  const isReady = Boolean(query.data)

  return { ...query, isLoading: query.isLoading || !isReady }
}
