import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react'

import { SUPPORTED_CHAIN_IDS } from '../config'
import { z } from 'zod'
import { parseArgs, Protocol } from '@sushiswap/client'
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

export const poolFiltersSchema = z.object({
  tokenSymbols: z
    .string()
    .optional()
    .default('')
    .transform((tokenSymbols) => {
      if (tokenSymbols === '') return undefined
      return tokenSymbols.split(',')
    }),
  chainIds: z
    .string()
    .optional()
    .default(SUPPORTED_CHAIN_IDS.join(','))
    .transform((chainIds) => chainIds.split(',').map((chainId) => Number(chainId))),
  protocols: z
    .string()
    .optional()
    .transform((protocols) => protocols?.split(',') as Protocol[]),
  farmsOnly: z
    .string()
    .optional()
    .default('false')
    .transform((bool) => bool === 'true'),
})

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children }) => {
  const { query, push } = useRouter()

  const parsed = useMemo(() => {
    const parsed = poolFiltersSchema.parse(query)
    return {
      ...parsed,
      protocols: parsed?.protocols?.filter((el) => (el as string) !== ''),
    }
  }, [query])

  const setFilters = useCallback(
    (filters: PoolFilters) => {
      const newFilters = { ...parsed, ...filters }
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
