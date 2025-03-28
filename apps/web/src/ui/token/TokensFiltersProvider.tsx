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
import { z } from 'zod'
import { useTypedSearchParams } from '../../lib/hooks'

export const tokenFiltersSchema = z.object({
  tokenSymbols: z.coerce.string().transform((symbols) => {
    return symbols.split(',').filter((symbol) => symbol !== '')
  }),
})

export type TokenFilters = z.infer<typeof tokenFiltersSchema>

type TokensFiltersContextType = {
  state: TokenFilters
  mutate: {
    setFilters: Dispatch<SetStateAction<TokenFilters>>
  }
}

const FilterContext = createContext<TokensFiltersContextType | undefined>(
  undefined,
)

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

export const TokensFiltersUrlProvider: FC<TokensFiltersProviderProps> = ({
  children,
}) => {
  const { push } = useRouter()
  const urlFilters = useTypedSearchParams(tokenFiltersSchema.partial())
  const state = useMemo(() => {
    const state: TokenFilters = {
      tokenSymbols: urlFilters.tokenSymbols || [],
    }
    return state
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: Dispatch<SetStateAction<TokenFilters>> = (filters) => {
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

export const TokensFiltersStateProvider: FC<TokensFiltersProviderProps> = ({
  children,
}) => {
  const [filters, setFilters] = useState<TokenFilters>({
    tokenSymbols: [],
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
export const TokensFiltersProvider = TokensFiltersUrlProvider
