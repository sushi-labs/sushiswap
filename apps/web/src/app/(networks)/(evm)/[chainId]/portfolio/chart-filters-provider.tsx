'use client'

import { PoolChainIds } from '@sushiswap/graph-client/data-api'
import type {
  PoolChainId,
  PortfolioV2ChartRange,
} from '@sushiswap/graph-client/data-api-portfolio'
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
import { isEvmChainId } from 'sushi/evm'
import { z } from 'zod'

export const DEFAULT_ASSET_NETWORKS = PoolChainIds.filter(
  (n) => typeof n === 'number' && isEvmChainId(n),
)

export const DEFAULT_ASSETS_FILTER_STATE = {
  chartRange: AssetsChartPeriod.ThirtyDay,
  chartNetworks: DEFAULT_ASSET_NETWORKS,
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
})

export type AssetsFilters = z.infer<typeof assetsFiltersSchema>

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

  const state = useMemo(() => {
    const { chartRange, chartNetworks } = urlFilters
    return {
      chartRange: chartRange ?? DEFAULT_ASSETS_FILTER_STATE.chartRange,
      chartNetworks: chartNetworks ?? DEFAULT_ASSETS_FILTER_STATE.chartNetworks,
    }
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        void replace(parseArgs(filters(state)), { scroll: false })
      } else {
        void replace(parseArgs(filters ?? {}), { scroll: false })
      }
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
