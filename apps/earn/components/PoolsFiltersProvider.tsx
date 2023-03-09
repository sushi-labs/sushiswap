import { ChainId } from '@sushiswap/chain'
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { AVAILABLE_POOL_TYPE_MAP, AVAILABLE_VERSION_MAP } from '../lib/constants'

enum Filters {
  tokenSymbols = 'tokenSymbols',
  chainIds = 'chainIds',
  poolTypes = 'poolTypes',
  poolVersions = 'poolVersions',
  incentivizedOnly = 'incentivizedOnly',
}

interface FilterContext {
  [Filters.tokenSymbols]: undefined | string[]
  [Filters.chainIds]: ChainId[]
  [Filters.poolTypes]: (keyof typeof AVAILABLE_POOL_TYPE_MAP)[]
  [Filters.poolVersions]: (keyof typeof AVAILABLE_VERSION_MAP)[]
  [Filters.incentivizedOnly]: boolean
  setFilters(filters: Partial<Omit<FilterContext, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type PoolFilters = Omit<FilterContext, 'setFilters'>

interface PoolsFiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<PoolFilters>
}

// ! Has to be kept up to date with defaultPoolsArgs
// Else prefetching won't work
const defaultFilters: PoolFilters = {
  [Filters.tokenSymbols]: undefined,
  [Filters.chainIds]: SUPPORTED_CHAIN_IDS,
  [Filters.poolTypes]: Object.keys(AVAILABLE_POOL_TYPE_MAP) as (keyof typeof AVAILABLE_POOL_TYPE_MAP)[],
  [Filters.poolVersions]: Object.keys(AVAILABLE_VERSION_MAP) as (keyof typeof AVAILABLE_VERSION_MAP)[],
  [Filters.incentivizedOnly]: false,
}

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children, passedFilters }) => {
  const [filters, _setFilters] = useState<PoolFilters>({ ...defaultFilters, ...passedFilters })

  const setFilters = useCallback((filters: PoolFilters) => {
    _setFilters((prevState) => ({
      ...prevState,
      ...filters,
    }))
  }, [])

  useEffect(() => setFilters({ ...defaultFilters, ...passedFilters }), [passedFilters, setFilters])

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const usePoolFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context
}
