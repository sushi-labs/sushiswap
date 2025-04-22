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
})

export type PoolFilters = z.infer<typeof poolFiltersSchema>

type PoolsFiltersContext = {
  state: PoolFilters
  mutate: {
    setFilters: Dispatch<SetStateAction<Partial<PoolFilters>>>
  }
}

const FilterContext = createContext<PoolsFiltersContext | undefined>(undefined)

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

const PoolsFiltersUrlProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const { replace } = useRouter()

  const urlFilters = useTypedSearchParams(poolFiltersSchema.partial())

  const state = useMemo(() => {
    const { tokenSymbols, protocols, farmsOnly } = urlFilters
    const state: PoolFilters = {
      tokenSymbols: tokenSymbols ? tokenSymbols : [],
      protocols: protocols ? protocols : POOL_TYPES,
      farmsOnly: farmsOnly ? farmsOnly : false,
    }
    return state
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: Dispatch<SetStateAction<Partial<PoolFilters>>> = (
      filters,
    ) => {
      if (typeof filters === 'function') {
        void replace(parseArgs(filters(state)))
      } else {
        void replace(parseArgs(filters))
      }
    }

    return {
      setFilters,
    }
  }, [replace, state])

  return (
    <FilterContext.Provider
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </FilterContext.Provider>
  )
}

const PoolsFiltersLocalStateProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<PoolFilters>({
    tokenSymbols: [],
    protocols: POOL_TYPES,
    farmsOnly: false,
  })

  const mutate = useMemo(() => {
    const setFilters: Dispatch<SetStateAction<Partial<PoolFilters>>> = (
      filters,
    ) => {
      if (typeof filters === 'function') {
        setState({ ...state, ...filters(state) })
      } else {
        setState({ ...state, ...filters })
      }
    }

    return {
      setFilters,
    }
  }, [state])

  return (
    <FilterContext.Provider
      value={useMemo(
        () => ({
          state,
          mutate,
        }),
        [state, mutate],
      )}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const PoolsFiltersProvider: FC<
  PoolsFiltersProviderProps & { url?: boolean }
> = ({ url = true, children }) => {
  return url ? (
    <PoolsFiltersUrlProvider>{children}</PoolsFiltersUrlProvider>
  ) : (
    <PoolsFiltersLocalStateProvider>{children}</PoolsFiltersLocalStateProvider>
  )
}
