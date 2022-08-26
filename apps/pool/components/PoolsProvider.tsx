import { ChainId } from '@sushiswap/chain'
import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'

enum Filters {
  myTokensOnly = 'myTokensOnly',
  singleSidedStakingOnly = 'singleSidedStakingOnly',
  stablePairsOnly = 'stablePairsOnly',
  selectedNetworks = 'selectedNetworks',
}

interface FilterContext {
  query: string
  extraQuery: string
  [Filters.myTokensOnly]: boolean
  [Filters.singleSidedStakingOnly]: boolean
  [Filters.stablePairsOnly]: boolean
  [Filters.selectedNetworks]: ChainId[]
  setFilters(filters: Partial<Omit<FilterContext, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContext | undefined>(undefined)

interface PoolsProvider {
  children?: ReactNode
}

export const PoolsProvider: FC<PoolsProvider> = ({ children }) => {
  const [filters, _setFilters] = useState({
    query: '',
    extraQuery: '',
    [Filters.myTokensOnly]: false,
    [Filters.singleSidedStakingOnly]: false,
    [Filters.stablePairsOnly]: false,
    [Filters.selectedNetworks]: SUPPORTED_CHAIN_IDS,
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
