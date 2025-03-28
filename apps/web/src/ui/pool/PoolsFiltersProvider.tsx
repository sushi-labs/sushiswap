'use client'

import { useRouter } from 'next/navigation'
import {
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { SushiSwapProtocol } from 'sushi'
import { z } from 'zod'

import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from '../../lib/hooks'
import { POOL_TYPES } from './TableFiltersPoolType'

export const poolFiltersSchema = z.object({
  tokenSymbols: z.coerce.string().transform((symbols) => {
    return symbols.split(',').filter((symbol) => symbol !== '')
  }),
  protocols: z
    .string()
    .transform((protocols) =>
      protocols !== null && protocols !== ','
        ? (protocols.split(',') as SushiSwapProtocol[])
        : [],
    ),
  farmsOnly: z
    .string()
    .transform((bool) => (bool ? bool === 'true' : undefined)),
  smartPoolsOnly: z
    .string()
    .transform((bool) => (bool ? bool === 'true' : undefined)),
})

export type PoolFilters = z.infer<typeof poolFiltersSchema>

type PoolsFiltersContextType = {
  state: PoolFilters
  mutate: {
    setFilters: Dispatch<SetStateAction<PoolFilters>>
  }
}

const FilterContext = createContext<PoolsFiltersContextType | undefined>(
  undefined,
)

interface PoolsFiltersProviderProps {
  children?: ReactNode
}

export const usePoolFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context.state
}

export const useSetPoolFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }
  return context.mutate.setFilters
}

export const PoolsFiltersUrlProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const { push } = useRouter()
  const urlFilters = useTypedSearchParams(poolFiltersSchema.partial())
  const state = useMemo(() => {
    const state: PoolFilters = {
      tokenSymbols: urlFilters.tokenSymbols || [],
      protocols: urlFilters.protocols || POOL_TYPES,
      farmsOnly: urlFilters.farmsOnly,
      smartPoolsOnly: urlFilters.smartPoolsOnly,
    }
    return state
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: Dispatch<SetStateAction<PoolFilters>> = (filters) => {
      if (typeof filters === 'function') {
        void push(parseArgs(filters(state)))
      } else {
        void push(parseArgs(filters))
      }
    }

    return {
      setFilters,
    }
  }, [push, state])

  return (
    <FilterContext.Provider
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const PoolsFiltersStateProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const [filters, setFilters] = useState<PoolFilters>({
    tokenSymbols: [],
    protocols: POOL_TYPES,
    farmsOnly: false,
    smartPoolsOnly: false,
  })

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({ state: filters, mutate: { setFilters } }),
        [filters],
      )}
    >
      {children}
    </FilterContext.Provider>
  )
}

// For backward compatibility
export const PoolsFiltersProvider = PoolsFiltersUrlProvider
