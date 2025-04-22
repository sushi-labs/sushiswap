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

type TokensFiltersContext = {
  state: TokenFilters
  mutate: {
    setFilters: Dispatch<SetStateAction<Partial<TokenFilters>>>
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

const TokensFiltersUrlProvider: FC<TokensFiltersProviderProps> = ({
  children,
}) => {
  const { replace } = useRouter()
  const urlFilters = useTypedSearchParams(tokenFiltersSchema.partial())
  const state = useMemo(() => {
    const state: TokenFilters = {
      tokenSymbols: urlFilters.tokenSymbols || [],
    }
    return state
  }, [urlFilters])

  const mutate = useMemo(() => {
    const setFilters: Dispatch<SetStateAction<Partial<TokenFilters>>> = (
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

const TokensFiltersLocalStateProvider: FC<TokensFiltersProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<TokenFilters>({
    tokenSymbols: [],
  })

  const mutate = useMemo(() => {
    const setFilters: Dispatch<SetStateAction<Partial<TokenFilters>>> = (
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
