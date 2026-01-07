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

const formatSpotCtxs = (
  meta: SpotMetaResponse,
  spotAssetCtxsEvent: SpotAssetCtxsEvent,
) => {
  const universe = meta?.universe ?? []
  const _tokens = meta?.tokens ?? []
  const ctxs = spotAssetCtxsEvent
  return universe
    .map((u) => {
      const ctx = ctxs[u.index] ?? {}
      const tokens = u.tokens.map((tokenIndex) => _tokens[tokenIndex])
      const markPrice = Number.parseFloat(ctx.markPx)
      const last = markPrice
      const prev = Number.parseFloat(ctx.prevDayPx)
      const changeAbs = last != null && prev != null ? last - prev : null
      const changePct =
        last != null && prev != null && prev !== 0 ? (last - prev) / prev : null

      const marketCap = markPrice * Number.parseFloat(ctx.circulatingSupply)
      return {
        symbol: tokens.map((t) => t.name).join('/'),
        marketType: 'spot' as const,
        dex: '',
        tokens,
        lastPrice: last.toString(),
        midPrice: ctx.midPx,
        markPrice: markPrice,
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
      }
    })
    .sort((a, b) => Number(b.volume24hUsd) - Number(a.volume24hUsd))
}

const formatPerpCtxs = (
  spotMeta: SpotMetaResponse,
  meta: AllPerpMetasResponse,
  allDexsAssetCtxsEvent: AllDexsAssetCtxsEvent,
) => {
  return allDexsAssetCtxsEvent.ctxs
    .flatMap(([dexName, ctxs]) => {
      let metaForDex = meta?.find(
        (d) =>
          //@dev: is there a better way for this to be done?
          d.universe?.[0].name?.split(':')?.[0]?.toLowerCase() ===
          dexName.toLowerCase(),
      )
      if (!dexName || dexName === '') {
        //empty string is hyperliquid main dex
        metaForDex = meta[0] //first index is main dex
      }
      const collateralTokenIndex = metaForDex?.collateralToken
      const collateralToken =
        spotMeta.tokens[collateralTokenIndex ?? -1] ?? null
      return metaForDex?.universe?.map((u, i) => {
        const ctx = ctxs[i] ?? {}
        const last = Number.parseFloat(ctx.markPx)
        const prev = Number.parseFloat(ctx.prevDayPx)
        const changeAbs = last != null && prev != null ? last - prev : null
        const changePct =
          last != null && prev != null && prev !== 0
            ? (last - prev) / prev
            : null

        const openInterestUsd =
          (Number.parseFloat(ctx.openInterest) ?? 0) * (last ?? 0)
        const name = u.name?.split(':')?.[1] ?? u.name
        return {
          symbol: `${name}${collateralToken?.name ? `-${collateralToken.name}` : ''}`,
          marketType: 'perp' as const,
          dex: dexName,
          tokens: collateralToken ? [collateralToken] : undefined,
          lastPrice: last.toString(),
          midPrice: ctx.midPx,
          markPrice: ctx.markPx,
          oraclePrice: ctx.oraclePx,
          change24hAbs: changeAbs?.toString(),
          change24hPct: changePct?.toString(),
          funding8hPct: (Number(ctx.funding) * 8).toString(),
          fundingPct: ctx.funding,
          volume24hUsd: ctx.dayNtlVlm ?? ctx.dayBaseVlm,
          openInterestUsd: openInterestUsd.toString(),
          maxLeverage: u.maxLeverage,
          marketCap: undefined,
          isDelisted: u.isDelisted ?? false,
          // raw: { u, ctx },
        }
      })
    })
    .filter((i) => !i?.isDelisted)
}

type PerpTokenData = ReturnType<typeof formatPerpCtxs>
type SpotTokenData = ReturnType<typeof formatSpotCtxs>
type AssetData = {
  perp: PerpTokenData
  spot: SpotTokenData
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
          }))
        },
      )

      unsubscribe = sub.unsubscribe
    })()

    return () => {
      void unsubscribe?.()
    }
  }, [querClient, spotMeta])

  const isReady = Boolean(query.data?.spot?.length && query.data?.perp?.length)

  return { ...query, isLoading: query.isLoading || !spotMeta || !isReady }
}
