'use client'

import { NetworkFilterSelector } from '../common/network-filter-selector'
import {
  DEFAULT_POOL_NETWORKS,
  usePoolFilters,
  useSetPoolFilters,
} from './PoolsFiltersProvider'

export const TableFiltersNetworkV2 = () => {
  const { networks } = usePoolFilters()
  const setFilters = useSetPoolFilters()

  return (
    <NetworkFilterSelector
      selectedNetworks={networks}
      setNetworks={(newNetworks) => {
        setFilters((prev) => ({ ...prev, networks: newNetworks }))
      }}
      defaultNetworks={DEFAULT_POOL_NETWORKS}
      className="!bg-slate-200 dark:!bg-slate-750"
    />
  )
}
