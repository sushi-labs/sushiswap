'use client'

import { PoolChainIds } from '@sushiswap/graph-client/data-api'
import type {
  PoolChainId,
  PortfolioV2ChartRange,
} from '@sushiswap/graph-client/data-api'
import { useRouter } from 'next/navigation'
import {
  type FC,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from 'src/lib/hooks'
import { AssetsChartPeriod } from 'src/ui/portfolio/assets-chart/assets-chart-header'
import {
  type EvmChainId,
  type EvmCurrency,
  EvmNative,
  EvmToken,
  isEvmChainId,
} from 'sushi/evm'
import { z } from 'zod'

export const DEFAULT_ASSET_NETWORKS = PoolChainIds.filter(
  (n) => typeof n === 'number' && isEvmChainId(n),
)

export const DEFAULT_ASSETS_FILTER_STATE = {
  chartRange: AssetsChartPeriod.ThirtyDay,
  chartNetworks: DEFAULT_ASSET_NETWORKS,
  asset: undefined as EvmCurrency | undefined,
}

export const assetsFiltersSchema = z.object({
  chartRange: z
    .string()
    .transform((val) =>
      val ? (val as PortfolioV2ChartRange) : AssetsChartPeriod.ThirtyDay,
    ),
  chartNetworks: z.string().transform((networks) => {
    if (!networks) return DEFAULT_ASSET_NETWORKS
    return networks.split(',').map((id) => +id as PoolChainId)
  }),
  asset: z.string().optional(),
})

export type AssetsFilters = Omit<
  z.infer<typeof assetsFiltersSchema>,
  'asset'
> & {
  asset: EvmCurrency | undefined
}

type SetFilters = {
  (next: SetStateAction<AssetsFilters>): void
  (reset?: undefined): void
}

type ChartFiltersContextType = {
  state: AssetsFilters
  mutate: {
    setFilters: SetFilters
  }
}

const ChartFiltersContext = createContext<ChartFiltersContextType | undefined>(
  undefined,
)

export const useChartFilters = () => {
  const ctx = useContext(ChartFiltersContext)
  if (!ctx) throw new Error('Hook must be used inside ChartFiltersProvider')
  return ctx.state
}

export const useSetChartFilters = () => {
  const ctx = useContext(ChartFiltersContext)
  if (!ctx) throw new Error('Hook must be used inside ChartFiltersProvider')
  return ctx.mutate.setFilters
}

const ChartFiltersUrlProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const { replace } = useRouter()
  const urlFilters = useTypedSearchParams(assetsFiltersSchema.partial())

  // 🔹 Parse URL → state
  const state = useMemo<AssetsFilters>(() => {
    const { chartRange, chartNetworks, asset } = urlFilters

    let parsedAsset: EvmCurrency | undefined
    if (asset) {
      const [chainIdStr, id] = asset.split(':')
      const chainId = Number(chainIdStr) as EvmChainId
      parsedAsset =
        id.toLowerCase() === 'native'
          ? EvmNative.fromChainId(chainId)
          : new EvmToken({
              chainId,
              address: id as `0x${string}`,
              decimals: 18, // temporary placeholder
              symbol: 'UNKNOWN',
              name: 'Loading...',
            })
    }

    return {
      chartRange: chartRange ?? DEFAULT_ASSETS_FILTER_STATE.chartRange,
      chartNetworks: chartNetworks ?? DEFAULT_ASSETS_FILTER_STATE.chartNetworks,
      asset: parsedAsset,
    }
  }, [urlFilters])

  // 🔹 State → URL
  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      const next = filters as AssetsFilters
      typeof filters === 'function' ? filters(state) : filters
      const serialized = {
        ...next,
        asset: next?.asset?.id,
      }
      void replace(parseArgs(serialized), { scroll: false })
    }
    return { setFilters }
  }, [replace, state])

  return (
    <ChartFiltersContext.Provider
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </ChartFiltersContext.Provider>
  )
}

const ChartFiltersLocalStateProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AssetsFilters>(DEFAULT_ASSETS_FILTER_STATE)

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        setState(filters(state))
      } else {
        setState(filters ?? DEFAULT_ASSETS_FILTER_STATE)
      }
    }
    return { setFilters }
  }, [state])

  return (
    <ChartFiltersContext.Provider
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </ChartFiltersContext.Provider>
  )
}

export const ChartFiltersProvider: FC<{
  children?: ReactNode
  url?: boolean
}> = ({ url = true, children }) => {
  return url ? (
    <ChartFiltersUrlProvider>{children}</ChartFiltersUrlProvider>
  ) : (
    <ChartFiltersLocalStateProvider>{children}</ChartFiltersLocalStateProvider>
  )
}
