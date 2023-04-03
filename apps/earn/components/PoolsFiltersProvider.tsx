import { ChainId } from '@sushiswap/chain'
import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { AVAILABLE_POOL_TYPE_MAP, AVAILABLE_VERSION_MAP } from '../lib/constants'
import { z } from 'zod'
import { parseArgs, PoolType, PoolVersion } from '@sushiswap/client'
import { useRouter } from 'next/router'
import stringify from 'fast-json-stable-stringify'

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

const schema = z.object({
  tokenSymbols: z
    .string()
    .optional()
    .transform((tokenSymbols) => {
      if (tokenSymbols === '') return undefined

      return tokenSymbols?.split(',')
    }),
  chainIds: z
    .string()
    .optional()
    .transform((chainIds) =>
      chainIds ? chainIds.split(',').map((chainId) => Number(chainId)) : defaultFilters.chainIds
    ),
  poolTypes: z
    .string()
    .optional()
    .transform((poolTypes) => poolTypes?.split(',') as PoolType[]),
  poolVersions: z
    .string()
    .optional()
    .transform((poolVersions) => poolVersions?.split(',') as PoolVersion[]),
  incentivizedOnly: z
    .string()
    .optional()
    .transform((e) => e === 'true'),
})

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children }) => {
  const { query, push } = useRouter()

  const parsed = useMemo(() => {
    if (!query) return defaultFilters

    return { ...defaultFilters, ...schema.parse(query) }
  }, [query])

  const setFilters = useCallback(
    (filters: PoolFilters) => {
      const newFilters = { ...parsed, ...filters }

      push(parseArgs(newFilters), undefined, { shallow: true })
    },
    // eslint-disable-next-line
    [stringify(parsed)]
  )

  return (
    <FilterContext.Provider
      value={{
        ...parsed,
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
