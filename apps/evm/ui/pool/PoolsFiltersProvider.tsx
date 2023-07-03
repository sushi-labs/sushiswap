import { parseArgs, Protocol } from '@sushiswap/client'
import { SUPPORTED_CHAIN_IDS } from 'config'
import { useRouter, useSearchParams } from 'next/navigation'
import { createContext, FC, ReactNode, useCallback, useContext, useMemo } from 'react'
import { z } from 'zod'

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
    return tokenSymbols !== null && tokenSymbols !== ',' ? tokenSymbols.split(',') : undefined
  }),
  chainIds: z
    .nullable(z.string())
    .transform((chainIds) =>
      chainIds !== null && chainIds !== ','
        ? chainIds.split(',').map((chainId) => Number(chainId))
        : SUPPORTED_CHAIN_IDS
    ),
  protocols: z
    .nullable(z.string())
    .transform((protocols) => (protocols !== null && protocols !== ',' ? (protocols.split(',') as Protocol[]) : [])),
  farmsOnly: z.nullable(z.string()).transform((bool) => (bool ? bool === 'true' : undefined)),
})

export const PoolsFiltersProvider: FC<PoolsFiltersProvider> = ({ children }) => {
  const { push } = useRouter()

  const searchParams = useSearchParams()

  const tokenSymbols = searchParams?.get('tokenSymbols')
  const chainIds = searchParams?.get('chainIds')
  const protocols = searchParams?.get('protocols')
  const farmsOnly = searchParams?.get('farmsOnly')

  const parsed = useMemo(() => {
    return poolFiltersSchema.parse({ tokenSymbols, chainIds, protocols, farmsOnly })
  }, [tokenSymbols, chainIds, protocols, farmsOnly])

  const setFilters = useCallback(
    (filters: PoolFilters) => {
      const newFilters = { ...parsed, ...filters }
      void push(parseArgs(newFilters))
    },
    [parsed, push]
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
