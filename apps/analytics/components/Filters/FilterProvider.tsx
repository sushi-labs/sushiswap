import { ChainId } from '@sushiswap/chain'
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

import { SUPPORTED_CHAIN_IDS } from '../../config'
import { Protocol } from '@sushiswap/client'

enum Filters {
  search = 'search',
  chainIds = 'chainIds',
  isWhitelisted = 'isWhitelisted',
  poolProtocols = 'poolProtocols',
}

interface FilterContext {
  [Filters.search]?: string[]
  [Filters.chainIds]: ChainId[]
  [Filters.isWhitelisted]: boolean
  [Filters.poolProtocols]?: Protocol[]
  setFilters(filters: Partial<Omit<FilterContext, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContext | undefined>(undefined)

type FiltersT = Omit<FilterContext, 'setFilters'>

interface FiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<FiltersT>
}

const defaultFilters: FiltersT = {
  [Filters.chainIds]: SUPPORTED_CHAIN_IDS,
  [Filters.isWhitelisted]: true,
}

export const FilterProvider: FC<FiltersProvider> = ({
  children,
  passedFilters,
}) => {
  const [filters, _setFilters] = useState({
    ...defaultFilters,
    ...passedFilters,
  })

  const setFilters = useCallback((newFilters: FiltersT) => {
    _setFilters((prevState) => ({
      ...prevState,
      ...newFilters,
    }))
  }, [])

  useEffect(
    () => setFilters({ ...defaultFilters, ...passedFilters }),
    [passedFilters, setFilters],
  )

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

export const useFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context
}
