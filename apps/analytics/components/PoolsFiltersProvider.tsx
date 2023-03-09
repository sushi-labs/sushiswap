import { ChainId } from '@sushiswap/chain'
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'

enum Filters {
  tokenSymbols = 'tokenSymbols',
  chainIds = 'chainIds',
  poolTypes = 'poolTypes',
  poolVersions = 'poolVersions',
  incentivizedOnly = 'incentivizedOnly',
}

export enum SelectedTable {
  Markets = 'Markets',
  Tokens = 'Tokens',
}

interface FilterContext {
  [Filters.tokenSymbols]: undefined | string[]
  [Filters.chainIds]: ChainId[]
  selectedTable: SelectedTable
  setFilters(filters: Partial<Omit<FilterContext, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type PoolFilters = Omit<FilterContext, 'setFilters'>

interface PoolsFiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<PoolFilters>
}

const defaultFilters: PoolFilters = {
  [Filters.tokenSymbols]: undefined,
  [Filters.chainIds]: SUPPORTED_CHAIN_IDS,
  selectedTable: SelectedTable.Markets,
}

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children, passedFilters }) => {
  const [filters, _setFilters] = useState({ ...defaultFilters, ...passedFilters })

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
