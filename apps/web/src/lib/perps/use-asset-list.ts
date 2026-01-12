import type {
  AllPerpMetasResponse,
  SpotMetaResponse,
} from '@nktkas/hyperliquid'
import { allPerpMetas } from '@nktkas/hyperliquid/api/info'
import {
  type AllDexsAssetCtxsEvent,
  type SpotAssetCtxsEvent,
  allDexsAssetCtxs,
  spotAssetCtxs,
} from '@nktkas/hyperliquid/api/subscription'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { hlHttpTransport, hlWebSocketTransport } from './transports'
import { useSpotMeta } from './use-spot-meta'

type CollateralToken = SpotMetaResponse['tokens'][number]

export type PerpOrSpotAsset = {
  symbol: string
  marketType: 'perp' | 'spot'
  dex: string
  tokens?: CollateralToken[]
  lastPrice: string
  midPrice?: string | null
  markPrice?: string | null
  oraclePrice?: string | null
  change24hAbs?: string
  change24hPct?: string
  funding8hPct: string
  fundingPct?: string | null
  volume24hUsd?: string | null
  openInterestUsd: string
  maxLeverage: number | undefined
  marketCap?: string
  isDelisted: boolean
}

const formatSpotCtxs = (
  meta: SpotMetaResponse,
  spotAssetCtxsEvent: SpotAssetCtxsEvent,
) => {
  const universe = meta?.universe ?? []
  const _tokens = meta?.tokens ?? []
  const ctxs = spotAssetCtxsEvent
  return universe.reduce((acc, u) => {
    const ctx = ctxs[u.index] ?? {}
    const tokens = u.tokens.map((tokenIndex) => _tokens[tokenIndex])
    const markPrice = Number.parseFloat(ctx.markPx)
    const last = markPrice
    const prev = Number.parseFloat(ctx.prevDayPx)
    const changeAbs = last != null && prev != null ? last - prev : null
    const changePct =
      last != null && prev != null && prev !== 0 ? (last - prev) / prev : null

    const marketCap = markPrice * Number.parseFloat(ctx.circulatingSupply)
    const symbol = tokens.map((t) => t.name).join('/')
    acc.set(symbol, {
      symbol,
      marketType: 'spot' as const,
      dex: '',
      tokens,
      lastPrice: last.toString(),
      midPrice: ctx.midPx,
      markPrice: markPrice?.toString(),
      oraclePrice: '',
      change24hAbs: changeAbs?.toString(),
      change24hPct: changePct?.toString(),
      funding8hPct: '',
      fundingPct: '',
      volume24hUsd: ctx.dayNtlVlm ?? ctx.dayBaseVlm,
      openInterestUsd: '',
      marketCap: Number.isNaN(marketCap) ? '' : marketCap.toString(),
      maxLeverage: undefined,
      isDelisted: false,
      // raw: { u, ctx },
    })
    return acc
  }, new Map<string, PerpOrSpotAsset>())
}

export const formatPerpCtxs = (
  spotMeta: SpotMetaResponse,
  meta: AllPerpMetasResponse,
  allDexsAssetCtxsEvent: AllDexsAssetCtxsEvent,
) => {
  return allDexsAssetCtxsEvent.ctxs.reduce((acc, [dexNameRaw, ctxs]) => {
    const dexName = dexNameRaw ?? ''

    const metaForDex =
      dexName === ''
        ? meta[0]
        : meta.find(
            (d) =>
              d.universe?.[0].name?.split(':')?.[0]?.toLowerCase() ===
              dexName.toLowerCase(),
          )

    if (!metaForDex) return acc

    const collateralTokenIndex = metaForDex.collateralToken
    const collateralToken = spotMeta.tokens[collateralTokenIndex ?? -1] ?? null

    for (let i = 0; i < (metaForDex.universe?.length ?? 0); i++) {
      const u = metaForDex.universe![i]
      const ctx = ctxs[i] ?? {}

      if (u.isDelisted) continue

      const last = Number.parseFloat(ctx.markPx)
      const prev = Number.parseFloat(ctx.prevDayPx)
      const changeAbs =
        Number.isFinite(last) && Number.isFinite(prev) ? last - prev : null
      const changePct =
        Number.isFinite(last) && Number.isFinite(prev) && prev !== 0
          ? (last - prev) / prev
          : null

      const openInterestUsd =
        (Number.parseFloat(ctx.openInterest) || 0) *
        (Number.isFinite(last) ? last : 0)

      const name = u.name?.split(':')?.[1] ?? u.name
      const symbol = `${name}${collateralToken?.name ? `-${collateralToken.name}` : ''}`

      acc.set(symbol, {
        symbol,
        marketType: 'perp' as const,
        dex: dexName,
        tokens: collateralToken ? [collateralToken] : undefined,
        lastPrice: String(last),
        midPrice: ctx.midPx,
        markPrice: ctx.markPx,
        oraclePrice: ctx.oraclePx,
        change24hAbs: changeAbs == null ? undefined : String(changeAbs),
        change24hPct: changePct == null ? undefined : String(changePct),
        funding8hPct: String(Number(ctx.funding) * 8),
        fundingPct: ctx.funding,
        volume24hUsd: ctx.dayNtlVlm ?? ctx.dayBaseVlm,
        openInterestUsd: String(openInterestUsd),
        maxLeverage: u.maxLeverage,
        marketCap: undefined,
        isDelisted: u.isDelisted ?? false,
      })
    }

    return acc
  }, new Map<string, PerpOrSpotAsset>())
}

type PerpTokenData = ReturnType<typeof formatPerpCtxs>
type SpotTokenData = ReturnType<typeof formatSpotCtxs>
type AssetData = {
  perp: PerpTokenData
  spot: SpotTokenData
  // all: PerpOrSpotAsset[]
}

const KEY = ['useAssetList-perps-spot'] as const

export const useAssetList = () => {
  const querClient = useQueryClient()
  const query = useQuery<AssetData>({
    queryKey: KEY,
    staleTime: Number.POSITIVE_INFINITY,
  })
  const { data: spotMeta } = useSpotMeta()

  useEffect(() => {
    if (!spotMeta) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const sub = await spotAssetCtxs(
        { transport: hlWebSocketTransport },
        (spotCtxsEvent) => {
          const _formattedData = formatSpotCtxs(spotMeta, spotCtxsEvent)
          querClient.setQueryData(KEY, (prev: AssetData | undefined) => ({
            ...prev,
            spot: _formattedData,
            // all: [...(prev?.all ?? []), ..._formattedData.values()],
          }))
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [querClient, spotMeta])

  useEffect(() => {
    if (!spotMeta) return
    let unsubscribe: undefined | (() => Promise<void>) = undefined
    ;(async () => {
      const perpsMeta = await allPerpMetas({
        transport: hlHttpTransport,
      })

      const sub = await allDexsAssetCtxs(
        { transport: hlWebSocketTransport },
        (allDexsAssetCtxsEvent) => {
          const _formattedData = formatPerpCtxs(
            spotMeta,
            perpsMeta,
            allDexsAssetCtxsEvent,
          )
          querClient.setQueryData(KEY, (prev: AssetData | undefined) => ({
            ...prev,
            perp: _formattedData,
            // all: [...(prev?.all ?? []), ..._formattedData.values()],
          }))
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [querClient, spotMeta])

  const isReady = Boolean(query.data?.spot?.size && query.data?.perp?.size)

  return { ...query, isLoading: query.isLoading || !spotMeta || !isReady }
}
