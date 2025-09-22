'use client'

import { useRouter } from 'next/navigation'
import {
  type FC,
  type ReactNode,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { z } from 'zod'

import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from 'src/lib/hooks'

export const poolFiltersSchema = z.object({
  tokenSymbols: z.coerce.string().transform((symbols) => {
    return symbols.split(',').filter((symbol) => symbol !== '')
  }),
})

export type PoolFilters = z.infer<typeof poolFiltersSchema>

type SetFilters = {
  (next: SetStateAction<PoolFilters>): void
  (reset?: undefined): void
}

type PoolsFiltersContext = {
  state: PoolFilters
  mutate: {
    setFilters: SetFilters
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

const DEFAULT_STATE = {
  tokenSymbols: [],
}

const PoolsFiltersUrlProvider: FC<PoolsFiltersProviderProps> = ({
  children,
}) => {
  const { replace } = useRouter()

  const urlFilters = useTypedSearchParams(poolFiltersSchema.partial())

  const state = useMemo(() => {
    const { tokenSymbols } = urlFilters
    const state: PoolFilters = {
      tokenSymbols: tokenSymbols ? tokenSymbols : DEFAULT_STATE.tokenSymbols,
    }
    return state
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        void replace(parseArgs(filters(state)))
      } else {
        void replace(parseArgs(filters ?? {}))
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
  const [state, setState] = useState<PoolFilters>(DEFAULT_STATE)

  const mutate = useMemo(() => {
    const setFilters: SetFilters = (filters) => {
      if (typeof filters === 'function') {
        setState(filters(state))
      } else {
        setState(filters ?? DEFAULT_STATE)
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
