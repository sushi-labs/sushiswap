'use client'

import { PoolChainIds } from '@sushiswap/graph-client/data-api'
import type {
  PoolChainId,
  PortfolioV2ChartRange,
} from '@sushiswap/graph-client/data-api'
import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { EvmCurrency } from 'sushi/evm'
import { AssetsChartPeriod } from '~evm/[chainId]/portfolio/_ui/assets-chart/assets-chart-header'

export const DEFAULT_ASSET_NETWORKS = PoolChainIds.map((i) => i)

export const DEFAULT_ASSETS_FILTER_STATE = {
  chartRange: AssetsChartPeriod.ThirtyDay,
  chartNetworks: DEFAULT_ASSET_NETWORKS,
  asset: undefined as EvmCurrency | undefined,
}

interface State {
  state: {
    chartRange: PortfolioV2ChartRange
    chartNetworks: PoolChainId[]
    asset: EvmCurrency | undefined
  }
  mutate: {
    setChartRange: (range: PortfolioV2ChartRange) => void
    setChartNetworks: (chartNetworks: PoolChainId[]) => void
    setAsset: (token: EvmCurrency | undefined) => void
  }
}

const ChartFiltersContext = createContext<State>({} as State)

export const useChartFilters = () => {
  const ctx = useContext(ChartFiltersContext)
  if (!ctx) throw new Error('Hook must be used inside ChartFiltersProvider')
  return ctx.state
}

export const useSetChartFilters = () => {
  const ctx = useContext(ChartFiltersContext)
  if (!ctx) throw new Error('Hook must be used inside ChartFiltersProvider')
  return ctx.mutate
}

export const ChartFilterProvider: FC<{ children?: ReactNode }> = ({
  children,
}) => {
  const [asset, setAsset] = useState<EvmCurrency | undefined>(undefined)
  const [chartRange, setChartRange] = useState<PortfolioV2ChartRange>(
    DEFAULT_ASSETS_FILTER_STATE.chartRange,
  )
  const [chartNetworks, setChartNetworks] = useState<PoolChainId[]>(
    DEFAULT_ASSETS_FILTER_STATE.chartNetworks,
  )

  return (
    <ChartFiltersContext.Provider
      value={useMemo(
        () => ({
          state: {
            chartRange,
            chartNetworks,
            asset,
          },
          mutate: {
            setChartNetworks,
            setChartRange,
            setAsset,
          },
        }),
        [chartRange, chartNetworks, asset],
      )}
    >
      {children}
    </ChartFiltersContext.Provider>
  )
}
