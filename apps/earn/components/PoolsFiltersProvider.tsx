import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { z } from 'zod'
import { parseArgs } from '@sushiswap/client'
import { useRouter } from 'next/router'
import stringify from 'fast-json-stable-stringify'

interface FilterContext extends z.TypeOf<typeof poolFiltersSchema> {
  setFilters(filters: Partial<Omit<FilterContext, 'setFilters'>>): void
}

const FilterContext = createContext<FilterContext | undefined>(undefined)

export type PoolFilters = Omit<FilterContext, 'setFilters'>

interface PoolsFiltersProvider {
  children?: ReactNode
  passedFilters?: Partial<PoolFilters>
}

export enum FilterTag {
  SUSHISWAP_V3 = 'SUSHISWAP_V3',
  SUSHISWAP_V2 = 'SUSHISWAP_V2',
  BENTOBOX_STABLE = 'BENTOBOX_STABLE',
  BENTOBOX_CLASSIC = 'BENTOBOX_CLASSIC',
  FARMS_ONLY = 'FARMS_ONLY',
}

export const poolFiltersSchema = z.object({
  tokenSymbols: z
    .string()
    .optional()
    .default('')
    .transform((tokenSymbols) => {
      if (tokenSymbols === '') return undefined

      return tokenSymbols?.split(',')
    }),
  chainIds: z
    .string()
    .optional()
    .default(SUPPORTED_CHAIN_IDS.join(','))
    .transform((chainIds) => chainIds.split(',').map((chainId) => Number(chainId))),
  categories: z
    .string()
    .optional()
    .default(
      Object.values(FilterTag)
        .filter((tag) => tag != FilterTag.FARMS_ONLY)
        .join(',')
    )
    .transform((tags) => tags.split(',') as FilterTag[]),
})

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children }) => {
  const { query, push } = useRouter()
  const parsed = useMemo(() => {
    const parsed = poolFiltersSchema.parse(query)

    return {
      ...parsed,
      categories: parsed.categories.filter((el) => (el as string) !== ''),
    }
  }, [query])

  const setFilters = useCallback(
    (filters: PoolFilters) => {
      const newFilters = { ...parsed, ...filters }
      // console.log(newFilters)
      void push(parseArgs(newFilters), undefined, { shallow: true })
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
