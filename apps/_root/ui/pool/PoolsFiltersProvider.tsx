import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react'

import { SUPPORTED_CHAIN_IDS } from 'config'
import { z } from 'zod'
import { parseArgs, Protocol } from '@sushiswap/client'
import { useSearchParams, useRouter } from 'next/navigation'
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
  tokenSymbols: z.nullable(z.string()).transform((tokenSymbols) => {
    return tokenSymbols ? tokenSymbols.split(',') : []
  }),
  chainIds: z
    .nullable(z.string())
    .transform((chainIds) => (chainIds ? chainIds.split(',').map((chainId) => Number(chainId)) : SUPPORTED_CHAIN_IDS)),
  protocols: z
    .nullable(z.string())
    .transform((protocols) => (protocols ? (protocols.split(',') as Protocol[]) : undefined)),
  farmsOnly: z.nullable(z.string()).transform((bool) => (bool ? bool === 'true' : false)),
})

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children }) => {
  const { push } = useRouter()

  const searchParams = useSearchParams()

  const tokenSymbols = searchParams?.get('tokenSymbols')
  const chainIds = searchParams?.get('chainIds')
  const protocols = searchParams?.get('protocols')
  const farmsOnly = searchParams?.get('farmsOnly')

  const parsed = useMemo(() => {
    const parsed = poolFiltersSchema.parse({ tokenSymbols, chainIds, protocols, farmsOnly })
    return {
      ...parsed,
      protocols: parsed?.protocols?.filter((el) => (el as string) !== ''),
    }
  }, [tokenSymbols, chainIds, protocols, farmsOnly])

  const setFilters = useCallback(
    (filters: PoolFilters) => {
      const newFilters = { ...parsed, ...filters }
      void push(parseArgs(newFilters))
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
