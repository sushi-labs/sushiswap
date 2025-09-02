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
import { parseArgs } from 'src/lib/functions'
import { useTypedSearchParams } from 'src/lib/hooks'
import { z } from 'zod'

export const tokenFiltersSchema = z.object({
  tokenSymbols: z.coerce.string().transform((symbols) => {
    return symbols.split(',').filter((symbol) => symbol !== '')
  }),
})

export type TokenFilters = z.infer<typeof tokenFiltersSchema>

type SetFilters = {
  (next: SetStateAction<TokenFilters>): void
  (reset?: undefined): void
}

type TokensFiltersContext = {
  state: TokenFilters
  mutate: {
    setFilters: SetFilters
  }
}

const FilterContext = createContext<TokensFiltersContext | undefined>(undefined)

interface TokensFiltersProviderProps {
  children?: ReactNode
}

export const useTokenFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }

  return context.state
}

export const useSetTokenFilters = () => {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('Hook can only be used inside Filter Context')
  }
  return context.mutate.setFilters
}

const DEFAULT_STATE = {
  tokenSymbols: [],
}

const TokensFiltersUrlProvider: FC<TokensFiltersProviderProps> = ({
  children,
}) => {
  const { replace } = useRouter()
  const urlFilters = useTypedSearchParams(tokenFiltersSchema.partial())
  const state = useMemo(() => {
    const state: TokenFilters = {
      tokenSymbols: urlFilters.tokenSymbols || DEFAULT_STATE.tokenSymbols,
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

const TokensFiltersLocalStateProvider: FC<TokensFiltersProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<TokenFilters>(DEFAULT_STATE)

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
      value={useMemo(() => ({ state, mutate }), [state, mutate])}
    >
      {children}
    </FilterContext.Provider>
  )
}

export const TokensFiltersProvider: FC<
  TokensFiltersProviderProps & { url?: boolean }
> = ({ children, url = true }) => {
  return url ? (
    <TokensFiltersUrlProvider>{children}</TokensFiltersUrlProvider>
  ) : (
    <TokensFiltersLocalStateProvider>
      {children}
    </TokensFiltersLocalStateProvider>
  )
}
