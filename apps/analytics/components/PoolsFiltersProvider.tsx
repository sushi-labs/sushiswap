import { ChainId } from '@sushiswap/chain'
import { createContext, FC, ReactNode, useCallback, useContext, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'

enum Filters {
  myTokensOnly = 'myTokensOnly',
  singleSidedStakingOnly = 'singleSidedStakingOnly',
  stablePairsOnly = 'stablePairsOnly',
  selectedNetworks = 'selectedNetworks',
}

export enum SelectedTable {
  Markets = 'Markets',
  Tokens = 'Tokens',
}

interface FilterContext {
  query: string
  extraQuery: string
  [Filters.myTokensOnly]: boolean
  [Filters.singleSidedStakingOnly]: boolean
  [Filters.stablePairsOnly]: boolean
  [Filters.selectedNetworks]: ChainId[]
  selectedTable: SelectedTable
  setFilters(filters: Partial<Omit<FilterContext, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContext | undefined>(undefined)

interface PoolsFiltersProvider {
  children?: ReactNode
}

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children }) => {
  const [filters, _setFilters] = useState({
    query: '',
    extraQuery: '',
    [Filters.myTokensOnly]: false,
    [Filters.singleSidedStakingOnly]: false,
    [Filters.stablePairsOnly]: false,
    [Filters.selectedNetworks]: SUPPORTED_CHAIN_IDS,
    selectedTable: SelectedTable.Markets,
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
