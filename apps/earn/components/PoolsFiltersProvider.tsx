import { ChainId } from '@sushiswap/chain'
import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { AVAILABLE_POOL_TYPE_MAP } from '../lib/constants'

enum Filters {
  myTokensOnly = 'myTokensOnly',
  singleSidedStakingOnly = 'singleSidedStakingOnly',
  stablePairsOnly = 'stablePairsOnly',
  selectedNetworks = 'selectedNetworks',
  selectedPoolTypes = 'selectedPoolTypes',
  farmsOnly = 'farmsOnly',
}

interface FilterContext {
  query: string
  extraQuery: string
  [Filters.myTokensOnly]: boolean
  [Filters.singleSidedStakingOnly]: boolean
  [Filters.stablePairsOnly]: boolean
  [Filters.selectedNetworks]: ChainId[]
  [Filters.selectedPoolTypes]: string[]
  [Filters.farmsOnly]: boolean
  atLeastOneFilterSelected: boolean
  setFilters(filters: Partial<Omit<FilterContext, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContext | undefined>(undefined)

interface PoolsFiltersProvider {
  children?: ReactNode
  selectedNetworks: ChainId[]
}

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({
  children,
  selectedNetworks = SUPPORTED_CHAIN_IDS,
}) => {
  const [filters, _setFilters] = useState({
    query: '',
    extraQuery: '',
    [Filters.myTokensOnly]: false,
    [Filters.singleSidedStakingOnly]: false,
    [Filters.stablePairsOnly]: false,
    [Filters.selectedNetworks]: selectedNetworks,
    [Filters.selectedPoolTypes]: Object.keys(AVAILABLE_POOL_TYPE_MAP),
    [Filters.farmsOnly]: false,
    atLeastOneFilterSelected: false,
  })

  const setFilters = useCallback((filters: Partial<Omit<FilterContext, 'setFilters'>>) => {
    _setFilters((prevState) => ({
      ...prevState,
      ...filters,
    }))
  }, [])

  return (
    <FilterContext.Provider
      value={{
        ...filters,
        atLeastOneFilterSelected:
          filters.farmsOnly ||
          filters.query.length > 0 ||
          filters.selectedPoolTypes.length !== Object.keys(AVAILABLE_POOL_TYPE_MAP).length,
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
